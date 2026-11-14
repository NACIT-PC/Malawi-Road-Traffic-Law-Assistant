import json
from pathlib import Path

path = Path("research_and_data/legal_records.json")
data = json.loads(path.read_text(encoding="utf-8"))
existing = {r["record_id"] for r in data["records"]}

NATION = "Nation Online 2026-05-13 (SRC-006), secondary source"
STATUS = "provisional_secondary_crosscheck_primary_pdf_required"
SECTION = "Section/schedule item not yet confirmed; take from official GN 38 schedule"

def rec(n, label, amount, notes):
    return {
        "record_id": f"MW-RT-PEN-2026-{n:03d}",
        "jurisdiction": "Malawi",
        "offence_label": label,
        "statutory_reference": SECTION,
        "penalty_type": "fixed_prescribed_fine",
        "amount_mwk": amount,
        "amount_basis": "MWK",
        "effective_from": "2026-05-06",
        "source_ids": ["SRC-002", "SRC-006"],
        "source_locator": NATION,
        "verification_status": STATUS,
        "confidence": "low",
        "second_person_reviewer": None,
        "second_person_verified_at": None,
        "notes": notes,
    }

new = [
    rec(7, "Failing to carry a certificate of insurance in a private motor vehicle", 100000,
        "News report only; verify wording, section and amount in official Gazette."),
    rec(8, "Failing to carry a certificate of insurance in a passenger service vehicle carrying 16 to 32 passengers", 500000,
        "News report only; verify wording, section, passenger band and amount in official Gazette."),
    rec(9, "Operating a motor vehicle without a certificate of fitness or with an expired certificate of fitness", 50000,
        "News report only. May overlap with MW-RT-PEN-2026-001; compare both against the official schedule."),
    rec(10, "Leaving a vehicle parked on a road for more than 72 hours", 500000,
        "News report only; verify wording, section and amount in official Gazette."),
    rec(11, "Motorcycle carrying excess passengers", 20000,
        "News report only; verify wording, section and amount in official Gazette."),
    rec(12, "Riding a motorcycle without a helmet", 30000,
        "News report only; verify wording, section and amount in official Gazette."),
]

added = 0
for r in new:
    if r["record_id"] not in existing:
        data["records"].append(r)
        added += 1

# Add the possible explanation for the alcohol conflict, WITHOUT changing its status.
marker = "Nation reports the old amount was K200,000"
for r in data["records"]:
    if r["record_id"] == "MW-RT-PEN-2026-006" and marker not in r["notes"]:
        r["notes"] += (" Possible explanation (unconfirmed): " + marker +
                       ", so the transcription may show the old value. Still unresolved until the official Gazette is read.")

data["dataset_version"] = "0.1.1"
path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Added {added} records. Total: {len(data['records'])}")
