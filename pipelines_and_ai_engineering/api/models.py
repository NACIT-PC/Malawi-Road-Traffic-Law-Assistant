from __future__ import annotations

from enum import Enum
from typing import Optional, Tuple

from pydantic import BaseModel, ConfigDict, Field, field_validator


class AnswerState(str, Enum):
    SUPPORTED = "supported"
    INSUFFICIENT_EVIDENCE = "insufficient_evidence"
    GENERAL_RESPONSE = "general_response"
    CONFLICTING_SOURCES = "conflicting_sources"
    POSSIBLY_OUTDATED = "possibly_outdated"
    NEEDS_CLARIFICATION = "needs_clarification"
    TECHNICAL_FAILURE = "technical_failure"


class ErrorBody(BaseModel):
    code: str
    message: str
    request_id: str


class ErrorResponse(BaseModel):
    error: ErrorBody


class AskRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    question: str = Field(min_length=1, max_length=2000)

    @field_validator("question")
    @classmethod
    def question_must_not_be_blank(cls, question: str) -> str:
        question = question.strip()
        if not question:
            raise ValueError("question must not be blank")
        return question


class CitationResponse(BaseModel):
    evidence_id: str
    source_id: str
    title: str
    provision: str
    url: Optional[str] = None
    version: Optional[str] = None
    last_verified: Optional[str] = None
    verification_status: str = "verified"
    validity_status: str = "current"


class AskResponse(BaseModel):
    request_id: str
    state: AnswerState
    direct_answer: str
    explanation: Optional[str] = None
    citations: Tuple[CitationResponse, ...] = ()
    penalty: Optional[str] = None
    qualifications: Tuple[str, ...] = ()
    official_next_step: Optional[str] = None
    verification_note: str


class SourceSummary(BaseModel):
    source_id: str
    title: str
    issuer: Optional[str] = None
    verification_status: str
    validity_status: str
    version: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    last_verified: Optional[str] = None
    url: Optional[str] = None


class SourceListResponse(BaseModel):
    sources: Tuple[SourceSummary, ...]


class SourceProvision(BaseModel):
    evidence_id: str
    topic: str
    provision: str
    text: str
    penalty: Optional[str] = None
    conditions: Tuple[str, ...] = ()


class SourceDetailResponse(SourceSummary):
    provisions: Tuple[SourceProvision, ...] = ()


class ReportCategory(str, Enum):
    INCORRECT_ANSWER = "incorrect_answer"
    INCORRECT_CITATION = "incorrect_citation"
    BROKEN_SOURCE_LINK = "broken_source_link"


class ReportRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    category: ReportCategory
    answer_id: Optional[str] = Field(default=None, max_length=100)
    note: Optional[str] = Field(default=None, max_length=1000)

    @field_validator("answer_id", "note")
    @classmethod
    def optional_text_must_not_be_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        value = value.strip()
        if not value:
            return None
        return value

