from __future__ import annotations

import json
import os
import tempfile
import unittest
from pathlib import Path
from typing import List
from unittest.mock import patch

from pipelines_and_ai_engineering.ai import (
    EngineConfig,
    JsonlCorpus,
    LegalAssistant,
    LegalEvidence,
    LegalSource,
    LexicalEvidenceRetriever,
    UncitedAnswerError,
)
from pipelines_and_ai_engineering.ai.gemini import GeminiTextGenerator


def evidence(
    evidence_id: str = "ev-1",
    verification_status: str = "verified",
    validity_status: str = "current",
) -> LegalEvidence:
    source = LegalSource(
        source_id="src-1",
        title="Verified traffic law source",
        verification_status=verification_status,
        validity_status=validity_status,
        url="https://example.invalid/law",
        version="verified-version",
        last_verified="2026-01-01",
    )
    return LegalEvidence(
        evidence_id=evidence_id,
        topic="driving licence",
        provision="Section 12",
        text="A person must hold a valid driving licence.",
        source=source,
    )


class FakeGenerator:
    def __init__(self, answer: str) -> None:
        self.answer = answer
        self.prompts: List[str] = []

    def generate(self, prompt: str) -> str:
        self.prompts.append(prompt)
        return self.answer


class CorpusAndRetrievalTests(unittest.TestCase):
    def test_jsonl_corpus_loads_records_and_source_metadata(self) -> None:
        raw_record = {
            "evidence_id": "ev-1",
            "topic": "licence",
            "provision": "Section 12",
            "text": "Hold a valid licence.",
            "source": {
                "source_id": "src-1",
                "title": "Traffic Act",
                "verification_status": "verified",
                "validity_status": "current",
            },
        }
        with tempfile.TemporaryDirectory() as directory:
            corpus_path = Path(directory) / "law.jsonl"
            corpus_path.write_text(json.dumps(raw_record) + "\n", encoding="utf-8")
            records = JsonlCorpus.load(corpus_path)

        self.assertEqual(len(records), 1)
        self.assertTrue(records[0].source.is_usable)
        self.assertEqual(records[0].citation, "Traffic Act, Section 12")

    def test_invalid_jsonl_record_reports_line_number(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            corpus_path = Path(directory) / "law.jsonl"
            corpus_path.write_text("not json\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, r"law.jsonl:1: invalid JSON"):
                JsonlCorpus.load(corpus_path)

    def test_retriever_excludes_unverified_and_outdated_sources(self) -> None:
        retriever = LexicalEvidenceRetriever(
            [
                evidence("current"),
                evidence("unverified", verification_status="unverified"),
                evidence("outdated", validity_status="outdated"),
            ]
        )

        results = retriever.retrieve("What is the driving licence rule?", limit=5)

        self.assertEqual([item.evidence.evidence_id for item in results], ["current"])

    def test_config_loads_local_env_without_overriding_existing_environment(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            project_root = Path(directory)
            (project_root / ".env").write_text(
                "GEMINI_API_KEY=from-dotenv\nGEMINI_MODEL=model-from-dotenv\n",
                encoding="utf-8",
            )
            with patch.dict(os.environ, {"GEMINI_MODEL": "model-from-shell"}, clear=True):
                with patch("pipelines_and_ai_engineering.ai.config.PROJECT_ROOT", project_root):
                    config = EngineConfig.from_environment()

        self.assertEqual(config.api_key, "from-dotenv")
        self.assertEqual(config.model, "model-from-shell")

    def test_explicit_environment_does_not_read_local_env(self) -> None:
        with patch("pipelines_and_ai_engineering.ai.config.load_dotenv") as load_env:
            config = EngineConfig.from_environment({"GEMINI_API_KEY": "test-key"})

        load_env.assert_not_called()
        self.assertEqual(config.api_key, "test-key")


class AssistantTests(unittest.TestCase):
    def test_returns_answer_and_only_the_cited_source(self) -> None:
        source = evidence()
        generator = FakeGenerator("Hold a valid licence. [E1]")
        assistant = LegalAssistant(LexicalEvidenceRetriever([source]), generator)

        result = assistant.ask("What is the driving licence rule?")

        self.assertEqual(result.status, "answered")
        self.assertEqual(result.answer, "Hold a valid licence. [E1]")
        self.assertEqual([citation.evidence_id for citation in result.citations], ["ev-1"])
        self.assertEqual(result.citations[0].verification_status, "verified")
        self.assertEqual(result.citations[0].validity_status, "current")
        self.assertIn("approved evidence", generator.prompts[0])
        self.assertIn("Section 12", generator.prompts[0])
        self.assertIn("concise, direct answer", generator.prompts[0])
        self.assertIn("immediately after each supported legal claim", generator.prompts[0])

    def test_no_relevant_verified_evidence_skips_generation(self) -> None:
        generator = FakeGenerator("This must not be used")
        assistant = LegalAssistant(LexicalEvidenceRetriever([evidence()]), generator)

        result = assistant.ask("How do I renew a passport?")

        self.assertEqual(result.status, "insufficient_evidence")
        self.assertEqual(generator.prompts, [])
        self.assertIn("won't guess", result.answer)

    def test_empty_question_is_rejected(self) -> None:
        assistant = LegalAssistant(LexicalEvidenceRetriever([]), FakeGenerator("unused"))
        with self.assertRaisesRegex(ValueError, "must not be empty"):
            assistant.ask("  ")

    def test_uncited_or_unknown_citation_is_rejected(self) -> None:
        retriever = LexicalEvidenceRetriever([evidence()])
        with self.subTest("no citation"):
            assistant = LegalAssistant(retriever, FakeGenerator("An answer without a source."))
            with self.assertRaisesRegex(UncitedAnswerError, "without evidence citations"):
                assistant.ask("What is the driving licence rule?")
        with self.subTest("unknown citation"):
            assistant = LegalAssistant(retriever, FakeGenerator("An answer. [E9]"))
            with self.assertRaisesRegex(UncitedAnswerError, "not provided"):
                assistant.ask("What is the driving licence rule?")

    def test_gemini_adapter_is_stateless_and_does_not_enable_search(self) -> None:
        class FakeInteraction:
            output_text = "Answer [E1]"

        class FakeInteractions:
            def __init__(self) -> None:
                self.kwargs = None

            def create(self, **kwargs: object) -> FakeInteraction:
                self.kwargs = kwargs
                return FakeInteraction()

        class FakeClient:
            def __init__(self) -> None:
                self.interactions = FakeInteractions()

        client = FakeClient()
        config = EngineConfig(api_key="test-key")
        generator = GeminiTextGenerator(config, client=client)

        self.assertEqual(generator.generate("prompt"), "Answer [E1]")
        self.assertEqual(
            client.interactions.kwargs,
            {
                "model": config.model,
                "input": "prompt",
                "generation_config": {
                    "max_output_tokens": config.max_output_tokens,
                    "thinking_level": config.thinking_level,
                },
                "store": False,
            },
        )
        self.assertNotIn("tools", client.interactions.kwargs)


if __name__ == "__main__":
    unittest.main()
