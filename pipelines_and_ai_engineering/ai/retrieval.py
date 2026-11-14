from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Protocol, Sequence, Tuple

from .models import LegalEvidence


_STOP_WORDS = {
    "a", "about", "an", "and", "are", "as", "at", "be", "by", "can", "do",
    "does", "for", "from", "how", "i", "in", "is", "it", "me", "of", "on",
    "or", "the", "this", "to", "what", "when", "where", "which", "who",
    "why", "with", "would",
}


def _terms(text: str) -> set[str]:
    return {term for term in re.findall(r"[a-z0-9]+", text.casefold()) if term not in _STOP_WORDS}


@dataclass(frozen=True)
class RetrievedEvidence:
    evidence: LegalEvidence
    relevance: float
    matched_terms: Tuple[str, ...]


class EvidenceRetriever(Protocol):
    def retrieve(self, question: str, limit: int) -> Tuple[RetrievedEvidence, ...]:
        """Return relevant verified evidence in descending relevance order."""


class LexicalEvidenceRetriever:
    """Dependency-free starter retriever over approved evidence records."""

    def __init__(
        self,
        records: Sequence[LegalEvidence],
        minimum_relevance: float = 0.25,
        allow_provisional: bool = False,
    ) -> None:
        if not 0.0 <= minimum_relevance <= 1.0:
            raise ValueError("minimum_relevance must be between 0 and 1")
        self._records = tuple(records)
        self._minimum_relevance = minimum_relevance
        self._allow_provisional = allow_provisional

    def retrieve(self, question: str, limit: int = 5) -> Tuple[RetrievedEvidence, ...]:
        if limit < 1:
            raise ValueError("limit must be greater than zero")
        query_terms = _terms(question)
        if not query_terms:
            return ()

        candidates = []
        for evidence in self._records:
            if not (
                evidence.source.is_usable
                or (self._allow_provisional and evidence.source.is_provisional)
            ):
                continue
            searchable_text = " ".join(
                (evidence.topic, evidence.provision, evidence.text, evidence.source.title)
            )
            matched_terms = query_terms & _terms(searchable_text)
            relevance = len(matched_terms) / len(query_terms)
            if relevance >= self._minimum_relevance:
                candidates.append(
                    RetrievedEvidence(
                        evidence=evidence,
                        relevance=relevance,
                        matched_terms=tuple(sorted(matched_terms)),
                    )
                )

        candidates.sort(
            key=lambda item: (-item.relevance, -len(item.matched_terms), item.evidence.evidence_id)
        )
        return tuple(candidates[:limit])
