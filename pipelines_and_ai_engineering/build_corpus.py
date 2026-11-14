"""Build research_and_data/legal_corpus.jsonl from legal_records.json.

Run from the repo root:  python pipelines_and_ai_engineering/build_corpus.py
Adds nothing that is not in legal_records.json / source_register.csv.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from pipelines_and_ai_engineering.ai.corpus import JsonlCorpus  # noqa: E402

RECORDS = ROOT / "research_and_data" / "legal_records.json"
OUT = ROOT / "research_and_data" / "legal_corpus.jsonl"

# CHECK against retrieval.py / models.py that these values are accepted.
VALIDITY_CURRENT = "current"
VALIDITY_SUPERSEDED = "superseded"

# Copied from research_and_data/source_register.csv
SRC = {
    "SRC-001": dict(
        source_id="SRC-001",
        title="Road Traffic Act Chapter 69:01",
        issuer="MalawiLII",
        url="https://malawilii.org/akn/mw/act/1997/26/eng@2014-12-31",
        version="Displayed version 2014-12-31",
    ),
    "SRC-002": dict(
        source_id="SRC-002",
        title="Road Traffic (Prescribed Offences and Penalties) (Amendment) Regulations 2026 GN 38",
        issuer="MalawiLII",
        url="https://malawilii.org/akn/mw/act/gn/2026/38/eng@2026-05-08",
        version="Gazette Supplement 12A, published 2026-05-08",
        effective_from="2026-05-06",
    ),
    "SRC-005": dict(
        source_id="SRC-005",
        title="Older prescribed penalties schedule (2019)",
        issuer="Malawi Government website",
        url="https://malawi.gov.mw/index.php/resources/documents/notices?download=16:new-miscellaneous-fees-and-prescribed-offences-penalties",
        version="2019",
    ),
}


def source(src_id, verification, validity):
    s = dict(SRC[src_id])
    s.update(verification_status=verification, validity_status=validity, last_verified=None)
    return s


def status_of(raw):
    raw = raw.lower()
    if raw.startswith("conflict"):
        return "conflict"
    if raw.startswith("provisional"):
        return "provisional"
    return "unverified"


def from_penalty_record(r):
    status = status_of(r["verification_status"])
    amount = r.get("amount_mwk")
    conflict = status == "conflict"
    if conflict or amount is None:
        penalty = None
        text = (
            f"{r['offence_label']} ({r['statutory_reference']}). "
            f"The prescribed penalty amount is UNRESOLVED: sources disagree and the official "
            f"Gazette has not been checked. {r['notes']}"
        )
    else:
        penalty = f"MWK {amount:,} (provisional, not verified against the official Gazette)"
        text = (
            f"{r['offence_label']} ({r['statutory_reference']}). "
            f"The prescribed fine is reported as MWK {amount:,}, but this is provisional and has "
            f"not been verified against the official Gazette. {r['notes']}"
        )
    return {
        "evidence_id": r["record_id"],
        "topic": r["offence_label"],
        "provision": r["statutory_reference"],
        "text": text,
        "penalty": penalty,
        "conditions": [
            f"Verification status: {r['verification_status']}",
            f"Confidence: {r['confidence']}",
            f"Source locator: {r['source_locator']}",
            "Prescribed penalty only; this is not the amount owed in any specific case.",
        ],
        "source": source("SRC-002", status, VALIDITY_CURRENT),
    }


EXTRA = [
    {
        "evidence_id": "MW-RT-FRAMEWORK-001",
        "topic": "Road traffic legal framework",
        "provision": "Road Traffic Act, Chapter 69:01",
        "text": (
            "The Road Traffic Act, Chapter 69:01, is the primary Act providing the road traffic "
            "framework in Malawi. The displayed MalawiLII version is dated 2014-12-31 and later "
            "amendments still need a current-consolidation check."
        ),
        "penalty": None,
        "conditions": ["Needs current-consolidation check before production use."],
        "source": source("SRC-001", "provisional", VALIDITY_CURRENT),
    },
    {
        "evidence_id": "MW-RT-SUPERSEDED-2019",
        "topic": "2019 prescribed penalties schedule is historical",
        "provision": "Prescribed offences and penalties schedule (2019)",
        "text": (
            "The 2019 prescribed penalties schedule is historical. The Road Traffic (Prescribed "
            "Offences and Penalties) (Amendment) Regulations 2026, GN 38, replaced the schedule, "
            "so 2019 amounts must not be treated as current."
        ),
        "penalty": None,
        "conditions": ["Historical only; do not use 2019 values as current."],
        "source": source("SRC-005", "provisional", VALIDITY_SUPERSEDED),
    },
]


def main():
    data = json.loads(RECORDS.read_text(encoding="utf-8"))
    rows = [from_penalty_record(r) for r in data["records"]] + EXTRA
    if not rows:
        sys.exit("No records produced; refusing to write an empty corpus.")
    with OUT.open("w", encoding="utf-8", newline="\n") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    loaded = JsonlCorpus.load(OUT)  # validates against the app's own parser
    print(f"OK: wrote and validated {len(loaded)} records to {OUT}")


if __name__ == "__main__":
    main()
