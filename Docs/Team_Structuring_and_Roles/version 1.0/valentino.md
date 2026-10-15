# Role and Task File: Valentino

**Role:** AI and Retrieval (proposed AI lead)
**Department:** AI and Backend Engineering
**Reports to:** Tamanga (Product Lead)
**Status:** Draft for Team Review (proposed allocation, to be confirmed)
**See also:** `../00-mvp-work-breakdown.md` and the department file in `../departments/`

---

## Purpose of Your Role

Make the assistant answer only from verified evidence, cite it correctly, and admit uncertainty.

## Your Tasks

| Task ID | What you do | When |
|---|---|---|
| AI-04 | Build the retrieval service | Stage 2 |
| AI-05 | Build the query router and clarifier | Stage 2 to 3 |
| AI-06 | Build the grounded answer generator with structured output | Stage 2 to 3 |
| AI-07 | Build the citation and evidence validator and the state logic | Stage 3 |
| AI-08 (support) | Agree the response contract with Vitumbiko and Mphatso (H4) | Stage 2 |
| AI-14 (support) | Help Papela test failure states | Stage 3 to 4 |

Full task descriptions and "done when" criteria are in your department file.

## What You Need From Others

Verified records and schema (H1, H2); copy deck (H7); evaluation results (H8) to improve prompts and retrieval.

## What Others Need From You

Retrieval, routing, generation, and validation modules; the answer output schema.

## Your Rules

1. Do not use the model's general knowledge as the source of law or penalties.
2. If evidence is empty or conflicting, return the correct state, not a smooth guess.

## Weekly Check

- What did I finish, and who verified it?
- What am I blocked on, and who owns the unblocker?
- Did I find anything that might be a release blocker? If yes, tell Tamanga the same day.
