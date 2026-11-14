from __future__ import annotations

import re
import tempfile
import unittest
from pathlib import Path
from typing import List
from unittest.mock import patch

from fastapi.testclient import TestClient

from pipelines_and_ai_engineering.ai import (
    EngineConfig,
    GeminiGenerationError,
    LegalAssistant,
    LegalEvidence,
    LegalSource,
    LexicalEvidenceRetriever,
)
from pipelines_and_ai_engineering.api import ApiSettings, create_app
from pipelines_and_ai_engineering.api.app import MAX_QUESTION_LENGTH
from pipelines_and_ai_engineering.ai.retrieval import RetrievedEvidence


def evidence(
    evidence_id: str = "ev-1",
    source_id: str = "src-1",
    verification_status: str = "verified",
    validity_status: str = "current",
) -> LegalEvidence:
    source = LegalSource(
        source_id=source_id,
        title=f"Traffic law {source_id}",
        verification_status=verification_status,
        validity_status=validity_status,
        issuer="Malawi",
        url="https://example.invalid/law",
        version="current-edition",
        last_verified="2026-01-01",
    )
    return LegalEvidence(
        evidence_id=evidence_id,
        topic="driving licence",
        provision="Section 12",
        text="A person must hold a valid driving licence.",
        source=source,
        penalty="Not supplied",
        conditions=("Where applicable",),
    )


class FakeGenerator:
    def __init__(self, answer: str = "Hold a valid licence. [E1]", error: Exception | None = None) -> None:
        self.answer = answer
        self.error = error
        self.prompts: List[str] = []

    def generate(self, prompt: str) -> str:
        self.prompts.append(prompt)
        if self.error is not None:
            raise self.error
        return self.answer


def make_client(
    *,
    generator: FakeGenerator | None = None,
    records: tuple[LegalEvidence, ...] | None = None,
    settings: ApiSettings | None = None,
) -> TestClient:
    legal_records = records or (evidence(),)
    assistant = LegalAssistant(
        LexicalEvidenceRetriever(legal_records),
        generator or FakeGenerator(),
    )
    return TestClient(
        create_app(assistant, legal_records, settings or ApiSettings())
    )


class AskEndpointTests(unittest.TestCase):
    def test_supported_answer_serializes_citations_and_stable_fields(self) -> None:
        with make_client() as client:
            response = client.post(
                "/api/ask",
                json={"question": "What is the driving licence rule?"},
            )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["state"], "supported")
        self.assertEqual(body["direct_answer"], "Hold a valid licence. [E1]")
        self.assertIsNone(body["explanation"])
        self.assertIsNone(body["penalty"])
        self.assertEqual(body["qualifications"], [])
        self.assertIsNone(body["official_next_step"])
        self.assertEqual(body["citations"][0]["evidence_id"], "ev-1")
        self.assertEqual(body["citations"][0]["verification_status"], "verified")
        self.assertEqual(body["citations"][0]["validity_status"], "current")
        self.assertEqual(response.headers["x-request-id"], body["request_id"])
        self.assertEqual(response.headers["cache-control"], "no-store")
        self.assertIn("not a determination of guilt", body["verification_note"])

    def test_citation_statuses_are_taken_from_the_evidence(self) -> None:
        provisional = evidence(verification_status="provisional")

        class FixedRetriever:
            def retrieve(self, question: str, limit: int) -> tuple[RetrievedEvidence, ...]:
                return (RetrievedEvidence(provisional, 1.0, ("driving",)),)

        assistant = LegalAssistant(FixedRetriever(), FakeGenerator())
        with TestClient(create_app(assistant, (provisional,))) as client:
            response = client.post(
                "/api/ask",
                json={"question": "What is the driving licence rule?"},
            )

        citation = response.json()["citations"][0]
        self.assertEqual(citation["verification_status"], "provisional")
        self.assertEqual(citation["validity_status"], "current")

    def test_insufficient_evidence_is_preserved(self) -> None:
        generator = FakeGenerator()
        with make_client(generator=generator) as client:
            response = client.post(
                "/api/ask",
                json={"question": "How do I renew a passport?"},
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["state"], "insufficient_evidence")
        self.assertEqual(response.json()["citations"], [])
        self.assertIn("won't guess", response.json()["direct_answer"])
        self.assertIn("can't give a reliable answer yet", response.json()["direct_answer"])
        self.assertEqual(generator.prompts, [])

    def test_empty_malformed_and_blank_question_requests_are_rejected(self) -> None:
        with make_client() as client:
            empty = client.post("/api/ask")
            malformed = client.post(
                "/api/ask",
                content='{"question":',
                headers={"Content-Type": "application/json"},
            )
            blank = client.post("/api/ask", json={"question": "  "})

        for response in (empty, malformed, blank):
            self.assertEqual(response.status_code, 422)
            self.assertEqual(response.json()["error"]["code"], "validation_error")
            self.assertEqual(response.headers["x-request-id"], response.json()["error"]["request_id"])

    def test_extra_fields_and_question_length_are_rejected(self) -> None:
        with make_client() as client:
            extra = client.post(
                "/api/ask",
                json={"question": "licence", "corpus_path": "..\\private.jsonl"},
            )
            too_long = client.post(
                "/api/ask",
                json={"question": "a" * (MAX_QUESTION_LENGTH + 1)},
            )

        self.assertEqual(extra.status_code, 422)
        self.assertEqual(too_long.status_code, 422)

    def test_request_body_limit_returns_413(self) -> None:
        settings = ApiSettings(max_request_bytes=128)
        with make_client(settings=settings) as client:
            response = client.post(
                "/api/ask",
                json={"question": "a" * 200},
            )

        self.assertEqual(response.status_code, 413)
        self.assertEqual(response.json()["error"]["code"], "request_too_large")
        self.assertEqual(response.headers["x-request-id"], response.json()["error"]["request_id"])

    def test_chunked_request_body_is_limited_across_chunks(self) -> None:
        settings = ApiSettings(max_request_bytes=128)
        payload = b'{"question":"' + b"a" * 200 + b'"}'
        chunks = (payload[:40], payload[40:80], payload[80:])
        with make_client(settings=settings) as client:
            response = client.post(
                "/api/ask",
                content=iter(chunks),
                headers={"Content-Type": "application/json"},
            )

        self.assertEqual(response.status_code, 413)
        self.assertEqual(response.json()["error"]["code"], "request_too_large")

    def test_request_ids_are_generated_and_untrusted_client_id_is_ignored(self) -> None:
        with make_client() as client:
            first = client.post(
                "/api/ask",
                json={"question": "What is the driving licence rule?"},
                headers={"X-Request-ID": "client-controlled"},
            )
            second = client.post(
                "/api/ask",
                json={"question": "What is the driving licence rule?"},
                headers={"X-Request-ID": "client-controlled"},
            )

        self.assertNotEqual(first.json()["request_id"], "client-controlled")
        self.assertNotEqual(first.json()["request_id"], second.json()["request_id"])
        self.assertEqual(first.headers["x-request-id"], first.json()["request_id"])

    def test_gemini_failure_and_unexpected_engine_error_are_safe(self) -> None:
        with make_client(generator=FakeGenerator(error=GeminiGenerationError("secret details"))) as client:
            upstream = client.post("/api/ask", json={"question": "driving licence"})
        with make_client(generator=FakeGenerator(error=ValueError("secret details"))) as client:
            unexpected = client.post("/api/ask", json={"question": "driving licence"})

        self.assertEqual(upstream.status_code, 502)
        self.assertEqual(upstream.json()["error"]["code"], "assistant_unavailable")
        self.assertEqual(unexpected.status_code, 500)
        self.assertEqual(unexpected.json()["error"]["code"], "assistant_failure")
        self.assertNotIn("secret details", upstream.text + unexpected.text)
        self.assertNotIn("Traceback", upstream.text + unexpected.text)

    def test_reserved_states_are_documented_but_not_assumed_detected(self) -> None:
        with make_client() as client:
            schema = client.get("/openapi.json").json()

        states = schema["components"]["schemas"]["AnswerState"]["enum"]
        self.assertEqual(
            states,
            [
                "supported",
                "insufficient_evidence",
                "conflicting_sources",
                "possibly_outdated",
                "needs_clarification",
                "technical_failure",
            ],
        )


class SourceEndpointTests(unittest.TestCase):
    def test_lists_sources_with_verification_metadata(self) -> None:
        records = (
            evidence("ev-1", "src-current"),
            evidence("ev-2", "src-unverified", "unverified", "unknown"),
        )
        with make_client(records=records) as client:
            response = client.get("/api/sources")

        self.assertEqual(response.status_code, 200)
        sources = {source["source_id"]: source for source in response.json()["sources"]}
        self.assertEqual(sources["src-current"]["validity_status"], "current")
        self.assertEqual(sources["src-current"]["url"], "https://example.invalid/law")
        self.assertEqual(sources["src-unverified"]["verification_status"], "unverified")
        self.assertIsNone(sources["src-unverified"]["url"])
        self.assertNotIn("corpus_path", response.text)

    def test_known_source_details_include_provisions_and_unknown_is_404(self) -> None:
        records = (evidence(), evidence("ev-2", "src-1"))
        with make_client(records=records) as client:
            known = client.get("/api/sources/src-1")
            unknown = client.get("/api/sources/not-known")

        self.assertEqual(known.status_code, 200)
        self.assertEqual(
            [item["evidence_id"] for item in known.json()["provisions"]],
            ["ev-1", "ev-2"],
        )
        self.assertEqual(known.json()["provisions"][0]["penalty"], "Not supplied")
        self.assertEqual(unknown.status_code, 404)
        self.assertEqual(unknown.json()["error"]["code"], "not_found")

    def test_unverified_source_does_not_publish_provisions_or_url(self) -> None:
        records = (evidence(verification_status="pending", validity_status="unknown"),)
        with make_client(records=records) as client:
            response = client.get("/api/sources/src-1")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["provisions"], [])
        self.assertIsNone(response.json()["url"])


class OtherEndpointTests(unittest.TestCase):
    def test_report_validation_and_unavailable_storage_response(self) -> None:
        with make_client() as client:
            invalid = client.post(
                "/api/reports",
                json={"category": "other", "note": "Bad answer"},
            )
            oversized_note = client.post(
                "/api/reports",
                json={"category": "incorrect_answer", "note": "a" * 1001},
            )
            unavailable = client.post(
                "/api/reports",
                json={"category": "incorrect_answer", "note": "Please review this"},
            )
            openapi = client.get("/openapi.json").json()

        self.assertEqual(invalid.status_code, 422)
        self.assertEqual(oversized_note.status_code, 422)
        self.assertEqual(unavailable.status_code, 503)
        self.assertEqual(
            unavailable.json()["error"]["code"],
            "report_storage_unavailable",
        )
        self.assertIn("not being stored", unavailable.json()["error"]["message"])
        report_responses = openapi["paths"]["/api/reports"]["post"]["responses"]
        self.assertNotIn("200", report_responses)
        self.assertIn("503", report_responses)

    def test_health_is_minimal_and_live(self) -> None:
        with make_client() as client:
            root_response = client.get("/")
            response = client.get("/api/health")

        self.assertEqual(root_response.status_code, 200)
        self.assertIn("MRTLA Malawi", root_response.text)
        self.assertIn('id="root"', root_response.text)
        self.assertTrue(root_response.headers["x-request-id"])
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})
        self.assertTrue(response.headers["x-request-id"])

    def test_react_routes_and_built_assets_are_served(self) -> None:
        if not Path("frontend/dist/index.html").is_file():
            self.skipTest("Build the React frontend before testing its production routes.")

        with make_client() as client:
            page = client.get("/Ask.html")
            article_page = client.get("/articles/how-to-read-a-legal-source")
            missing_asset = client.get("/assets/missing.js")
            asset_paths = re.findall(r'(?:src|href)="(/assets/[^"]+)"', page.text)
            assets = [client.get(path) for path in asset_paths]

        self.assertEqual(page.status_code, 200)
        self.assertIn('id="root"', page.text)
        self.assertEqual(article_page.status_code, 200)
        self.assertIn('id="root"', article_page.text)
        self.assertEqual(missing_asset.status_code, 404)
        self.assertEqual(len(assets), 2)
        self.assertTrue(all(asset.status_code == 200 for asset in assets))
        self.assertIn("/api/ask", assets[0].text + assets[1].text)

    def test_unexpected_route_error_uses_safe_generic_response(self) -> None:
        records = (evidence(),)
        assistant = LegalAssistant(
            LexicalEvidenceRetriever(records),
            FakeGenerator(),
        )
        app = create_app(assistant, records)
        with TestClient(app, raise_server_exceptions=False) as client:
            client.app.state.runtime = None
            response = client.get("/api/sources")

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json()["error"]["code"], "internal_error")
        self.assertNotIn("Traceback", response.text)
        self.assertEqual(
            response.headers["x-request-id"],
            response.json()["error"]["request_id"],
        )

    def test_rate_limit_is_configurable(self) -> None:
        settings = ApiSettings(
            rate_limit_requests=1,
            rate_limit_window_seconds=60,
        )
        with make_client(settings=settings) as client:
            first = client.get("/api/health")
            second = client.get("/api/health")

        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 429)
        self.assertEqual(second.json()["error"]["code"], "rate_limit_exceeded")

    def test_cors_allows_only_configured_origins_without_credentials(self) -> None:
        settings = ApiSettings(allowed_origins=("https://assistant.example",))
        with make_client(settings=settings) as client:
            allowed = client.get(
                "/api/health",
                headers={"Origin": "https://assistant.example"},
            )
            denied = client.get(
                "/api/health",
                headers={"Origin": "https://untrusted.example"},
            )

        self.assertEqual(
            allowed.headers["access-control-allow-origin"],
            "https://assistant.example",
        )
        self.assertNotIn("access-control-allow-credentials", allowed.headers)
        self.assertEqual(
            allowed.headers["access-control-expose-headers"],
            "X-Request-ID",
        )
        self.assertNotIn("access-control-allow-origin", denied.headers)

    def test_startup_fails_when_engine_configuration_is_missing(self) -> None:
        with patch(
            "pipelines_and_ai_engineering.api.app.EngineConfig.from_environment",
            side_effect=ValueError("GEMINI_API_KEY is required"),
        ):
            with self.assertRaisesRegex(ValueError, "GEMINI_API_KEY is required"):
                with TestClient(create_app(settings=ApiSettings())):
                    pass

    def test_startup_fails_when_corpus_is_missing(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            missing_corpus = Path(directory) / "missing.jsonl"
            config = EngineConfig(
                api_key="test-key",
                corpus_path=str(missing_corpus),
            )
            with patch(
                "pipelines_and_ai_engineering.api.app.EngineConfig.from_environment",
                return_value=config,
            ):
                with self.assertRaises(FileNotFoundError):
                    with TestClient(create_app(settings=ApiSettings())):
                        pass

    def test_api_origin_settings_reject_wildcards_and_paths(self) -> None:
        for invalid_origin in ("*", "https://example.com/path"):
            with self.subTest(origin=invalid_origin):
                with patch.dict(
                    "os.environ",
                    {"API_ALLOWED_ORIGINS": invalid_origin},
                    clear=False,
                ):
                    with self.assertRaisesRegex(ValueError, "explicit origin"):
                        ApiSettings.from_environment()


if __name__ == "__main__":
    unittest.main()
