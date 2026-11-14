# Project Status, API Design, and Backend Structure

**Reviewed:** 14 November 2026
**Project:** Malawi Road Traffic Law Assistant

## Executive summary

This repository contains the product and technical design for a public-facing assistant that explains Malawi road-traffic law using verified legal sources. The implemented software includes a standalone Python retrieval-and-generation engine, a FastAPI service, and a React frontend built with Vite. FastAPI serves the production frontend build on the same origin; Docker Compose also builds an Nginx frontend image.

The frontend includes an informational landing page, practical guides, a source browser, and an evidence-linked assistant, plus how-it-works and limitations pages. It calls the existing API for answers and source details. The configured corpus returned no source records during the latest API smoke test. There is also no report store, database, or ingestion worker, so the implementation remains a prototype, not a complete public-facing MVP.

## What is in the repository

| Area | Current contents |
|---|---|
| Product and UX | Product overview, requirements, vision/scope, user journeys, response behavior, and safety boundaries in [`Docs/The_Official_Docs/`](Docs/The_Official_Docs/). |
| Architecture and ownership | Draft technical architecture and proposed team responsibilities in [`Docs/Team_Structuring_and_Roles/version 1.0/`](Docs/Team_Structuring_and_Roles/version%201.0/). |
| AI engine and API | Python engine and FastAPI service in [`pipelines_and_ai_engineering/`](pipelines_and_ai_engineering/), with command-line entry points and unit tests. |
| Research/data and presentation | Department READMEs, directory structure, and the React frontend in [`frontend/`](frontend/). The configured corpus currently returns no source records. |
| Runtime configuration | [`.env.example`](.env.example) documents Gemini and retrieval settings. The root [`Dockerfile`](Dockerfile) builds the API image and React assets; Docker Compose builds the frontend and reverse-proxy services. |

The authoritative project intent is described across the product and architecture documents. They are marked draft or for team review; they should not be read as evidence that each planned feature has shipped.

## Implemented today

The Python package in `pipelines_and_ai_engineering/ai/` currently provides:

1. **Evidence models and corpus loading**  immutable source, evidence, citation, and result types; a JSONL loader that checks required fields and duplicate evidence IDs, reporting malformed records with a line number.
2. **Verified-record filtering**  retrieval uses only records whose source has both `verification_status: "verified"` and `validity_status: "current"`.
3. **Starter retrieval**  dependency-free lexical matching across topic, provision, evidence text, and source title. Results are ranked by query-term overlap and limited to the configured top results.
4. **Gemini generation adapter**  uses the Google GenAI SDK Interactions API with a configurable request timeout. It does not enable Google Search and sends `store=False`.
5. **Grounding and citation-label checks**  the prompt instructs the model to answer only from supplied evidence and use evidence labels. The engine rejects answers with no recognized evidence label or labels that were not supplied. This checks citation-label presence and validity; it is not a semantic proof that every claim is entailed by its cited passage.
6. **Explicit insufficient-evidence behavior**  when retrieval returns no records, the engine returns a limitation response without calling Gemini.
7. **Configuration and entry points**  environment/`.env` configuration, a Python `LegalAssistant` interface, and a command-line question entry point.
8. **Unit tests**  tests cover corpus parsing, verified/current filtering, configuration loading, unsupported questions, citation-label errors, and the Gemini adapter's stateless/no-search request.
9. **HTTP API**  FastAPI endpoints validate requests, map the two implemented engine results to `supported` or `insufficient_evidence`, expose corpus-backed source metadata, and provide request IDs. Explicit-origin CORS, body/question limits, structured errors, and process-local rate limiting are included.
10. **Report behavior**  report payloads are validated, but the endpoint returns `503 report_storage_unavailable`; it does not claim to persist reports.
11. **React web frontend**  a responsive landing page, practical articles, API-backed legal source browser, and chat-style assistant. The Vite production build is served by FastAPI and by the Nginx frontend container, with SPA route fallbacks.

The documented test command is:

```powershell
python -m unittest discover -s pipelines_and_ai_engineering/tests -v
```

The default corpus path is `research_and_data/legal_corpus.jsonl`; it returned zero source records during the latest API smoke test. A real Gemini API key is required to start the service; tests inject fake generators and do not require a live API call. See the [Uvicorn API run guide](pipelines_and_ai_engineering/API_RUNBOOK.md) for local startup instructions.

## API design documented for the MVP

The API contract is based on [`technical-architecture.md`](Docs/The_Official_Docs/technical-architecture.md), under “Backend API Design.” Current endpoints are:

| Method and path | Intended purpose |
|---|---|
| `POST /api/ask` | Submit a question and return an answer object. |
| `GET /api/sources` | List legal sources and their verification status. |
| `GET /api/sources/{id}` | Return source details and relevant provision information. |
| `POST /api/reports` | Validate reports; return 503 while persistent storage is unavailable. |
| `GET /` and frontend routes/assets | Serve the React app and Vite build from `frontend/dist/`. |
| `GET /api/health` | Minimal liveness endpoint; readiness is not implemented. |

The answer contract has a `state` that lets a client render outcomes without inferring them from answer text:

- `supported`
- `insufficient_evidence`
- `conflicting_sources`
- `possibly_outdated`
- `needs_clarification`
- `technical_failure`

The architecture example also describes fields such as `request_id`, `direct_answer`, `explanation`, `citations`, optional `penalty`, `qualifications`, `official_next_step`, and `verification_note`. Citations should resolve to stored source records. Penalties and official links should only be included when verified. A prescribed penalty must never be represented as proof that a user has been issued a fine or has an amount due.

### Difference between the proposed API and the current engine interface

The engine result uses `status`, `answer`, and citations. The API maps its current statuses `answered` and `insufficient_evidence` to `supported` and `insufficient_evidence`. `conflicting_sources`, `possibly_outdated`, and `needs_clarification` are reserved because the service does not detect those conditions; technical failures use HTTP error responses rather than an answer state. The service does not implement penalty lookup, official next steps, clarification, conflicting/outdated-source detection, or readiness checks. The `supported` state means the engine returned an answer with valid evidence labels; it does not prove semantic entailment of every generated claim.

## Backend structure: design versus implementation

### Proposed backend design

The technical architecture proposes a Python/FastAPI backend with these internal responsibilities:

| Proposed module | Responsibility |
|---|---|
| `api` | Routes, request/response schemas, validation, and request IDs. |
| `retrieval` | Search reviewed legal records. |
| `rules` | Determine whether the question is supported, ambiguous, or out of scope. |
| `ai_adapter` | Isolate the selected AI provider behind an interface. |
| `checks` | Validate evidence and citations and decide the response state. |
| `lookup` | Retrieve verified penalties and official links. |
| `reports` | Store user reports about answers or links. |
| `core` | Shared settings, logging, and types. |

The architecture describes a stateless API backed by relational legal data and a cache, with a separate worker for ingestion and evaluation. Only a reverse proxy is intended to be exposed publicly. The design also calls for input validation, rate limits, runtime secrets, privacy-preserving logs, and honest failure behavior.

### What is implemented instead

The current code contains the engine and an HTTP API:

```text
pipelines_and_ai_engineering/
  main.py                 # Command-line entry point
  api/
    app.py                # FastAPI app, routes, configuration and middleware
    models.py             # Pydantic request/response models
    __main__.py            # Local Uvicorn entry point
  ai/
    config.py             # Environment and .env settings
    corpus.py             # JSONL evidence loading
    retrieval.py          # Lexical retrieval
    engine.py             # Prompting, orchestration, citation-label checks
    gemini.py             # Gemini provider adapter
    models.py             # Source, evidence, citation, and result types
  tests/
    test_ai_engine.py
    test_api.py
```

The API provides Pydantic schemas and generated OpenAPI documentation, and serves the built React frontend from the same origin. Docker Compose configures the API, Nginx frontend, and reverse proxy. There is still no database schema or migrations, cache, ingestion worker, or persistent report service. Reports return 503 until persistence is available. Rate limiting is per process only and is not distributed across multiple workers or replicas. The API requires a Gemini key and corpus path at startup; the configured corpus currently returns no source records.

## Product safeguards and scope

The product documents consistently define this as legal information, not an official enforcement or payment system. The assistant must not determine guilt, claim that a fine has been issued, confirm payment, invent a penalty, or imply government authorization. Payment processing and access to enforcement systems are explicitly outside the MVP unless the responsible authorities formally authorize an integration.

Legal sources and penalties need current-version verification. The design expects provenance, effective dates, review status, and second-person verification before records are published. The engine and API filter answer evidence to verified/current records, but the repository does not include an administrative approval workflow, source register, update audit trail, or official-links register.

## Documentation map

- [`README.md`](README.md)  product introduction, scope, safeguards, and high-level architecture.
- [`Docs/The_Official_Docs/technical-architecture.md`](Docs/The_Official_Docs/technical-architecture.md)  proposed components, API, response contract, data, deployment, security, and testing.
- [`Docs/The_Official_Docs/product-requirements-document.md`](Docs/The_Official_Docs/product-requirements-document.md)  functional and non-functional requirements.
- [`Docs/The_Official_Docs/product-vision-and-scope.md`](Docs/The_Official_Docs/product-vision-and-scope.md)  product goals, boundaries, and release scope.
- [`Docs/The_Official_Docs/user-experience-specification.md`](Docs/The_Official_Docs/user-experience-specification.md)  screens, response presentation, citations, and failure states.
- [`Docs/Team_Structuring_and_Roles/version 1.0/00-mvp-work-breakdown.md`](Docs/Team_Structuring_and_Roles/version%201.0/00-mvp-work-breakdown.md)  proposed ownership, delivery stages, and cross-team handoffs.
- [`pipelines_and_ai_engineering/README.md`](pipelines_and_ai_engineering/README.md)  current engine setup, corpus format, integration, configuration, and tests.

## Main gaps before the documented API/backend MVP is complete

1. Decide and implement authoritative legal-data storage and source/version updates; supply reviewed records and an evaluation question set.
2. Add persistent report storage and shared rate limiting if required for production or multi-worker hosting.
3. Implement clarification, conflicting/outdated-source detection, structured penalty lookup, and verified official next steps before advertising those capabilities.
4. Populate the configured corpus with reviewed legal records and an evaluation question set before relying on answers.
5. Add readiness checks, observability, HTTPS setup, persistent report storage, and production operational controls. The Docker Compose configuration has not been container-built in this environment because the Docker daemon was unavailable.
6. Extend tests to data updates, deployment integration, and legal-answer evaluation.

The API should not be described as production-secure solely because these controls exist; production hosting still requires the deployment controls and verified legal data listed above.
