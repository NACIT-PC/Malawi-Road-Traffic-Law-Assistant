from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping, Optional

from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parents[2]


@dataclass(frozen=True)
class EngineConfig:
    api_key: str
    model: str = "gemini-3.8-flash"
    max_output_tokens: int = 4096
    thinking_level: str = "medium"
    corpus_path: str = "research_and_data/legal_corpus.jsonl"
    retrieval_limit: int = 5
    minimum_relevance: float = 0.25
    timeout_ms: int = 30000
    allow_provisional: bool = False

    @classmethod
    def from_environment(cls, environ: Optional[Mapping[str, str]] = None) -> "EngineConfig":
        if environ is None:
            load_dotenv(dotenv_path=PROJECT_ROOT / ".env", override=False)
        values = os.environ if environ is None else environ
        api_key = values.get("GEMINI_API_KEY", "").strip()
        if not api_key:
            raise ValueError("GEMINI_API_KEY is required to use the Gemini engine")

        try:
            max_output_tokens = int(values.get("GEMINI_MAX_OUTPUT_TOKENS", "4096"))
            timeout_ms = int(values.get("GEMINI_TIMEOUT_MS", "30000"))
            retrieval_limit = int(values.get("LEGAL_RETRIEVAL_LIMIT", "5"))
            minimum_relevance = float(values.get("LEGAL_MINIMUM_RELEVANCE", "0.25"))
        except ValueError as exc:
            raise ValueError("Gemini/retrieval numeric environment settings are invalid") from exc

        if max_output_tokens < 1:
            raise ValueError("GEMINI_MAX_OUTPUT_TOKENS must be greater than zero")
        if timeout_ms < 1:
            raise ValueError("GEMINI_TIMEOUT_MS must be greater than zero")
        if retrieval_limit < 1:
            raise ValueError("LEGAL_RETRIEVAL_LIMIT must be greater than zero")
        if not 0.0 <= minimum_relevance <= 1.0:
            raise ValueError("LEGAL_MINIMUM_RELEVANCE must be between 0 and 1")

        return cls(
            api_key=api_key,
            model=values.get("GEMINI_MODEL", "gemini-3.8-flash").strip(),
            max_output_tokens=max_output_tokens,
            thinking_level=values.get("GEMINI_THINKING_LEVEL", "medium").strip(),
            timeout_ms=timeout_ms,
            corpus_path=values.get("LEGAL_CORPUS_PATH", "research_and_data/legal_corpus.jsonl"),
            retrieval_limit=retrieval_limit,
            minimum_relevance=minimum_relevance,
            allow_provisional=values.get("ALLOW_PROVISIONAL", "false").strip().lower() in {"1", "true", "yes"},
        )
