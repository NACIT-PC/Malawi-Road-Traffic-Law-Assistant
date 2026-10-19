# Project Status and Next Steps

**Status reviewed:** 19 October 2026
**Project:** Malawi Road Traffic Law Assistant

## Current status

The repository is at **API-enabled prototype** stage. It has a standalone Python legal-answer engine and a FastAPI service around it. The local API has been started and its root liveness route, API health route, sources route, question route, and OpenAPI schema have been exercised.

It is **not yet a complete public MVP or production service**. Most importantly, the project has no approved legal corpus. A running server with no approved evidence is useful for demonstrating the HTTP interface, but it cannot provide supported legal answers.

## What is implemented

- **Legal assistant engine:** JSONL evidence loading and validation, lexical retrieval, Gemini generation, citation-label checks, and an explicit insufficient-evidence answer.
- **FastAPI service:** `POST /api/ask`, `GET /api/sources`, `GET /api/sources/{source_id}`, `POST /api/reports`, `GET /api/health`, and `GET /`.
- **API contract and basic safeguards:** Pydantic validation, OpenAPI documentation, generated request IDs, bounded request and question sizes, explicit-origin CORS, generic error responses, and configurable per-process rate limiting.
- **Gemini configuration:** API key read from environment or root `.env`, plus a configurable request timeout. The API key is set locally; its value is intentionally not recorded here.
- **Developer documentation:** root [API/backend status summary](PROJECT_STATUS_AND_BACKEND_API.md), [Uvicorn run guide](pipelines_and_ai_engineering/API_RUNBOOK.md), and engine/API setup information in [the pipeline README](pipelines_and_ai_engineering/README.md).

## Verified runtime and tests

At the time of this review:

- The local server responds at `http://127.0.0.1:8000/` with `{"status":"ok"}`.
- `GET /api/health` responds with `{"status":"ok"}`.
- `GET /api/sources` returns an empty source list.
- A question request returns `insufficient_evidence` with a request ID.
- The interactive API documentation is available at `http://127.0.0.1:8000/docs`.
- The current local demonstration uses an **empty temporary corpus**. It does not demonstrate a grounded legal answer or require a Gemini generation call.
- The test command `python -m unittest discover -s pipelines_and_ai_engineering\tests -v` completed with **30 tests passed**. Tests use fakes and do not verify live Gemini credentials or legal answer quality.

No test failures are currently known from that run. Passing unit tests do not establish that legal content is accurate, current, or ready for public use.

## Errors and known limitations

| Status or limitation | Meaning now |
|---|---|
| **No approved corpus / empty sources** | `research_and_data/legal_corpus.jsonl` is absent. The current demo uses an empty temporary JSONL file, so questions correctly return `insufficient_evidence`. |
| **`POST /api/reports` returns 503** | Report payloads are validated, but there is no persistent report store. The endpoint refuses the report instead of silently claiming it was saved. |
| **HTTP 422** | Invalid JSON, empty or blank questions, unknown request fields, or inputs exceeding validation limits are rejected. This is expected validation behavior, not an internal server failure. |
| **HTTP 404** | Unknown routes and unknown source IDs return not found. `/` is now a liveness endpoint and should return 200; `/api/health` is also available. |
| **HTTP 429** | The configured per-client request limit was exceeded. The current limiter is in process memory and does not coordinate across workers or instances. |
| **HTTP 502** | The Gemini provider fails or the engine rejects an uncited/invalid model response; the API returns a generic assistant-unavailable error. |
| **HTTP 500** | An unexpected internal error occurred. The response is generic and carries the request ID; server logs record the exception type, not the user's question or prompt. |
| **Reserved answer states** | `conflicting_sources`, `possibly_outdated`, and `needs_clarification` are in the contract but their detection and behavior are not implemented. API failures use HTTP errors rather than an answer with `technical_failure`. |
| **Not production-ready** | There is no frontend, database, report persistence, distributed rate limiter, deployment setup, or production monitoring. The root `DOCKERFILE` is empty. |
| **No full legal validation** | Citation-label checks ensure a model cites evidence labels provided to it; they do not prove that every claim is semantically supported by the cited text. No approved evaluation dataset or legal review results are present. |

An error response is not by itself evidence that the system has a defect: 422, 404 for an unknown resource, 429, 502, and 503 are defined outcomes for invalid requests, missing resources, rate limits, provider failure, and unavailable report storage. The root-path 404 observed earlier was corrected by adding `/` as a liveness endpoint.

## Work to implement next

### Priority 1 — Legal data and answer readiness

1. Identify and collect authoritative Malawi road-traffic legislation, amendments, prescribed-penalty instruments, and official guidance.
2. Confirm authenticity, effective dates, amendments, and current validity; record provenance and review status.
3. Agree the data dictionary and create the first small corpus batch with second-person verification.
4. Load the approved corpus at `research_and_data/legal_corpus.jsonl` (or configure `LEGAL_CORPUS_PATH`) and add representative questions with expected provisions and outcomes.
5. Run retrieval and answer evaluation against that reviewed set. Do not treat the empty-corpus smoke test as proof of legal-answer behavior.

### Priority 2 — Complete the MVP API behavior

1. Decide and implement persistent storage for user reports; change the endpoint from 503 only after persistence and its error behavior are tested.
2. Implement and test clarification, conflict and outdated-source handling, if those remain required MVP states.
3. Implement structured prescribed-penalty and official-next-step lookup from verified records before returning those fields.
4. Publish/maintain a versioned API contract and add contract tests for all response states, citations, and error responses.

### Priority 3 — Product integration and deployment

1. Build and connect the responsive frontend to the API; show citations, limitations, and legal-information disclaimers accurately.
2. Choose a deployment design, complete the Docker/deployment configuration, add readiness checks, and configure HTTPS through a trusted reverse proxy.
3. Replace process-local rate limiting with a shared limiter or enforce limits at the trusted edge before using multiple workers or replicas.
4. Add production logging/metrics, operational alerts, data-update and rollback procedures, backup/restore procedures where applicable, and a security review.
5. Complete privacy and authorization reviews before collecting reports or integrating with any official fine-verification or payment service.

## Useful commands

From the repository root, start the local service with:

```powershell
.\.venv\Scripts\python.exe -m uvicorn pipelines_and_ai_engineering.api.app:app --host 127.0.0.1 --port 8000 --reload
```

Open the API explorer at `http://127.0.0.1:8000/docs`. Run the engine and API test suite with:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s pipelines_and_ai_engineering\tests -v
```

For setup, corpus configuration, and the empty-corpus demonstration workflow, see the [Uvicorn run guide](pipelines_and_ai_engineering/API_RUNBOOK.md).
