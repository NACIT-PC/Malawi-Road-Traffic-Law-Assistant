# Standalone legal AI engine

This package provides a small, replaceable retrieval-and-generation engine for the Malawi road-traffic assistant. It does not depend on the web UI or backend framework. Other project components can call `LegalAssistant.ask()` directly or replace the retriever/generator behind its protocols. It requires Python 3.10 or newer.

## Current boundaries

- Gemini uses the official Google GenAI Python SDK and Interactions API.
- Google Search is intentionally not enabled. Answers are generated only from retrieved local records; web search results are not approved legal sources by themselves.
- Interactions are sent with `store=False` so the engine does not ask Gemini to retain conversation state.
- The starter retriever is dependency-free lexical matching. Replace it with a semantic/vector retriever later without changing the `LegalAssistant` interface.
- Only records marked both `verification_status: "verified"` and `validity_status: "current"` can be used as answer evidence.
- This is legal information, not a decision about guilt, an official fine notice, or a payment service.

## Install and run

From the repository root:

```sh
python -m pip install -r pipelines_and_ai_engineering/requirements.txt
cp .env.example .env
# Edit .env and replace the placeholder GEMINI_API_KEY with your key.
python -m pipelines_and_ai_engineering.main "What does the law say about a valid driving licence?"
```

The engine loads `.env` from the repository root automatically. `.env` is ignored by Git; `.env.example` is a safe, tracked template and must contain placeholders only. Never commit a real API key. Variables already set in the shell or deployment environment take precedence over values in `.env`; production deployments should use their secret manager.

If there is no corpus file yet, `LEGAL_CORPUS_PATH` should point to the JSONL file the Research and Data team will provide. The engine does not fabricate records when the corpus is missing or has no relevant verified entries.

## Add legal data without changing engine code

Use UTF-8 JSON Lines: one evidence passage per line. Add a new line for each provision or distinct passage; retain the same source metadata for passages from the same source. Replace the example values with values reviewed by the Research and Data team. This shape is illustrative only and contains no legal advice:

```json
{"evidence_id":"unique-record-id","topic":"topic keywords","provision":"Section/regulation/schedule reference","text":"Verified legal text or an approved excerpt","penalty":null,"conditions":[],"source":{"source_id":"unique-source-id","title":"Official instrument title","issuer":"Issuing authority","url":null,"version":"verified version identifier","effective_from":null,"effective_to":null,"last_verified":"YYYY-MM-DD","verification_status":"verified","validity_status":"current"}}
```

Required values: `evidence_id`, `topic`, `provision`, `text`, and `source.source_id`, `source.title`, `source.verification_status`, `source.validity_status`. `penalty` is optional text; leave it null when the approved record does not establish an applicable prescribed penalty. `conditions` is an optional list of strings. Source dates, version, issuer, and URL are optional metadata.

Only use `verified` and `current` after the responsible reviewers establish those statuses. Records with any other status are ignored for generation, not silently treated as current law. Invalid JSON, missing required values, or duplicate evidence IDs fail corpus loading with a line-numbered error. Append reviewed records to the file and restart the process to load them; no code change is needed.

## Python integration

```python
from pipelines_and_ai_engineering.ai import LegalAssistant

assistant = LegalAssistant.from_environment()
result = assistant.ask("What is the rule for this traffic-law topic?")

if result.status == "answered":
    print(result.answer)
    for citation in result.citations:
        print(citation.title, citation.provision, citation.url)
else:
    print(result.answer)  # Explicit insufficient-evidence response
```

`LegalAssistant` accepts an `EvidenceRetriever` and `TextGenerator` in its constructor for tests or alternate implementations. `FileNotFoundError`, corpus format errors, Gemini errors, and uncited/invalid model output are surfaced to the caller; they are not converted into a legal answer.

## Configuration

| Environment variable | Default | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | required | API credential; never store it in source control |
| `GEMINI_MODEL` | `gemini-3.8-flash` | Gemini model identifier |
| `GEMINI_MAX_OUTPUT_TOKENS` | `4096` | Maximum generated tokens |
| `GEMINI_THINKING_LEVEL` | `medium` | Gemini thinking level |
| `GEMINI_TIMEOUT_MS` | `30000` | Gemini HTTP request timeout in milliseconds |
| `LEGAL_CORPUS_PATH` | `research_and_data/legal_corpus.jsonl` | Approved JSONL evidence file |
| `LEGAL_RETRIEVAL_LIMIT` | `5` | Maximum evidence passages sent to Gemini |
| `LEGAL_MINIMUM_RELEVANCE` | `0.25` | Minimum lexical query-term coverage (0-1) |

## Tests

Run the unit tests from the repository root:

```sh
python -m unittest discover -s pipelines_and_ai_engineering/tests -v
```

The engine and API tests use fake generators and do not make API calls or require a live API key.

## HTTP API

Install the package dependencies from the repository root:

```sh
python -m pip install -r pipelines_and_ai_engineering/requirements.txt
```

Set `GEMINI_API_KEY` in the environment or in the root `.env` file and provide the approved JSONL corpus at `LEGAL_CORPUS_PATH` (default: `research_and_data/legal_corpus.jsonl`). The application fails during startup if the key, configuration, or corpus is missing or invalid. Do not add unverified legal content to the corpus.

For the Uvicorn command, configuration steps, endpoint details, and local smoke-test instructions, see the [API run guide](API_RUNBOOK.md).

The local development server listens on `http://127.0.0.1:8000`; interactive OpenAPI documentation is at `/docs`.

| Method and path | Behavior |
|---|---|
| `POST /api/ask` | Accepts `{"question": "..."}` and returns an answer, state, request ID, and citations. Question length is limited to 2,000 characters. |
| `GET /api/sources` | Lists source metadata from the loaded corpus. |
| `GET /api/sources/{source_id}` | Returns a source and its provisions; provision text and links are exposed only for verified/current sources. |
| `POST /api/reports` | Validates a report and returns `503 report_storage_unavailable` until persistent report storage exists. Reports are not silently discarded. |
| `GET /` | Serves the frontend home page and static assets from `frontend/`. |
| `GET /api/health` | Returns minimal liveness status; it does not disclose readiness or configuration. |

The API maps the engine's current results to `supported` and `insufficient_evidence`. `conflicting_sources`, `possibly_outdated`, and `needs_clarification` are reserved because their detection is not implemented. `technical_failure` is reserved as an answer state; request failures instead use the documented HTTP error response. The API does not produce a structured penalty lookup or official next step, and returns those fields as null.

`API_ALLOWED_ORIGINS` is a comma-separated allowlist of exact origins; it is empty by default. `API_MAX_REQUEST_BYTES`, `API_RATE_LIMIT_REQUESTS`, and `API_RATE_LIMIT_WINDOW_SECONDS` configure request limits. The rate limiter is process-local and is not shared between workers or replicas; deployments with multiple workers must enforce shared rate limiting at a trusted proxy or add a shared backend. Gemini requests have a configurable `GEMINI_TIMEOUT_MS` timeout.

The API now serves the static frontend from the same origin. This milestone still does not include report persistence, a database, distributed rate limiting, authentication, or deployment configuration. It is not a production-security certification. A production deployment still needs reviewed legal data, HTTPS and a trusted proxy, operational monitoring, deployment-specific controls, and an agreed persistent report store.
