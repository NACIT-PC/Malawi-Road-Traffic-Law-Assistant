# Role and Task File: Vitumbiko

**Role:** Backend and Platform Engineering (proposed platform lead)
**Department:** AI and Backend Engineering
**Reports to:** Tamanga (Product Lead)
**Status:** Draft for Team Review (proposed allocation, to be confirmed)
**See also:** `../00-mvp-work-breakdown.md` and the department file in `../departments/`

---

## Purpose of Your Role

Provide the database, API, security, and hosting that connect data, AI, and the frontend.

## Your Tasks

| Task ID | What you do | When |
|---|---|---|
| AI-01 | Finalize the technical architecture document | Stage 1 to 2 |
| AI-02 | Set up PostgreSQL with pgvector and the schema | Stage 2 |
| AI-08 | Build the backend API and OpenAPI response contract | Stage 2 to 3 |
| AI-09 | Build penalty and official links lookup from verified records only | Stage 3 |
| AI-10 | Build the reports endpoint and storage | Stage 3 |
| AI-11 | Build the MVP admin review and publish tool with access control | Stage 3 |
| AI-13 | Security and privacy checklist | Stage 3 to 4 |
| AI-15 | Deployment and hosting | Stage 3 |
| PC-03 (support) | Help Mphatso integrate frontend and API | Stage 3 |

Full task descriptions and "done when" criteria are in your department file.

## What You Need From Others

Data dictionary (H1); registers (H3); display needs from Mphatso; hosting and retention decisions from Tamanga.

## What Others Need From You

Running database and API; OpenAPI spec (H4); deployed environment; security checklist.

## Your Rules

1. Collect no national ID, licence number, or payment details.
2. Restrict publishing of records to authorized people and log every change.

## Weekly Check

- What did I finish, and who verified it?
- What am I blocked on, and who owns the unblocker?
- Did I find anything that might be a release blocker? If yes, tell Tamanga the same day.
