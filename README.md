# AI-Powered Road Traffic Law and Fine Assistance System for Malawi

> **Working title:** Malawi Traffic Law Assistant\
> **Project type:** AI-powered, public-facing road-traffic law
> information and fine-payment guidance system\
> **Initial scope:** Malawi

## 1. Overview

The AI-Powered Road Traffic Law and Fine Assistance System helps drivers
understand Malawi's road-traffic rules, identify offences that may be
relevant to a described incident, find the prescribed penalty in
verified official regulations, and navigate the authorized process for
paying a fine that has actually been issued.

The system explains legal information in plain language and points users
to official sources. It is an information and assistance tool---not a
police officer, court, legal decision-maker, or fine-issuing authority.

## 2. Problem Statement

Drivers may not know which road-traffic rule applies to an incident,
what penalty the law prescribes, or how to verify and pay an officially
issued fine. Legal documents can be difficult to interpret, while
penalty information copied from older or unofficial sources may be
outdated.

Malawi's applicable rules and prescribed penalties can change. The
system must therefore use current, verified official sources---including
the latest applicable amendments---rather than relying on old fine lists
or model memory.

## 3. Proposed Solution

Build a public-facing AI assistant that connects plain-language
questions to a verified collection of Malawi road-traffic laws,
regulations, prescribed penalties, and official payment guidance.

For each question, the assistant should: 1. Understand the driver's
description and ask for missing facts when necessary. 2. Identify the
potentially relevant offence or rule. 3. Explain the rule in plain
language and cite the exact official source, provision, and version
where available. 4. Display the prescribed penalty only when it can be
verified from an authoritative source, including relevant conditions or
ranges. 5. Explain that the result is informational and does not
establish that an official fine has been issued. 6. Direct the user to
an authorized verification and payment channel when a fine has been
issued.

## 4. Example User Journey

A driver asks:

> "I was using my phone while driving. What is the penalty?"

The system should: - Explain that the answer depends on the applicable
law and the facts of the incident. - Search the verified legal source
collection for the relevant rule. - Cite the applicable provision and
show the prescribed penalty only if the current source supports it. -
State any conditions, exceptions, or uncertainty that matter. - Clarify
that this answer is not proof of an outstanding fine. - Provide official
instructions for verifying or paying a fine, if those instructions have
been confirmed.

The assistant must not invent a penalty, claim to access a driver's
record without an authorized integration, or state that a fine is due
based only on the driver's description.

## 5. Core Features

### 5.1 Ask a Traffic-Law Question

Drivers can ask questions in ordinary language about road-traffic rules.
The assistant returns a concise explanation grounded in retrieved
official legal material.

### 5.2 Verified Offence and Penalty Lookup

A structured, version-controlled database maps offences to their legal
provisions, prescribed penalties, conditions, effective dates, and
official source documents.

### 5.3 Source Citations and Traceability

Every legal explanation and penalty result should include a source
title, provision or regulation number, publication or amendment date
where available, and a link or reference to the official document.

### 5.4 Official Fine Verification Guidance

The system distinguishes between: - **Informational estimate:** a
possible offence and its prescribed penalty based on a user's
description. - **Issued fine:** a penalty formally recorded or issued by
an authorized authority. - **Verified payment status:** a status
confirmed through an approved official integration or an official
receipt/reference verification process.

These states must never be presented as interchangeable.

### 5.5 Authorized Payment Handoff

When an issued fine is eligible for payment, the system guides the user
to the approved official payment channel. Direct payment, payment-status
retrieval, or receipt generation should only be implemented after formal
authorization and integration with the responsible authority or payment
provider.

### 5.6 User-Friendly Explanations

Use plain English initially, with potential future support for Chichewa
and other locally useful languages. Preserve the legal meaning when
simplifying a provision.

### 5.7 Legal-Source Update Management

Authorized administrators can add new laws, amendments, penalty
schedules, effective dates, and official payment instructions. Changes
should be reviewed, logged, and versioned.

## 6. Target Users

-   Drivers who want to understand road-traffic rules.
-   Drivers who have been stopped or issued a traffic fine and need help
    understanding the next steps.
-   Learner drivers and people preparing for driving tests.
-   Organizations providing driver education or fleet safety training.

The initial product is intended for public information and navigation,
not for police enforcement or adjudication.

## 7. Relationship to Existing Systems

The Malawi Police Service's PRMS app has been described publicly as an
operational tool for officers and supervisors, including recording
offences, generating payment reference numbers, and tracking payments.

This proposal focuses on the public-facing explanation and guidance
layer: helping drivers understand applicable rules, see cited prescribed
penalties, and reach authorized verification and payment services.

The project must verify the capabilities and current status of existing
systems before making claims about overlap or integration. It should
complement authorized government systems rather than impersonate or
replace them.

## 8. Data and Source Strategy

The system should prioritize: 1. Current official laws and regulations
published by the responsible Malawi government bodies. 2. Official
amendment instruments and prescribed-offence/penalty schedules, with
effective dates checked. 3. Official government instructions for fine
verification and payment. 4. Written guidance or integration
specifications supplied by the responsible authorities.

Potential source starting point: the Directorate of Road Traffic and
Safety Services (DRTSS), through its official website and publications.

Each imported legal source should record, where available: - Document
title and issuing authority. - Regulation or provision identifier. -
Publication and effective dates. - Amendment or supersession status. -
Official URL or document reference. - Date retrieved and date last
reviewed. - Review status and reviewer.

**Important:** Do not assume that a webpage is current merely because it
is hosted on an official domain. Confirm the applicable version,
commencement date, and any later amendments before using a penalty in a
live answer.

## 9. High-Level System Design

A possible architecture is:

1.  **User interface** --- responsive web app first; mobile app can
    follow.
2.  **Question and context layer** --- extracts the driver's question
    and asks for relevant missing facts.
3.  **Legal retrieval layer** --- searches only approved, indexed legal
    sources and current penalty records.
4.  **Rule and penalty service** --- matches supported offences and
    returns structured penalties with effective dates and conditions.
5.  **AI explanation layer** --- explains retrieved material in plain
    language without inventing missing legal details.
6.  **Source and version manager** --- tracks official documents,
    amendments, review status, and audit history.
7.  **Payment guidance layer** --- presents verified official
    instructions and, later, approved integration options.
8.  **Audit and monitoring layer** --- records source versions and
    system decisions needed to investigate errors, while minimizing
    personal data.

The AI should not be the source of truth for the fine amount. The
verified legal database is the source of truth; the AI explains the
result.

## 10. Safety, Legal, and Trust Requirements

-   **No invented penalties:** If no current authoritative source is
    found, say so and direct the user to the responsible authority.
-   **No false fine claims:** A user's description cannot establish that
    an official fine exists.
-   **No unauthorized payments:** Never collect or process payments
    outside an approved channel.
-   **No impersonation:** Clearly identify the product as an independent
    assistant unless formal government authorization says otherwise.
-   **Clear uncertainty:** Explain when the answer depends on missing
    facts, officer assessment, court proceedings, or legal
    interpretation.
-   **Source transparency:** Show the regulation or official source
    supporting each penalty result.
-   **Privacy by design:** Collect the minimum information necessary. Do
    not request national ID, licence, vehicle, or payment details unless
    genuinely required for an authorized function and handled securely.
-   **Security:** Protect accounts and integrations, validate inputs,
    restrict administrative access, and maintain appropriate audit logs.
-   **Human escalation:** Direct users to the relevant authority or a
    qualified legal professional when a matter is disputed, complex, or
    not adequately supported by the sources.
-   **No legal outcome guarantees:** Do not promise that a fine can be
    cancelled, reduced, or successfully challenged.

## 11. MVP Scope

### Included in the first prototype

-   A web-based question-and-answer interface.
-   A small, carefully verified collection of current official
    traffic-law documents.
-   Retrieval-based answers with citations to provisions.
-   A structured offence-and-penalty lookup for entries that have been
    verified.
-   Clear labels distinguishing informational results from officially
    issued fines.
-   Links to official sources and confirmed payment instructions.
-   An administrative process for reviewing and updating legal sources.

### Excluded until authorization and validation

-   Issuing, cancelling, reducing, or disputing fines on behalf of an
    authority.
-   Claiming to retrieve a person's outstanding fines without an
    approved connection.
-   Taking payments directly or storing payment credentials.
-   Accessing police records or restricted government systems without
    written permission.
-   Presenting unverified or outdated penalty amounts as current law.

## 12. Suggested Development Phases

### Phase 1 --- Research and validation

-   Identify the latest applicable road-traffic laws, regulations, and
    prescribed-penalty amendments.
-   Confirm effective dates and resolve conflicting or superseded
    documents.
-   Map the official process for fine issuance, verification, and
    payment.
-   Identify the government bodies and approvals needed for any
    integration.

### Phase 2 --- Legal knowledge base

-   Extract and structure selected provisions and penalty entries.
-   Record provenance, version, effective date, and review status.
-   Have the extracted entries checked against the original official
    documents.

### Phase 3 --- AI information prototype

-   Build a question interface and retrieval pipeline.
-   Generate answers only from retrieved, verified sources.
-   Require citations and provide a safe fallback when evidence is
    missing.
-   Test common questions and ambiguous scenarios.

### Phase 4 --- Verification and usability testing

-   Test answer accuracy against manually reviewed cases.
-   Test outdated, conflicting, incomplete, and unsupported legal
    information.
-   Evaluate whether users understand the difference between a
    prescribed penalty and an issued fine.
-   Fix misleading answers before public release.

### Phase 5 --- Official service integration

-   Seek formal approval and technical documentation from the
    responsible authorities.
-   Integrate fine verification or payment only through authorized
    interfaces.
-   Test payment references, error handling, receipts, privacy, and
    reconciliation with the service owner.

## 13. Initial Success Criteria

The prototype is ready for a controlled demonstration when: - Every
displayed penalty has a traceable, reviewed official source and
applicable version. - Answers do not claim that a fine has been issued
based only on a user's description. - Unsupported questions produce a
clear limitation rather than a guessed answer. - Users can distinguish
informational guidance from official records and payment confirmation. -
The system links users to confirmed official channels and does not
imitate them. - Source updates can be reviewed and audited.

Before any public launch, legal-source coverage, accuracy, privacy,
security, and government-facing claims should be reviewed.

## 14. Risks and Mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Regulations or penalties change     Version sources, monitor
                                      amendments, and review effective
                                      dates before publishing updates.

  AI gives an incorrect legal answer  Retrieve from verified sources,
                                      require citations, test
                                      systematically, and use safe
                                      fallbacks.

  Users mistake guidance for an       Display clear labels and never
  official fine                       infer an outstanding fine from a
                                      description.

  Payment instructions are fraudulent Link only to confirmed official
  or outdated                         channels and revalidate them
                                      regularly.

  Government integration is           Launch the information prototype
  unavailable                         without restricted records or
                                      direct payment.

  Sensitive information is exposed    Minimize collection, secure data,
                                      and obtain authorization before
                                      handling personal or payment
                                      records.
  -----------------------------------------------------------------------

## 15. Open Questions

-   Which official documents and penalty schedules are currently
    authoritative, including the 2026 amendments?
-   What is the legally correct process for verifying an issued fine?
-   Which payment channels are officially approved, and can they be
    linked to or integrated with?
-   Is a public API available, or would a formal government partnership
    be required?
-   What permissions, disclaimers, security controls, and
    data-protection obligations apply?
-   Should the first release support English only, or also Chichewa?

These questions must be resolved through source verification and
engagement with the responsible authorities, not guessed by the AI.

## 16. Project Name

**Working title:** AI-Powered Road Traffic Law and Fine Assistance
System for Malawi

Possible short name: **Malawi Traffic Law Assistant**

The name and branding should not imply official government ownership or
endorsement unless that status has been formally granted.

## 17. Disclaimer

This project is a proposed information and assistance system. Its
explanations are not an official determination of an offence, a notice
that a fine has been issued, or legal advice. The applicable law, the
facts of the incident, and decisions by authorized officials determine
the outcome. Users should verify fines and make payments only through
official channels confirmed by the responsible authorities.

## 18. Draft legal documents

The project includes draft Terms of Service, Privacy Policy, End User Licence Agreement, Disclaimer, Cookie Policy, Acceptable Use Policy, and a conditional Data Processing Agreement template. Review the [legal draft index](Docs/Legal/README.md) and its completion checklist. These documents are not approved legal terms; replace contact/operator placeholders, verify the production data flows and vendors, and obtain review by a Malawi-qualified legal professional before publication.
