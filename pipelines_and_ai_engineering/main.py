from __future__ import annotations

import argparse

from pipelines_and_ai_engineering.ai import LegalAssistant


def main() -> None:
    parser = argparse.ArgumentParser(description="Ask the Malawi road-traffic legal assistant")
    parser.add_argument("question", help="A question about a supported road-traffic law topic")
    args = parser.parse_args()

    assistant = LegalAssistant.from_environment()
    result = assistant.ask(args.question)
    print(result.answer)
    if result.citations:
        print("\nSources:")
        for citation in result.citations:
            print(f"- {citation.title}, {citation.provision} (evidence: {citation.evidence_id})")
            if citation.url:
                print(f"  {citation.url}")


if __name__ == "__main__":
    main()
