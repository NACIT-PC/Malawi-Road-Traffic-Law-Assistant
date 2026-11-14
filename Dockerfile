FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY pipelines_and_ai_engineering/requirements.txt pipelines_and_ai_engineering/requirements.txt
RUN pip install --no-cache-dir -r pipelines_and_ai_engineering/requirements.txt

COPY pipelines_and_ai_engineering pipelines_and_ai_engineering
# The API mounts frontend/ at startup, so it must exist in the image.
COPY frontend frontend
# research_and_data/ is mounted by docker-compose so legal data updates need only a restart.

RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

# --proxy-headers lets the app's rate limiter see the real client IP forwarded by the proxy.
# Safe here because the backend is not published; only the proxy can reach it.
CMD ["python", "-m", "uvicorn", "pipelines_and_ai_engineering.api.app:app", \
     "--host", "0.0.0.0", "--port", "8000", \
     "--proxy-headers", "--forwarded-allow-ips=*"]
