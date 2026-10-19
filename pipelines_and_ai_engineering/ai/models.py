from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Tuple


@dataclass(frozen=True)
class LegalSource:
    source_id: str
    title: str
    verification_status: str
    validity_status: str
    issuer: Optional[str] = None
    url: Optional[str] = None
    version: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    last_verified: Optional[str] = None

    @property
    def is_usable(self) -> bool:
        return self.verification_status == "verified" and self.validity_status == "current"


@dataclass(frozen=True)
class LegalEvidence:
    evidence_id: str
    topic: str
    provision: str
    text: str
    source: LegalSource
    penalty: Optional[str] = None
    conditions: Tuple[str, ...] = ()

    @property
    def citation(self) -> str:
        return ", ".join(part for part in (self.source.title, self.provision) if part)


@dataclass(frozen=True)
class Citation:
    evidence_id: str
    source_id: str
    title: str
    provision: str
    url: Optional[str]
    version: Optional[str]
    last_verified: Optional[str]


@dataclass(frozen=True)
class AssistantResult:
    status: str
    answer: str
    citations: Tuple[Citation, ...] = ()
