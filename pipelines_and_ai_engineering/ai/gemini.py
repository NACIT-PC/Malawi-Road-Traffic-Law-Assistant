from __future__ import annotations

from typing import Any, Protocol

from .config import EngineConfig


class InteractionClient(Protocol):
    interactions: Any


class GeminiTextGenerator:
    """Gemini Interactions API adapter; search tools are deliberately not enabled."""

    def __init__(self, config: EngineConfig, client: InteractionClient | None = None) -> None:
        self._config = config
        if client is None:
            from google import genai

            client = genai.Client(api_key=config.api_key)
        self._client = client

    def generate(self, prompt: str) -> str:
        interaction = self._client.interactions.create(
            model=self._config.model,
            input=prompt,
            generation_config={
                "max_output_tokens": self._config.max_output_tokens,
                "thinking_level": self._config.thinking_level,
            },
            store=False,
        )
        output_text = interaction.output_text
        if not isinstance(output_text, str) or not output_text.strip():
            raise RuntimeError("Gemini returned no text output")
        return output_text.strip()
