from __future__ import annotations

import json
from pathlib import Path
from typing import Any, List, Mapping, Tuple

from .models import LegalEvidence, LegalSource


class CorpusFormatError(ValueError):
    """Raised when a legal corpus record does not match the documented format."""


def _required_text(record: Mapping[str, Any], key: str, line_number: int) -> str:
    value = record.get(key)
    if not isinstance(value, str) or not value.strip():
        raise CorpusFormatError(f"Line {line_number}: '{key}' must be a non-empty string")
    return value.strip()


def _optional_text(record: Mapping[str, Any], key: str, line_number: int) -> str | None:
    value = record.get(key)
    if value is None:
        return None
    if not isinstance(value, str):
        raise CorpusFormatError(f"Line {line_number}: '{key}' must be a string or null")
    return value.strip() or None


def _parse_record(value: Any, line_number: int) -> LegalEvidence:
    if not isinstance(value, dict):
        raise CorpusFormatError(f"Line {line_number}: each JSONL record must be an object")

    raw_source = value.get("source")
    if not isinstance(raw_source, dict):
        raise CorpusFormatError(f"Line {line_number}: 'source' must be an object")

    source = LegalSource(
        source_id=_required_text(raw_source, "source_id", line_number),
        title=_required_text(raw_source, "title", line_number),
        verification_status=_required_text(raw_source, "verification_status", line_number).lower(),
        validity_status=_required_text(raw_source, "validity_status", line_number).lower(),
        issuer=_optional_text(raw_source, "issuer", line_number),
        url=_optional_text(raw_source, "url", line_number),
        version=_optional_text(raw_source, "version", line_number),
        effective_from=_optional_text(raw_source, "effective_from", line_number),
        effective_to=_optional_text(raw_source, "effective_to", line_number),
        last_verified=_optional_text(raw_source, "last_verified", line_number),
    )

    raw_conditions = value.get("conditions", [])
    if not isinstance(raw_conditions, list) or any(not isinstance(item, str) for item in raw_conditions):
        raise CorpusFormatError(f"Line {line_number}: 'conditions' must be a list of strings")

    return LegalEvidence(
        evidence_id=_required_text(value, "evidence_id", line_number),
        topic=_required_text(value, "topic", line_number),
        provision=_required_text(value, "provision", line_number),
        text=_required_text(value, "text", line_number),
        source=source,
        penalty=_optional_text(value, "penalty", line_number),
        conditions=tuple(item.strip() for item in raw_conditions if item.strip()),
    )


class JsonlCorpus:
    """Loads one self-contained legal evidence record per line from a JSONL file."""

    @staticmethod
    def load(path: str | Path) -> Tuple[LegalEvidence, ...]:
        corpus_path = Path(path)
        records: List[LegalEvidence] = []
        seen_ids = set()
        with corpus_path.open("r", encoding="utf-8") as corpus_file:
            for line_number, line in enumerate(corpus_file, start=1):
                if not line.strip():
                    continue
                try:
                    raw_record = json.loads(line)
                except json.JSONDecodeError as exc:
                    raise CorpusFormatError(
                        f"{corpus_path}:{line_number}: invalid JSON: {exc.msg}"
                    ) from exc
                record = _parse_record(raw_record, line_number)
                if record.evidence_id in seen_ids:
                    raise CorpusFormatError(
                        f"{corpus_path}:{line_number}: duplicate evidence_id '{record.evidence_id}'"
                    )
                seen_ids.add(record.evidence_id)
                records.append(record)
        return tuple(records)
