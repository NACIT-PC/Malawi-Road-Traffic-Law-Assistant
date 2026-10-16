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
| `LEGAL_CORPUS_PATH` | `research_and_data/legal_corpus.jsonl` | Approved JSONL evidence file |
| `LEGAL_RETRIEVAL_LIMIT` | `5` | Maximum evidence passages sent to Gemini |
| `LEGAL_MINIMUM_RELEVANCE` | `0.25` | Minimum lexical query-term coverage (0-1) |

## Tests

Run the unit tests from the repository root:

```sh
python -m unittest discover -s pipelines_and_ai_engineering/tests -v
```

The test suite uses a fake Gemini client and does not make API calls or require a live API key.
