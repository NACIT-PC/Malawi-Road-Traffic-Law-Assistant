from __future__ import annotations

from typing import Any, Protocol

from .config import EngineConfig


class InteractionClient(Protocol):
    interactions: Any


class GeminiGenerationError(RuntimeError):
    """Raised when Gemini cannot return a usable response."""


class GeminiTextGenerator:
    """Gemini Interactions API adapter; search tools are deliberately not enabled."""

    def __init__(self, config: EngineConfig, client: InteractionClient | None = None) -> None:
        self._config = config
        if client is None:
            from google import genai
            from google.genai import types

            client = genai.Client(
                api_key=config.api_key,
                http_options=types.HttpOptions(timeout=config.timeout_ms),
            )
        self._client = client

    def generate(self, prompt: str) -> str:
        try:
            interaction = self._client.interactions.create(
                model=self._config.model,
                input=prompt,
                generation_config={
                    "max_output_tokens": self._config.max_output_tokens,
                    "thinking_level": self._config.thinking_level,
                },
                store=False,
            )
        except Exception as exc:
            raise GeminiGenerationError("Gemini generation failed") from exc
        output_text = interaction.output_text
        if not isinstance(output_text, str) or not output_text.strip():
            raise GeminiGenerationError("Gemini returned no text output")
        return output_text.strip()
