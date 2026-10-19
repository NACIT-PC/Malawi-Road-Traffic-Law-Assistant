# Data Dictionary (RD-04)

| Field | Type | Rule |
|---|---|---|
| record_id | string | Stable unique ID |
| jurisdiction | string | `Malawi` |
| offence_label | string | Concise offence wording |
| plain_language_summary | string | Neutral explanation without changing legal meaning |
| statutory_reference | string | Exact Act/regulation section and schedule item |
| penalty_type | string | Fixed fine, range, imprisonment, alternative penalty, etc. |
| amount_mwk | number/null | MWK amount; null if unknown/unverified |
| amount_basis | string/null | Preserve units such as per passenger/per offence |
| effective_from/effective_to | ISO date/null | Separate commencement from publication; null end date is not proof law is unchanged |
| source_ids | array | Must match IDs in source_register.csv |
| source_locator | string | Section, page, schedule item |
| verification_status | enum | unverified / provisional / conflict / verified / superseded / rejected |
| confidence | enum | low / medium / high |
| second_person_reviewer | string/null | Independent reviewer, not record author |
| second_person_verified_at | ISO date/null | Review date |
| notes | string | Uncertainty, conflicts, limits |

## Required rules
Every record must cite a source. Never mark a penalty verified until it is checked against official text and independently reviewed. Keep conflicting values unresolved. Use null, not zero, for unknown values. Preserve old versions in the change log. Do not equate a prescribed penalty with a case-specific amount owed.
