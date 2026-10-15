# Role and Task File: Stanley

**Role:** Research and Data
**Department:** Research and Data
**Reports to:** Tamanga (Product Lead)
**Status:** Draft for Team Review (proposed allocation, to be confirmed)
**See also:** `../00-mvp-work-breakdown.md` and the department file in `../departments/`

---

## Purpose of Your Role

Turn verified legal text into structured, versioned records and the test set that checks the system.

## Your Tasks

| Task ID | What you do | When |
|---|---|---|
| RD-04 | Write the data dictionary and record schema with the engineers | Stage 1, first |
| RD-05 | Extract provisions and penalties into structured records | Stage 1 to 3 |
| RD-06 | Verify Bizwell's records (second-person check) | Stage 1 to 3 |
| RD-07 | Maintain version fields and the change log | Ongoing |
| RD-09 | Write the evaluation question set with expected provisions and expected states | Stage 2 |
| RD-10 | Triage user reports on data errors and re-verify fixes | Stage 4 |
| AI-03 (support) | Help Papela confirm ingestion loads records correctly | Stage 2 |

Full task descriptions and "done when" criteria are in your department file.

## What You Need From Others

Source register from Bizwell; schema feedback from Vitumbiko, Valentino, and Papela.

## What Others Need From You

Data dictionary and JSON Schema (H1); verified record batches (H2); evaluation set (H6); issue log.

## Your Rules

1. Every record keeps its source ID, provision, and verification status.
2. Penalties are 'prescribed penalties', never 'what the user owes'.

## Weekly Check

- What did I finish, and who verified it?
- What am I blocked on, and who owns the unblocker?
- Did I find anything that might be a release blocker? If yes, tell Tamanga the same day.
