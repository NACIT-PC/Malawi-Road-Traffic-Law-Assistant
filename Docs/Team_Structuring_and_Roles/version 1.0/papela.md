# Role and Task File: Papela

**Role:** Pipelines, Testing, and Evaluation
**Department:** AI and Backend Engineering
**Reports to:** Tamanga (Product Lead)
**Status:** Draft for Team Review (proposed allocation, to be confirmed)
**See also:** `../00-mvp-work-breakdown.md` and the department file in `../departments/`

---

## Purpose of Your Role

Get verified data into the system reliably and prove, with tests, that the system behaves safely.

## Your Tasks

| Task ID | What you do | When |
|---|---|---|
| AI-03 | Build the ingestion pipeline (validate, reject unverified, chunk, embed, store) | Stage 2 |
| AI-12 | Build the evaluation harness and produce results (H8) | Stage 2 to 4 |
| AI-14 | Write integration tests for all failure states | Stage 3 to 4 |
| AI-02 (support) | Help set up the vector index and migrations | Stage 2 |
| AI-04, AI-07 (support) | Support retrieval and validator work | Stage 2 to 3 |
| AI-10 (support) | Support report storage and triage tooling | Stage 3 |
| AI-15 (support) | Support deployment | Stage 3 |

Full task descriptions and "done when" criteria are in your department file.

## What You Need From Others

Verified records (H2) from Stanley and Bizwell; evaluation set (H6).

## What Others Need From You

Ingestion scripts; reproducible evaluation report; test suite.

## Your Rules

1. Never index a record whose verification status is not 'verified'.
2. Report critical errors (fabricated provision, unsupported penalty, bad citation, false payment claim) to Tamanga immediately.

## Weekly Check

- What did I finish, and who verified it?
- What am I blocked on, and who owns the unblocker?
- Did I find anything that might be a release blocker? If yes, tell Tamanga the same day.
