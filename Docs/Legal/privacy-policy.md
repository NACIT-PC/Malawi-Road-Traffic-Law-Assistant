# Privacy Policy

**Status:** Draft for legal review and production verification  
**Prepared:** 14 November 2026  
**Proposed operator:** MRTLA (full legal identity and controller location to be completed)  
**Contact:** [insert monitored privacy contact]

## 1. Responsibility

MRTLA is the proposed operator of this service. The legal identity and location of the data controller have not been supplied. Complete these details and confirm the applicable privacy law and user rights with qualified counsel before publication.

## 2. Information processed

When you submit a question, its text is sent to the MRTLA API. The API creates a request identifier for the response and uses the connecting IP address as an in-memory key for rate limiting. The prototype does not provide user accounts or intentionally persist chat history, and its reports endpoint currently returns an unavailable response instead of storing reports.

If answer generation is needed, the question and retrieved legal evidence may be sent to the configured Google Gemini API. The current adapter requests `store=False`; this does not establish that Google performs no processing or retains no data. Google and the hosting provider may receive technical or service data according to the deployed configuration and their terms. The exact hosting provider, logs, retention periods, and applicable provider settings must be confirmed.

The site stores the selected light/dark theme in browser local storage under `mrtla-theme`. This browser storage entry remembers a display preference; it is not a cookie.

## 3. Purposes and legal basis

Current purposes are to respond to general questions, operate and protect the service, enforce request limits, and troubleshoot errors. The lawful basis or other legal authority for each purpose must be identified under the privacy law applicable to the final service.

## 4. Sharing and international processing

Question data is processed by the MRTLA backend and, when needed, the configured AI provider. Hosting, security, and infrastructure vendors may also process data. Confirm providers, contract terms, processing locations, and cross-border transfer requirements before deployment. This draft does not certify that those arrangements are compliant.

MRTLA does not currently operate a fine-payment, enforcement-record, or user-report storage integration.

## 5. Retention and security

The prototype has no application database for chat history or reports. It does not intentionally retain conversations between sessions, but provider and hosting logs or backups may have separate retention. Those periods and deletion procedures are not confirmed and must be documented before launch.

The service uses request limits and other prototype-level controls, but no security measure is absolute. Document production controls, incident handling, and retention rather than relying on this draft as a security assurance.

## 6. Choices and rights

Clear the saved theme through your browser's site-data settings. Applicable rights to access, correct, delete, object to, or otherwise control personal data depend on the law that applies and the operator's confirmed role. Send requests to the privacy contact above; replace the placeholder before publication.

## 7. Children and sensitive data

The assistant is intended for general road-law information and is not designed to collect sensitive or identifying information. Do not enter personal identification, licence, vehicle, notice, payment, health, or other sensitive details. The operator must decide and publish any age restrictions before launch.

## 8. Updates

This is a draft, not a complete notice of deployed data practices. Review it whenever software, vendors, or data flows change. Publish the approval date, an effective date, and a process for notifying users of material changes.
