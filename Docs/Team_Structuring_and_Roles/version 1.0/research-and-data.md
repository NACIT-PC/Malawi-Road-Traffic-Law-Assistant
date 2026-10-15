# Department Tasks: Research and Data

**Document ID:** TASK-002
**Version:** 0.1
**Status:** Draft for Team Review
**Members:** Bizwell, Stanley
**Department Lead:** to be confirmed by Tamanga (proposed: Bizwell)
**Parent Documents:** PROD-002, PROD-003 (FR-001 to FR-004), TASK-001

---

## 1. Mission

Provide the legal data the whole product stands on: a verified source register, structured legal records with verified penalties, a version history, a register of verified official links, and the evaluation questions used to test the system. If this data is wrong, every other team ships wrong answers.

## 2. Architecture Components Owned

- Source Register and Official Links Register
- Legal Records DB (content, not the database software)
- Evaluation question set (expected evidence and expected states)
- User report triage for data errors

## 3. Task List

| ID | Task | Priority | Owner | Support | Output | Done when |
|---|---|---|---|---|---|---|
| RD-01 | Identify authoritative instruments: Road Traffic Act, regulations, schedules, amendments, and the 2026 amended prescribed-offence and penalty regulations | P0 | Bizwell | Stanley | Source register (FR-001) | Every source has a unique ID, title, issuing authority, dates, official URL or reference, collection date, review status |
| RD-02 | Establish how the 2026 amended regulations relate to earlier instruments and which penalties are current | P0 | Bizwell | | Applicability note per instrument | Written note exists; unresolved items flagged "needs review", not published as current |
| RD-03 | Propose first corpus scope: which offences and topics are in the MVP | P0 | Bizwell | Stanley | Scope list for Tamanga approval | Tamanga has approved the list |
| RD-04 | Write the data dictionary and record schema with AI and Backend | P0 | Stanley | Vitumbiko, Valentino | `docs/data-dictionary.md`, JSON Schema (FR-002) | Fields defined: record ID, offence or topic, provision, summary, penalty, conditions, source ID, section, version or dates, verification status |
| RD-05 | Extract provisions from source documents into structured records | P0 | Stanley | Bizwell | Record batches matching schema | Records pass schema validation |
| RD-06 | Verify each record against its source (second-person check) | P0 | Bizwell checks Stanley's records; Stanley checks Bizwell's | | Verification status on each record (FR-003) | No record marked verified without a different person's check; conflicts and gaps flagged |
| RD-07 | Track versions and amendments | P0 | Stanley | Bizwell | Version fields and change log (FR-004) | Any record links to its source version; changed records distinguishable from old ones |
| RD-08 | Build and verify the official links register (MPS, DRTSS, official payment or information channels) | P0 | Bizwell | Tamanga for contact | Official links register | Each link opened and checked; unverified links marked and excluded from display |
| RD-09 | Write the evaluation question set: supported questions, ambiguous questions, unsupported questions, conflicting-source cases, penalty questions; each with expected provision and expected state | P0 | Stanley | Bizwell | Evaluation set file (H6) | Covers every offence in the approved scope plus failure cases; reviewed by Bizwell |
| RD-10 | Triage user reports about incorrect or outdated data; fix records and re-verify | P0 | Stanley | Bizwell | Issue log | Each report has a status and, if valid, a corrected and re-verified record |
| RD-11 | Prepare a periodic legal-update check process (new amendments, gazette notices) | P0 | Bizwell | | One-page update procedure | Procedure documented and tested once on a mock amendment |
| RD-12 | Seek an external legal or institutional reviewer for the dataset | P1 | Bizwell | Tamanga | Reviewer identified or request sent | Tamanga informed of the outcome |

## 4. Inputs Needed From Others

- From Tamanga: approval of corpus scope and of who signs off the dataset.
- From Vitumbiko and Valentino: confirmation the schema can be loaded and retrieved.

## 5. Outputs Others Depend On

- H1 data dictionary (Stanley, to engineers)
- H2 verified records (to Papela for ingestion)
- H3 source register and official links register (to Vitumbiko and Mphatso)
- H6 evaluation question set (to Papela)

## 6. Rules for This Department

1. Never enter a penalty from memory, news, or a secondary website. Use the official instrument.
2. If two sources disagree, record both, mark the record "conflict", and do not publish it as current.
3. A prescribed penalty in law is not the amount an individual owes. Records must say "prescribed penalty".
4. Keep a log of who verified what and when.
