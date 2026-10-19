# Research & Data Contribution — Malawi Road Traffic Law Assistant
**Owner:** Stanley | **Version:** 0.1.0 | **Status:** Draft for team review; not production-approved.

## Objectives covered
- RD-04: data dictionary and record schema
- RD-05: structured provisions/penalty records
- RD-06: independent verification
- RD-07: versioning and change log
- RD-09: evaluation questions and expected behaviour
- RD-10: triage/re-verify reported data errors
- AI-03: ingestion validation

## Key finding
MalawiLII lists the *Road Traffic (Prescribed Offences and Penalties) (Amendment) Regulations, 2026*, Government Notice 38 of 2026, published 8 May 2026, commencement recorded as 6 May 2026. The 2026 instrument replaces the schedule, so do not treat the 2019 schedule as current without checking the replacement.

The full official 2026 Gazette PDF could not be reliably extracted in this research pass. Amounts in `legal_records.json` are provisional, sourced from a transcription and/or secondary reporting, and require comparison against the official Gazette PDF plus second-person review. One alcohol-related amount has a source conflict and must remain unresolved.

## Files
1. README.md
2. source_register.csv
3. legal_records.json
4. data_dictionary.md
5. evaluation_set.csv
6. change_log.csv
7. verification_checklist.md
8. team_update.md

## Data safety rules
Never invent legislation, penalties, citations, or payment status. Say “prescribed penalty,” not “what you owe.” If a value is not verified from an authoritative source, say it needs verification. Do not present this draft as legal advice or production-ready data.

## References
- Road Traffic Act, Chapter 69:01 (MalawiLII; displayed version dated 2014-12-31): https://malawilii.org/akn/mw/act/1997/26/eng@2014-12-31
- 2026 Amendment Regulations, Government Notice 38: https://malawilii.org/akn/mw/act/gn/2026/38/eng@2026-05-08
- DRTSS legislation downloads: https://drtss.gov.mw/downloads/RoadTraffic
- Ministry of Transport and Public Works — DRTSS mandate: https://transport.gov.mw/index.php/departments/road-traffic
- Government-hosted older schedule (explicitly headed 2019; historical comparison only): https://malawi.gov.mw/index.php/resources/documents/notices?download=16:new-miscellaneous-fees-and-prescribed-offences-penalties
- Nation Online report, 13 May 2026 (secondary cross-check): https://mwnation.com/motorists-face-hefty-traffic-fines/
- OCR/transcription copy of 2026 schedule on Scribd (secondary; verify against Gazette): https://www.scribd.com/document/1058816141/Road-Traffic-Regulations-2026
