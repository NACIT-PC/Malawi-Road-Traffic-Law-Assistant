# Department Tasks: AI and Backend Engineering (Pipelines and AI Engineering)

**Document ID:** TASK-003
**Version:** 0.1
**Status:** Draft for Team Review
**Members:** Valentino, Vitumbiko, Papela
**Department Lead:** to be confirmed by Tamanga (proposed: Valentino for AI, Vitumbiko for platform)
**Parent Documents:** PROD-003 (FR-005 to FR-010 and non-functional requirements), UX-001, TASK-001

---

## 1. Mission

Build the pipeline that turns verified legal records into grounded, cited answers: ingestion, retrieval, answer generation, validation, the backend API, and the evaluation harness. The system must prefer an honest "I could not find enough verified information" over a confident guess.

## 2. Architecture Components Owned

Query Router and Clarifier; Retrieval Service; Grounded Answer Generator; Citation and Evidence Validator; API Gateway and Backend API; Penalty and Official Links Lookup; PostgreSQL and pgvector; Ingestion Pipeline; Evaluation Test Runner; Admin Review (MVP form); security and deployment.

## 3. Task List

| ID | Task | Priority | Owner | Support | Output | Done when |
|---|---|---|---|---|---|---|
| AI-01 | Finalize the technical architecture document and stack choices (UX-001 names it as the next document) | P0 | Vitumbiko | Valentino, Papela | Technical Architecture Document | Diagram, components, and stack agreed and recorded |
| AI-02 | Set up PostgreSQL with pgvector; create tables from the data dictionary (records, sources, versions, official links, user reports) | P0 | Vitumbiko | Papela | Schema and migrations | Schema loads the first verified batch without errors |
| AI-03 | Build the ingestion pipeline: validate against schema, reject unverified records, chunk, embed, store with source and version IDs | P0 | Papela | Stanley | Ingestion scripts | Only records marked verified are indexed; each chunk keeps source ID and provision reference |
| AI-04 | Build the retrieval service (semantic search plus keyword or filter) over the approved corpus | P0 | Valentino | Papela | Retrieval module | Retrieved passages carry source IDs and provisions; can return "no sufficient evidence" (FR-007) |
| AI-05 | Build the query router and clarifier: detect topic, out-of-scope, and ambiguous questions; ask one focused clarification | P0 | Valentino | | Router module | Ambiguous and out-of-scope questions are not answered as verified law (FR-006) |
| AI-06 | Build the grounded answer generator with a structured output: direct answer, explanation, provisions, penalty, qualifications, official next step, state | P0 | Valentino | | Prompt and output schema | Answer uses only retrieved evidence; qualifications preserved; no unsupported penalty (FR-008) |
| AI-07 | Build the citation and evidence validator that sets the state: sufficient, insufficient, conflicting, possibly outdated, ambiguous, error | P0 | Valentino | Papela | Validator module | Every citation resolves to a source record; unresolved citations are removed or the answer is downgraded (FR-009) |
| AI-08 | Build the backend API and publish the response contract (OpenAPI): ask, source details, legal sources list, report, health | P0 | Vitumbiko | Valentino | API and OpenAPI spec (H4) | Frontend can render every state from the payload alone |
| AI-09 | Build penalty and official links lookup from verified records only | P0 | Vitumbiko | Stanley | Lookup module | Penalty shown equals approved record; no link shown unless marked verified (FR-010) |
| AI-10 | Add reports endpoint and storage for incorrect answers, broken citations, broken links | P0 | Vitumbiko | Papela | Reports API | Report captures answer ID and category without personal data |
| AI-11 | Admin review for the MVP: protected command-line or minimal console to approve, publish, and roll back records | P0 for the function, P1 for a full console | Vitumbiko | Stanley | Review tool | Only authorized users can publish; changes are logged |
| AI-12 | Build the evaluation harness: run Research and Data's test set and score retrieval relevance, citation correctness, penalty correctness, uncertainty handling | P0 | Papela | Bizwell, Stanley | Evaluation runner and report (H8) | Results reproducible by one command; failures listed with the question and expected result |
| AI-13 | Security and privacy: secrets handling, rate limiting, input validation, logs without personal data, no collection of national ID, licence, or payment data | P0 | Vitumbiko | Papela | Security checklist | Checklist complete and reviewed |
| AI-14 | Integration tests for failure states: empty evidence, conflicting sources, outdated source, malformed model output, LLM provider failure | P0 | Papela | Valentino | Test suite | Each state returns the UX-001 section 9 behaviour |
| AI-15 | Deployment and hosting for a demo and for testing | P0 | Vitumbiko | Papela | Running environment | Frontend and backend reachable from a phone and a laptop |

## 4. Inputs Needed From Others

- From Research and Data: data dictionary (H1), verified records (H2), registers (H3), evaluation set (H6).
- From Presentation and Communication: required fields for display, and copy for limitation messages (H7).
- From Tamanga: hosting and budget decision, retention decision, language decision.

## 5. Outputs Others Depend On

- H4 API response contract (to Mphatso)
- H8 evaluation results (to Tamanga and the whole team)

## 6. Rules for This Department

1. The model's general knowledge must never be the source of a legal rule or penalty. If retrieval is empty, the answer is the limitation message.
2. Never show a citation that does not resolve to a stored source record.
3. Keep the LLM provider behind one interface so it can be swapped.
4. Log enough to debug an answer (record IDs, source version) without storing personal data.
