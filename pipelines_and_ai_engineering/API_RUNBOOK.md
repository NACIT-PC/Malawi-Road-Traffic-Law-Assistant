# Running the API with Uvicorn

This guide starts the FastAPI service locally from the repository root. The API uses the existing legal assistant engine, so live question answering requires both a Gemini API key and an approved legal corpus. Do not put real credentials in source control or use unverified legal records.

## 1. Install dependencies

Create and activate a virtual environment, then install the project requirements:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r pipelines_and_ai_engineering\requirements.txt
```

If PowerShell prevents activation, run the virtual environment's Python directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r pipelines_and_ai_engineering\requirements.txt
```

## 2. Configure the API

Create a root `.env` file from `.env.example`, then set:

```dotenv
GEMINI_API_KEY=your-gemini-api-key
LEGAL_CORPUS_PATH=research_and_data/legal_corpus.jsonl
```

The corpus must be UTF-8 JSON Lines and contain only reviewed records. See the corpus format in [the engine README](README.md#add-legal-data-without-changing-engine-code). Startup fails if the API key, configuration, or corpus is missing or invalid.

Optional API settings:

| Variable | Default | Purpose |
|---|---:|---|
| `API_ALLOWED_ORIGINS` | empty | Comma-separated list of explicit browser origins. Empty disables cross-origin browser access. |
| `API_MAX_REQUEST_BYTES` | `16384` | Maximum request body size; accepted range is 1–1,048,576 bytes. |
| `API_RATE_LIMIT_REQUESTS` | `60` | Requests allowed per client address in one process-local window. |
| `API_RATE_LIMIT_WINDOW_SECONDS` | `60` | Rate-limit window; accepted range is 1–3,600 seconds. |

Optional Gemini and retrieval settings are listed in [the engine README](README.md#configuration). The rate limiter is process-local; it is not distributed across multiple Uvicorn workers or server instances.

## 3. Start Uvicorn and open the frontend or API

Open PowerShell in the repository root. Confirm that `.env` contains a key without printing the secret:

```powershell
if (-not (Test-Path .env)) { throw "Create the root .env file and set GEMINI_API_KEY first." }
$keyIsSet = $false
foreach ($line in Get-Content .env) {
    if ($line -match '^\s*GEMINI_API_KEY\s*=\s*(.+?)\s*$') {
        $value = $Matches[1].Trim().Trim('"').Trim("'")
        if ($value -and $value -notmatch '^(your-gemini-api-key|replace-with-|<.*>)') {
            $keyIsSet = $true
        }
    }
}
if (-not $keyIsSet) { throw "Set a real GEMINI_API_KEY in the root .env file first." }
"GEMINI_API_KEY is set."
```

Create the virtual environment and install dependencies if you have not already done so:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r pipelines_and_ai_engineering\requirements.txt
```

The API needs a corpus file to start. Use the approved corpus when available. For a local API demonstration before that file exists, create an empty temporary corpus; this provides no legal evidence, so questions will return `insufficient_evidence`.

```powershell
$corpus = "research_and_data\legal_corpus.jsonl"
if (-not (Test-Path $corpus)) {
    $corpus = Join-Path $env:TEMP "malawi-road-traffic-empty-corpus.jsonl"
    [System.IO.File]::WriteAllText($corpus, "")
    Write-Warning "Approved corpus not found; using an empty temporary corpus. No legal answers will be supported."
}
$env:LEGAL_CORPUS_PATH = (Resolve-Path $corpus).Path
```

Start the development server in this PowerShell window:

```powershell
.\.venv\Scripts\python.exe -m uvicorn pipelines_and_ai_engineering.api.app:app --host 127.0.0.1 --port 8000 --reload
```

Leave that window open while using the API. In a second PowerShell window, open the interactive API page in your browser:

```powershell
Start-Process "http://127.0.0.1:8000/docs"
```

The frontend is served from the same origin at `http://127.0.0.1:8000/`. The interactive API page lets you expand an endpoint, select **Try it out**, enter a request body, and select **Execute**. The raw OpenAPI schema is at `http://127.0.0.1:8000/openapi.json`.

You can also check the running service from the second window:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
Invoke-RestMethod http://127.0.0.1:8000/api/sources

$body = @{ question = "What is the driving licence rule?" } | ConvertTo-Json -Compress
Invoke-RestMethod -Method Post `
  -Uri http://127.0.0.1:8000/api/ask `
  -ContentType "application/json" `
  -Body $body
```

With an empty corpus, `/api/sources` returns no sources and `/api/ask` returns `insufficient_evidence`. To stop Uvicorn, focus its PowerShell window and press **Ctrl+C**.

The server is bound to `127.0.0.1` for local use. Do not expose the development server publicly; a deployed service needs an appropriately secured environment and trusted reverse proxy.

## 4. Available endpoints

| Method and path | Purpose |
|---|---|
| `GET /` | Serves the frontend home page. |
| `GET /{frontend asset}` | Serves frontend pages and assets from `frontend\`. |
| `POST /api/ask` | Accepts `{"question":"..."}`; returns a supported or insufficient-evidence answer and citations. |
| `GET /api/sources` | Lists source metadata from the loaded corpus. |
| `GET /api/sources/{source_id}` | Returns source details and verified/current provisions. Unknown IDs return 404. |
| `POST /api/reports` | Validates a report; returns 503 until persistent report storage is implemented. |
| `GET /api/health` | Returns `{"status":"ok"}` and does not indicate corpus or Gemini readiness. |

An example question request:

```powershell
Invoke-RestMethod -Method Post `
  -Uri http://127.0.0.1:8000/api/ask `
  -ContentType application/json `
  -Body '{"question":"What does the approved source say about this traffic rule?"}'
```

The API maps the engine's implemented outcomes to `supported` and `insufficient_evidence`. Conflict detection, outdated-source detection, clarification, penalty lookup, official next-step lookup, and report persistence are not implemented.

## 5. Run tests

From the repository root:

```powershell
python -m unittest discover -s pipelines_and_ai_engineering\tests -v
```

The tests use fake generators and clients; they do not require an API key, approved corpus, network access, or paid Gemini requests.

## Local-only smoke test without live Gemini

The empty-corpus setup above starts the API without making Gemini requests: an API key is still required at startup, but the assistant does not call Gemini when retrieval finds no evidence. The empty corpus is only for checking that Uvicorn, routes, and the interactive docs work; it is not suitable for legal answers or deployment.
