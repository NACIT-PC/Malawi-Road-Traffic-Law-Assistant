# MVP Work Breakdown and Ownership

**Document ID:** TASK-001
**Version:** 0.1
**Status:** Draft for Team Review
**Product:** AI-Powered Road Traffic Law and Fine Assistance System for Malawi
**Product Lead:** Tamanga
**Parent Documents:** `PROD-002` (Product Vision and Scope), `PROD-003` (PRD), `UX-001` (User Experience Specification), MVP Use Case Diagram, MVP System Architecture Diagram

---

## 1. Purpose

This document turns the MVP scope, use case diagram, and system architecture into assigned work. It tells every department and every person what they own, what they must hand to others, and when a piece of work counts as done.

Task allocations are **proposed** and must be confirmed by the team, as stated in UX-001 section 15.

## 2. Ground Rules (apply to everyone)

1. Legal accuracy is a release requirement. Nobody invents legislation, penalties, citations, links, or payment confirmations.
2. A record, penalty, or official link is not "approved" until a second person has verified it against the original source.
3. The MVP explains and cites the law. It does not issue fines, determine guilt, or process payments.
4. Anything outside the P0 list in PROD-003 section 6 needs Product Lead approval through change control (PROD-002 section 15).
5. Every handoff in section 5 is a written, versioned artifact (file in the repo), not a chat message.

## 3. Architecture Component Ownership

| Architecture component | Department | Owner | Support |
|---|---|---|---|
| Source Register and Official Links Register | Research and Data | Bizwell | Stanley |
| Legal Records DB content (provisions, penalties, versions) | Research and Data | Stanley | Bizwell |
| Database schema, PostgreSQL + pgvector setup | AI and Backend | Vitumbiko | Papela |
| Ingestion Pipeline | AI and Backend | Papela | Stanley |
| Query Router and Clarifier | AI and Backend | Valentino | |
| Retrieval Service | AI and Backend | Valentino | Papela |
| Grounded Answer Generator | AI and Backend | Valentino | |
| Citation and Evidence Validator | AI and Backend | Valentino | Papela |
| API Gateway and Backend API | AI and Backend | Vitumbiko | |
| Penalty and Official Links Lookup | AI and Backend | Vitumbiko | Stanley |
| Evaluation Test Runner | AI and Backend | Papela | Bizwell, Stanley |
| Admin Review (MVP: protected scripts or minimal console) | AI and Backend | Vitumbiko | Stanley |
| Presentation Layer (web app) | Presentation and Communication | Mphatso | Vitumbiko |
| User Report Review Queue | Research and Data / AI and Backend | Stanley | Papela |
| User-facing copy, demo, pitch | Presentation and Communication | Richard | Mphatso |
| Scope, decisions, official-channel contact | Product | Tamanga | |

## 4. Delivery Stages and Exit Criteria

These follow the release strategy in PROD-002 section 14. Stages overlap, but a stage is only "exited" when its criteria are met. Dates are for the team to set.

### Stage 1: Data and Legal Validation
**Lead:** Research and Data
- Source register exists with all instruments identified.
- Applicability of the 2026 amended penalty regulations versus earlier instruments is documented.
- First corpus scope (offences and topics) approved by Tamanga.
- Data dictionary and record schema agreed with AI and Backend.
- First batch of records extracted and verified by a second person.

### Stage 2: Technical Proof of Concept
**Lead:** AI and Backend
- Database and vector index running with the first verified records.
- One question returns a retrieved provision, a plain-language answer, and a citation.
- Insufficient-evidence result works.

### Stage 3: MVP Integration
**Lead:** AI and Backend with Presentation and Communication
- Frontend connected to the backend API.
- Penalty lookup, source details, report form, and all failure states work end to end.
- Official links register loaded with verified links only.

### Stage 4: Evaluation and Controlled Testing
**Lead:** AI and Backend (tests) with Research and Data (expected answers) and Presentation and Communication (usability)
- Evaluation test set run; results recorded.
- Usability test with representative users done.
- Security and privacy review done.
- Critical errors (fabricated provision, unsupported penalty, misleading citation, false payment confirmation) are zero.

### Stage 5: Release Decision
**Lead:** Tamanga
- Results reviewed, blockers resolved, official links confirmed, approvals recorded.

## 5. Cross-Department Handoffs (the contracts)

| # | Handoff | From | To | Format | Needed by stage |
|---|---|---|---|---|---|
| H1 | Record schema and data dictionary | Stanley | Vitumbiko, Papela, Valentino | `docs/data-dictionary.md` + JSON Schema | 1 |
| H2 | Verified legal records (batches) | Stanley, Bizwell | Papela | JSON/CSV matching H1 | 1 to 2, then ongoing |
| H3 | Source register and official links register | Bizwell | Vitumbiko, Mphatso | JSON/CSV with verification status | 1 to 3 |
| H4 | API response contract (answer, citations, penalty, qualifications, state, official next step) | Valentino and Vitumbiko | Mphatso | OpenAPI spec + example payloads | 2 |
| H5 | Wireframes and component list | Mphatso | Tamanga, Vitumbiko | Design files/images | 2 |
| H6 | Evaluation question set with expected provisions and expected states | Bizwell, Stanley | Papela | CSV/JSON | 2 to 4 |
| H7 | Official limitation and disclaimer copy | Richard | Mphatso | Markdown copy deck | 2 |
| H8 | Evaluation results | Papela | Tamanga, all | Report | 4 |
| H9 | User reports on wrong data | Stanley (triage) | Bizwell (fix) | Issue log | 4 onward |

## 6. Release Blockers (from PROD-002 section 11)

Any of these stops release until fixed: fabricated legal provision, unsupported penalty, misleading or unresolvable citation, false payment confirmation, unverified official link shown as official.

## 7. Open Decisions That Block Work

| Decision | Decider | Blocks | Default assumption until decided |
|---|---|---|---|
| Offences and topics in first corpus | Tamanga, with Bizwell | RD tasks, evaluation set | Small set of common offences (licence, speeding, seat belt, phone use, insurance, roadworthiness) |
| English only or Chichewa too | Tamanga | Copy, prompts, evaluation | English only |
| Who approves the legal dataset | Tamanga | Verification workflow | Second team member plus Product Lead sign-off; external legal reviewer to be sought |
| Which official channels can be verified | Bizwell, Tamanga | Official next steps | Show no payment link until verified |
| Retention of anonymous conversation data | Tamanga, Vitumbiko | Logging | Do not retain conversation text beyond evaluation needs |
| Release-blocking accuracy thresholds | Tamanga, Papela | Stage 4 | Zero tolerance on the blockers in section 6 |
| Hosting and budget | Tamanga, Vitumbiko | Stage 3 | Single small cloud instance |

## 8. Where to Find Each Task List

- Department task lists: `departments/`
- Individual task files: `people/`
