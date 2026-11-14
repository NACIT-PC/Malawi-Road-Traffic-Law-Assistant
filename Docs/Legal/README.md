# Legal policy drafts

These are working drafts for the MRTLA Malawi prototype, prepared 14 November 2026. They are not legal advice, approved terms, or evidence that the production service follows the described practices. Have a Malawi-qualified legal professional review and complete them before publication or reliance.

| Draft | Website page |
|---|---|
| [Terms of Service](terms-of-service.md) | `/terms` |
| [Privacy Policy](privacy-policy.md) | `/privacy` |
| [End User Licence Agreement](eula.md) | `/eula` |
| [Disclaimer](disclaimer.md) | `/disclaimer` |
| [Cookie Policy](cookie-policy.md) | `/cookies` |
| [Acceptable Use Policy](acceptable-use-policy.md) | `/acceptable-use` |
| [Data Processing Agreement](data-processing-agreement.md) | `/dpa` |

The website copy is maintained in `frontend/src/legal.js`. Keep it consistent with these project documents whenever either version changes.

## Required before publication

- Replace `[insert monitored legal/privacy contact]` and identify MRTLA's full legal operator/controller, address, and contact details.
- Confirm the applicable privacy and consumer laws, lawful bases, user rights, age policy, retention periods, hosting logs, and incident process.
- Inspect production cookies and browser storage; confirm AI, hosting, and infrastructure providers, their terms, locations, and retention.
- Confirm the repository's software/content rights and licence before making any EULA statement about code ownership or reuse.
- Have counsel settle contract acceptance, governing law, liability wording, and dispute terms.
- Complete the DPA schedules and sign the agreement only where MRTLA is actually processing personal data for an organizational customer.

The app currently stores a display preference in browser local storage, sends questions to its backend, may send question/evidence context to the configured Gemini provider when generation is needed, and does not provide application chat-history or report storage. These are implementation observations, not a complete audit of deployment, vendor, browser, or legal compliance.
