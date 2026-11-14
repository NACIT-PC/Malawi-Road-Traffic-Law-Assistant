from __future__ import annotations

import logging
import os
import threading
import time
from contextlib import asynccontextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import AsyncGenerator, Dict, Optional, Sequence, Tuple
from urllib.parse import urlsplit
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from pipelines_and_ai_engineering.ai import (
    EngineConfig,
    GeminiGenerationError,
    GeminiTextGenerator,
    JsonlCorpus,
    LegalAssistant,
    LegalEvidence,
    LexicalEvidenceRetriever,
    UncitedAnswerError,
)
from pipelines_and_ai_engineering.ai.config import PROJECT_ROOT

from .models import (
    AnswerState,
    AskRequest,
    AskResponse,
    CitationResponse,
    ErrorBody,
    ErrorResponse,
    ReportRequest,
    SourceDetailResponse,
    SourceListResponse,
    SourceProvision,
    SourceSummary,
)


logger = logging.getLogger(__name__)
MAX_QUESTION_LENGTH = 2000
VERIFICATION_NOTE = (
    "This is legal information, not a determination of guilt, proof that a fine "
    "was issued, or confirmation of payment."
)
COMMON_ERROR_RESPONSES = {
    413: {"model": ErrorResponse, "description": "Request body too large"},
    429: {"model": ErrorResponse, "description": "Rate limit exceeded"},
    500: {"model": ErrorResponse, "description": "Internal failure"},
}


@dataclass(frozen=True)
class ApiSettings:
    allowed_origins: Tuple[str, ...] = ()
    max_request_bytes: int = 16384
    rate_limit_requests: int = 60
    rate_limit_window_seconds: int = 60

    @classmethod
    def from_environment(cls) -> "ApiSettings":
        load_dotenv(dotenv_path=PROJECT_ROOT / ".env", override=False)
        try:
            max_request_bytes = int(os.environ.get("API_MAX_REQUEST_BYTES", "16384"))
            rate_limit_requests = int(os.environ.get("API_RATE_LIMIT_REQUESTS", "60"))
            rate_limit_window_seconds = int(os.environ.get("API_RATE_LIMIT_WINDOW_SECONDS", "60"))
        except ValueError as exc:
            raise ValueError("API numeric environment settings must be integers") from exc

        if not 1 <= max_request_bytes <= 1_048_576:
            raise ValueError("API_MAX_REQUEST_BYTES must be between 1 and 1048576")
        if not 1 <= rate_limit_requests <= 10000:
            raise ValueError("API_RATE_LIMIT_REQUESTS must be between 1 and 10000")
        if not 1 <= rate_limit_window_seconds <= 3600:
            raise ValueError("API_RATE_LIMIT_WINDOW_SECONDS must be between 1 and 3600")

        origins = tuple(
            origin.strip()
            for origin in os.environ.get("API_ALLOWED_ORIGINS", "").split(",")
            if origin.strip()
        )
        for origin in origins:
            parsed = urlsplit(origin)
            if (
                parsed.scheme not in {"http", "https"}
                or not parsed.netloc
                or parsed.path
                or parsed.query
                or parsed.fragment
                or parsed.username
                or parsed.password
                or origin == "*"
            ):
                raise ValueError("API_ALLOWED_ORIGINS must contain explicit origin URLs")

        return cls(
            allowed_origins=origins,
            max_request_bytes=max_request_bytes,
            rate_limit_requests=rate_limit_requests,
            rate_limit_window_seconds=rate_limit_window_seconds,
        )


@dataclass(frozen=True)
class Runtime:
    assistant: LegalAssistant
    records: Tuple[LegalEvidence, ...]


class RequestMiddleware:
    def __init__(
        self,
        app: ASGIApp,
        settings: ApiSettings,
    ) -> None:
        self.app = app
        self.settings = settings
        self._lock = threading.Lock()
        self._buckets: Dict[Tuple[str, int], int] = {}

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request_id = str(uuid4())
        scope.setdefault("state", {})["request_id"] = request_id
        path = scope.get("path", "")
        is_api_request = path.startswith("/api/")
        response_started = False

        async def send_with_headers(message: Message) -> None:
            nonlocal response_started
            if message["type"] == "http.response.start":
                response_started = True
                headers = list(message.get("headers", []))
                headers.extend(
                    [
                        (b"x-request-id", request_id.encode("ascii")),
                        (b"x-content-type-options", b"nosniff"),
                        (b"cache-control", b"no-store"),
                    ]
                )
                message = {**message, "headers": headers}
            await send(message)

        async def run_application(receive_to_use: Receive) -> None:
            try:
                await self.app(scope, receive_to_use, send_with_headers)
            except Exception as exc:
                if response_started:
                    raise
                logger.error(
                    "Unhandled API exception request_id=%s exception_type=%s",
                    request_id,
                    type(exc).__name__,
                )
                await self._send_error(
                    send_with_headers,
                    status_code=500,
                    code="internal_error",
                    message="The request could not be completed.",
                    request_id=request_id,
                )

        if is_api_request and scope["method"] != "OPTIONS":
            client = scope.get("client")
            client_key = client[0] if client else "unknown"
            now = time.monotonic()
            window = int(now // self.settings.rate_limit_window_seconds)
            bucket_key = (client_key, window)
            with self._lock:
                count = self._buckets.get(bucket_key, 0)
                if count >= self.settings.rate_limit_requests:
                    limited = True
                else:
                    self._buckets[bucket_key] = count + 1
                    limited = False
                if len(self._buckets) > 10000:
                    oldest_window = window - 1
                    self._buckets = {
                        key: value for key, value in self._buckets.items()
                        if key[1] >= oldest_window
                    }
            if limited:
                await self._send_error(
                    send_with_headers,
                    status_code=429,
                    code="rate_limit_exceeded",
                    message="Too many requests. Please try again later.",
                    request_id=request_id,
                )
                return

            async def receive_limited() -> Message:
                nonlocal bytes_received
                message = await receive()
                if message["type"] == "http.request":
                    bytes_received += len(message.get("body", b""))
                    if bytes_received > self.settings.max_request_bytes:
                        raise HTTPException(
                            status_code=413,
                            detail="Request body exceeds the allowed size.",
                        )
                return message

            content_length = next(
                (
                    value
                    for key, value in scope.get("headers", [])
                    if key.lower() == b"content-length"
                ),
                None,
            )
            if content_length is not None:
                try:
                    if int(content_length) > self.settings.max_request_bytes:
                        await self._send_error(
                            send_with_headers,
                            status_code=413,
                            code="request_too_large",
                            message="Request body exceeds the allowed size.",
                            request_id=request_id,
                        )
                        return
                except ValueError:
                    pass

            bytes_received = 0
            await run_application(receive_limited)
            return

        await run_application(receive)

    @staticmethod
    async def _send_error(
        send: Send,
        status_code: int,
        code: str,
        message: str,
        request_id: str,
    ) -> None:
        body = ErrorResponse(
            error=ErrorBody(code=code, message=message, request_id=request_id)
        ).model_dump_json().encode("utf-8")
        await send(
            {
                "type": "http.response.start",
                "status": status_code,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"content-length", str(len(body)).encode("ascii")),
                ],
            }
        )
        await send({"type": "http.response.body", "body": body})


def _source_summary(source: LegalEvidence) -> SourceSummary:
    metadata = source.source
    return SourceSummary(
        source_id=metadata.source_id,
        title=metadata.title,
        issuer=metadata.issuer,
        verification_status=metadata.verification_status,
        validity_status=metadata.validity_status,
        version=metadata.version,
        effective_from=metadata.effective_from,
        effective_to=metadata.effective_to,
        last_verified=metadata.last_verified,
        url=metadata.url if metadata.is_usable else None,
    )


def _unique_sources(records: Sequence[LegalEvidence]) -> Tuple[LegalEvidence, ...]:
    sources: Dict[str, LegalEvidence] = {}
    for record in records:
        sources.setdefault(record.source.source_id, record)
    return tuple(sources.values())


def create_app(
    assistant: Optional[LegalAssistant] = None,
    records: Optional[Sequence[LegalEvidence]] = None,
    settings: Optional[ApiSettings] = None,
) -> FastAPI:
    api_settings = settings or ApiSettings.from_environment()
    injected_runtime = (
        Runtime(assistant, tuple(records or ()))
        if assistant is not None
        else None
    )

    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncGenerator[None, None]:
        if injected_runtime is not None:
            application.state.runtime = injected_runtime
        else:
            config = EngineConfig.from_environment()
            corpus_records = JsonlCorpus.load(config.corpus_path)
            application.state.runtime = Runtime(
                assistant=LegalAssistant(
                    retriever=LexicalEvidenceRetriever(
                        corpus_records, config.minimum_relevance, config.allow_provisional
                    ),
                    generator=GeminiTextGenerator(config),
                    retrieval_limit=config.retrieval_limit,
                ),
                records=corpus_records,
            )
        try:
            yield
        finally:
            application.state.runtime = None

    application = FastAPI(
        title="Malawi Road Traffic Law Assistant API",
        description=(
            "Evidence-based informational responses about Malawi road-traffic law. "
            "This API does not determine guilt, issue fines, or process payments."
        ),
        version="0.1.0",
        lifespan=lifespan,
    )
    application.add_middleware(RequestMiddleware, settings=api_settings)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=list(api_settings.allowed_origins),
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        expose_headers=["X-Request-ID"],
    )

    @application.exception_handler(RequestValidationError)
    async def validation_error_handler(
        request: Request, _: RequestValidationError
    ) -> JSONResponse:
        request_id = request.state.request_id
        response = ErrorResponse(
            error=ErrorBody(
                code="validation_error",
                message="Request validation failed.",
                request_id=request_id,
            )
        )
        return JSONResponse(status_code=422, content=response.model_dump(mode="json"))

    @application.exception_handler(StarletteHTTPException)
    async def http_error_handler(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        known_errors = {
            404: ("not_found", "The requested resource was not found."),
            405: ("method_not_allowed", "The requested method is not allowed."),
            413: ("request_too_large", "Request body exceeds the allowed size."),
        }
        code, message = known_errors.get(
            exc.status_code, ("request_error", "The request could not be completed.")
        )
        response = ErrorResponse(
            error=ErrorBody(
                code=code,
                message=message,
                request_id=request.state.request_id,
            )
        )
        return JSONResponse(status_code=exc.status_code, content=response.model_dump(mode="json"))

    @application.post(
        "/api/ask",
        response_model=AskResponse,
        responses={
            **COMMON_ERROR_RESPONSES,
            422: {"model": ErrorResponse, "description": "Invalid request"},
            502: {"model": ErrorResponse, "description": "Assistant unavailable"},
        },
        tags=["assistant"],
        summary="Ask a road-traffic law question",
    )
    def ask_question(body: AskRequest, request: Request) -> AskResponse:
        runtime: Optional[Runtime] = request.app.state.runtime
        if runtime is None:
            raise RuntimeError("Application runtime is not initialized")
        try:
            result = runtime.assistant.ask(body.question)
        except (GeminiGenerationError, UncitedAnswerError) as exc:
            logger.warning(
                "Assistant upstream failure request_id=%s exception_type=%s",
                request.state.request_id,
                type(exc).__name__,
            )
            response = ErrorResponse(
                error=ErrorBody(
                    code="assistant_unavailable",
                    message="The assistant could not provide a reliable response.",
                    request_id=request.state.request_id,
                )
            )
            return Response(
                content=response.model_dump_json(),
                status_code=502,
                media_type="application/json",
            )
        except Exception as exc:
            logger.error(
                "Assistant failure request_id=%s exception_type=%s",
                request.state.request_id,
                type(exc).__name__,
            )
            response = ErrorResponse(
                error=ErrorBody(
                    code="assistant_failure",
                    message="The assistant could not process the request.",
                    request_id=request.state.request_id,
                )
            )
            return Response(
                content=response.model_dump_json(),
                status_code=500,
                media_type="application/json",
            )

        if result.status == "answered":
            state = AnswerState.SUPPORTED
        elif result.status == "insufficient_evidence":
            state = AnswerState.INSUFFICIENT_EVIDENCE
        else:
            raise RuntimeError("Assistant returned an unsupported result state")
        citations = tuple(
            CitationResponse(
                evidence_id=citation.evidence_id,
                source_id=citation.source_id,
                title=citation.title,
                provision=citation.provision,
                url=citation.url,
                version=citation.version,
                last_verified=citation.last_verified,
                verification_status=citation.verification_status,
                validity_status=citation.validity_status,
            )
            for citation in result.citations
        )
        return AskResponse(
            request_id=request.state.request_id,
            state=state,
            direct_answer=result.answer,
            citations=citations,
            verification_note=VERIFICATION_NOTE,
        )

    @application.get(
        "/api/sources",
        response_model=SourceListResponse,
        responses=COMMON_ERROR_RESPONSES,
        tags=["sources"],
        summary="List legal sources",
    )
    def list_sources(request: Request) -> SourceListResponse:
        runtime: Optional[Runtime] = request.app.state.runtime
        if runtime is None:
            raise RuntimeError("Application runtime is not initialized")
        sources = tuple(
            _source_summary(record)
            for record in _unique_sources(runtime.records)
        )
        return SourceListResponse(sources=sources)

    @application.get(
        "/api/sources/{source_id}",
        response_model=SourceDetailResponse,
        responses={
            **COMMON_ERROR_RESPONSES,
            404: {"model": ErrorResponse, "description": "Source not found"},
        },
        tags=["sources"],
        summary="Get legal source details",
    )
    def get_source(source_id: str, request: Request) -> SourceDetailResponse:
        runtime: Optional[Runtime] = request.app.state.runtime
        if runtime is None:
            raise RuntimeError("Application runtime is not initialized")
        matching = tuple(
            record for record in runtime.records
            if record.source.source_id == source_id
        )
        if not matching:
            raise HTTPException(status_code=404)
        source = matching[0].source
        provisions = (
            tuple(
                SourceProvision(
                    evidence_id=record.evidence_id,
                    topic=record.topic,
                    provision=record.provision,
                    text=record.text,
                    penalty=record.penalty,
                    conditions=record.conditions,
                )
                for record in matching
                if record.source.is_usable
            )
            if source.is_usable
            else ()
        )
        return SourceDetailResponse(
            **_source_summary(matching[0]).model_dump(),
            provisions=provisions,
        )

    @application.post(
        "/api/reports",
        status_code=503,
        response_model=ErrorResponse,
        responses={
            **COMMON_ERROR_RESPONSES,
            422: {"model": ErrorResponse, "description": "Invalid report"},
            503: {"model": ErrorResponse, "description": "Report storage unavailable"},
        },
        tags=["reports"],
        summary="Submit a report",
    )
    def submit_report(body: ReportRequest, request: Request) -> ErrorResponse:
        del body
        return ErrorResponse(
            error=ErrorBody(
                code="report_storage_unavailable",
                message="Reports are not being stored because report storage is not configured.",
                request_id=request.state.request_id,
            )
        )

    @application.get(
        "/api/health",
        responses=COMMON_ERROR_RESPONSES,
        tags=["health"],
        summary="Check API liveness",
    )
    def health() -> Dict[str, str]:
        return {"status": "ok"}

    frontend_build = (PROJECT_ROOT / "frontend" / "dist").resolve()
    frontend_index = frontend_build / "index.html"
    legacy_frontend_paths = {
        "Ask.html",
        "road.html",
        "legal-sources.html",
        "how-it-works.html",
        "about.html",
    }

    @application.get("/", include_in_schema=False)
    @application.get("/{frontend_path:path}", include_in_schema=False)
    def frontend_page(frontend_path: str = "") -> FileResponse:
        candidate = (frontend_build / frontend_path).resolve()
        try:
            candidate.relative_to(frontend_build)
        except ValueError as exc:
            raise HTTPException(status_code=404) from exc

        if frontend_path and candidate.is_file():
            return FileResponse(candidate)
        if frontend_path and Path(frontend_path).suffix and frontend_path not in legacy_frontend_paths:
            raise HTTPException(status_code=404)
        if not frontend_index.is_file():
            raise HTTPException(status_code=503, detail="Frontend build is unavailable.")
        return FileResponse(frontend_index)

    return application


app = create_app()
