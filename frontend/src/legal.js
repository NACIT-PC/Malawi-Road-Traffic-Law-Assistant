export const legalDraftDate = "14 November 2026";

export const legalDocuments = {
  terms: {
    path: "/terms",
    footerLabel: "Terms of Service",
    title: "Terms of Service",
    eyebrow: "Draft for legal review",
    description: "Terms for access to the MRTLA Malawi information prototype.",
    sections: [
      {
        heading: "1. About the service",
        paragraphs: [
          "MRTLA Malawi (\"MRTLA\", \"we\", or \"the service\") is an independent road-traffic-law information prototype. It is not operated, approved, or endorsed by the Government of Malawi, the police, a court, or another public authority.",
          "The service provides general explanations based on legal records made available to its backend. It does not access enforcement records, issue or cancel fines, take payments, decide guilt, or determine how a rule applies to your circumstances.",
        ],
      },
      {
        heading: "2. Eligibility and permitted access",
        paragraphs: [
          "You may use the service only in compliance with applicable law and these terms. The prototype is currently offered without a fee. We may change or discontinue features, but we will not introduce a charge without presenting the applicable price and terms first.",
          "Access may be limited or suspended where reasonably necessary to protect the service, users, or third parties, subject to rights that cannot be limited by law.",
        ],
      },
      {
        heading: "3. Information is not legal advice",
        paragraphs: [
          "AI-generated responses can be inaccurate, incomplete, out of date, or misleading. A citation is a trail for you to check; it does not prove that every claim is correct, that a provision applies to you, or that a fine was issued or is owed.",
          "Do not rely on the service as legal advice, an official notice, or a substitute for reading the current legal instrument. Verify important matters with the original source, an authorized official channel, or a qualified legal professional.",
        ],
      },
      {
        heading: "4. Your questions and privacy",
        paragraphs: [
          "Question text is sent to the MRTLA backend and may be sent to the configured Google Gemini API when generation is needed. The prototype does not provide accounts or intentionally save chat history, and its report endpoint does not currently store reports. Hosting and provider systems may process technical data under their own arrangements.",
          "Do not enter names, contact details, licence or vehicle identifiers, notice references, payment information, or other sensitive or identifying details. Read the draft Privacy Policy for more information and limitations.",
        ],
      },
      {
        heading: "5. Sources and third-party material",
        paragraphs: [
          "The legal source collection may be incomplete, unavailable, or not current. Source texts, software, brands, and media may belong to third parties and remain subject to their own rights and terms.",
          "Links to third-party services are provided for convenience. MRTLA does not control those services or adopt their content as an official position.",
        ],
      },
      {
        heading: "6. Availability and liability",
        paragraphs: [
          "The prototype is provided on an as-available basis. To the extent allowed by applicable law, MRTLA does not guarantee uninterrupted access, completeness, accuracy, or fitness for a particular decision.",
          "Nothing in these terms excludes a right, remedy, or liability that cannot lawfully be excluded or limited. Any other limitation of liability must be reviewed and completed by a Malawi-qualified legal professional before publication.",
        ],
      },
      {
        heading: "7. Changes and contact",
        paragraphs: [
          "We may revise these terms as the service changes. The publication date and change history should be maintained when a final version is approved. Contact: [insert monitored legal contact].",
          "This document is a draft and is not ready to be treated as an enforceable contract. A lawyer must confirm acceptance mechanics, governing law, dispute handling, and all mandatory consumer protections before launch.",
        ],
      },
    ],
  },
  privacy: {
    path: "/privacy",
    footerLabel: "Privacy Policy",
    title: "Privacy Policy",
    eyebrow: "Draft for legal review",
    description:
      "A preliminary account of data flows in the current MRTLA prototype. Hosting, provider, retention, and legal-basis details must be confirmed before launch.",
    sections: [
      {
        heading: "1. Who is responsible",
        paragraphs: [
          "MRTLA is the proposed operator of this service. The legal identity and location of the data controller have not been supplied. Contact: [insert monitored privacy contact]. Complete these details and confirm the applicable privacy law and user rights with qualified counsel before publication.",
        ],
      },
      {
        heading: "2. Information processed",
        paragraphs: [
          "When you submit a question, its text is sent to the MRTLA API. The API creates a request identifier for the response and uses the connecting IP address as an in-memory key for rate limiting. The prototype does not provide user accounts or intentionally persist chat history, and its reports endpoint currently returns an unavailable response instead of storing reports.",
          "If answer generation is needed, the question and retrieved legal evidence may be sent to the configured Google Gemini API. The current adapter requests `store=False`; this does not establish that Google performs no processing or retains no data. Google and the hosting provider may receive technical or service data according to the deployed configuration and their terms. The exact hosting provider, logs, retention periods, and applicable provider settings must be confirmed by the operator.",
          "The site stores the selected light/dark theme in your browser's local storage under the key `mrtla-theme`. This is a browser storage entry, not a cookie, and is used to remember your display preference.",
        ],
      },
      {
        heading: "3. Purposes and legal basis",
        paragraphs: [
          "The current purposes are to respond to general questions, operate and protect the service, enforce request limits, and troubleshoot errors. The lawful basis or other legal authority for each purpose must be identified by the operator under the privacy law applicable to the final service.",
        ],
      },
      {
        heading: "4. Sharing and international processing",
        paragraphs: [
          "Question data is processed by the MRTLA backend and, when needed, the configured AI provider. Hosting, security, and infrastructure vendors may also process data. Confirm the providers, contract terms, processing locations, and any cross-border transfer requirements before deployment; this draft does not certify that those arrangements are compliant.",
          "MRTLA does not currently operate a fine-payment, enforcement-record, or user-report storage integration.",
        ],
      },
      {
        heading: "5. Retention and security",
        paragraphs: [
          "The prototype has no application database for chat history or reports. It does not intentionally retain conversations between sessions, but provider and hosting logs or backups may have separate retention. Those periods and deletion procedures are not yet confirmed and must be documented before launch.",
          "The service uses request limits and other prototype-level controls, but no security measure is absolute. The operator must document the production controls, incident process, and retention schedule rather than relying on this draft as a security assurance.",
        ],
      },
      {
        heading: "6. Your choices and rights",
        paragraphs: [
          "You can clear the saved theme through your browser's site-data settings. Applicable rights to access, correct, delete, object to, or otherwise control personal data depend on the law that applies and the operator's confirmed role. Send requests to [insert monitored privacy contact]; this placeholder must be replaced before publication.",
        ],
      },
      {
        heading: "7. Children and sensitive data",
        paragraphs: [
          "The assistant is intended for general road-law information and is not designed to collect sensitive or identifying information. Do not enter personal identification, licence, vehicle, notice, payment, health, or other sensitive details. The operator must decide and publish any age restrictions before launch.",
        ],
      },
      {
        heading: "8. Updates",
        paragraphs: [
          "This is a draft, not a complete notice of the deployed data practices. Review it whenever the software, vendors, or data flows change. Publish the approval date, an effective date, and a process for notifying users of material changes.",
        ],
      },
    ],
  },
  eula: {
    path: "/eula",
    footerLabel: "EULA",
    title: "End User Licence Agreement",
    eyebrow: "Draft for legal review",
    description:
      "A limited agreement for use of the hosted MRTLA service. It does not determine ownership or licensing of repository code.",
    sections: [
      {
        heading: "1. Scope and grant",
        paragraphs: [
          "Subject to these draft terms and the Terms of Service, MRTLA grants you a limited, personal, non-exclusive, non-transferable permission to access and use the hosted service for lawful general-information purposes while it is made available.",
          "This permission does not grant a licence to the MRTLA name, marks, source code, or any third-party materials. Rights in repository code and content are governed by the applicable repository notice or licence, if any; this agreement does not create one.",
        ],
      },
      {
        heading: "2. Restrictions",
        paragraphs: [
          "Do not misuse the hosted service, interfere with its operation, bypass access controls, or represent it as an official government system. Do not copy or redistribute material unless you have permission or applicable law allows it.",
          "Nothing in this agreement restricts rights that cannot lawfully be restricted, including any mandatory rights relating to interoperability or consumer protection.",
        ],
      },
      {
        heading: "3. Third-party components",
        paragraphs: [
          "The service depends on third-party software and may link to third-party content. Those components and materials are governed by their own notices and licences, which take precedence for those materials.",
        ],
      },
      {
        heading: "4. Availability and termination",
        paragraphs: [
          "The hosted service is a prototype and may be changed, suspended, or discontinued. This permission ends when your access ends or the service is withdrawn. Any provisions that must continue by law will continue to the extent required.",
        ],
      },
      {
        heading: "5. Review before use",
        paragraphs: [
          "This EULA is a draft. Before publication, confirm the rights holder, repository licence, acceptance process, governing law, and consumer protections with a qualified legal professional. Contact: [insert monitored legal contact].",
        ],
      },
    ],
  },
  disclaimer: {
    path: "/disclaimer",
    footerLabel: "Disclaimer",
    title: "Disclaimer",
    eyebrow: "Important information",
    description:
      "Read this before relying on any MRTLA answer, citation, or source status.",
    sections: [
      {
        heading: "Not legal advice or an official service",
        paragraphs: [
          "MRTLA is an independent information prototype, not a government service, law firm, police system, court, or fine-issuing authority. Its content is general information, not legal advice or an official determination.",
        ],
      },
      {
        heading: "AI and source limitations",
        paragraphs: [
          "AI may misunderstand a question, omit a qualification, or produce an inaccurate answer. The configured source collection may be incomplete or unavailable, and a citation label does not prove that a statement is legally correct or applies to a particular person.",
          "Check the full, current legal instrument and confirm important matters with an authorized official channel or a qualified legal professional.",
        ],
      },
      {
        heading: "No fine or payment status",
        paragraphs: [
          "A description of an event and an AI response do not establish that an offence occurred or that a fine has been issued, is due, or has been paid. MRTLA does not access enforcement records or process payments.",
        ],
      },
      {
        heading: "No guarantee",
        paragraphs: [
          "The service and its content are provided as available. To the extent permitted by law, no guarantee is made about accuracy, completeness, currentness, availability, or suitability for a particular decision. Non-excludable rights remain unaffected.",
          "This draft should be reviewed by a Malawi-qualified legal professional before publication. Contact: [insert monitored legal contact].",
        ],
      },
    ],
  },
  cookies: {
    path: "/cookies",
    footerLabel: "Cookie Policy",
    title: "Cookie Policy",
    eyebrow: "Draft for legal review",
    description:
      "The current frontend remembers your theme using local storage. Production hosting and third-party behavior still need verification.",
    sections: [
      {
        heading: "Cookies used by this app",
        paragraphs: [
          "Based on the current application code, MRTLA does not intentionally set first-party cookies for analytics, advertising, or login. Verify this against the actual production site and every hosting, security, and embedded third-party service before relying on this statement.",
        ],
      },
      {
        heading: "Local storage preference",
        paragraphs: [
          "The app saves your light/dark display preference in browser local storage using `mrtla-theme`. It is stored on your device and used only to restore the appearance you selected. Clear it through your browser's site-data settings to remove it.",
        ],
      },
      {
        heading: "Third parties and browser controls",
        paragraphs: [
          "The backend may call a configured AI provider, and the deployed hosting or security layers may use their own storage technologies. Their behavior depends on the final configuration and must be checked before launch. Browser settings can block or clear cookies and local storage, though this may affect functionality.",
        ],
      },
      {
        heading: "Changes and contact",
        paragraphs: [
          "If cookies or similar technologies are added, update this policy and obtain any consent required by applicable law before non-essential storage is used. Contact: [insert monitored privacy contact]. This draft requires legal and production-configuration review.",
        ],
      },
    ],
  },
  acceptableUse: {
    path: "/acceptable-use",
    footerLabel: "Acceptable Use",
    title: "Acceptable Use Policy",
    eyebrow: "Draft for legal review",
    description:
      "Rules for responsible use of this independent, public-information prototype.",
    sections: [
      {
        heading: "1. Use the service responsibly",
        paragraphs: [
          "Use MRTLA only for lawful, general road-traffic information. Follow applicable laws, these rules, and the Terms of Service. Do not rely on the assistant to make an urgent safety decision or determine the outcome of a legal matter.",
        ],
      },
      {
        heading: "2. Prohibited conduct",
        paragraphs: [
          "Do not attempt to disrupt, overload, probe, or gain unauthorized access to the service or its infrastructure; bypass rate limits or other access controls; introduce malicious code; or interfere with another person's use.",
          "Do not use the service to impersonate an authority, create or distribute a false fine or payment demand, misrepresent an AI response as an official decision, harass or threaten others, or submit another person's personal information without authority.",
          "Do not use the service in a way that infringes intellectual-property rights, violates privacy, facilitates fraud, or otherwise breaks applicable law.",
        ],
      },
      {
        heading: "3. Personal and sensitive information",
        paragraphs: [
          "Do not submit names, addresses, contact information, licence or vehicle identifiers, notice references, payment credentials, or other sensitive or identifying information. The prototype is not a secure channel for case documents or personal records.",
        ],
      },
      {
        heading: "4. Enforcement and reporting",
        paragraphs: [
          "MRTLA may restrict access when reasonably necessary to protect the service or others, subject to applicable law. The current report endpoint does not persist reports, so do not assume that submitting a report stores or escalates it.",
        ],
      },
      {
        heading: "5. Contact and review",
        paragraphs: [
          "Report suspected security or misuse issues to [insert monitored contact]. Replace this placeholder and confirm escalation and response procedures before publication. This draft requires legal review.",
        ],
      },
    ],
  },
  dpa: {
    path: "/dpa",
    footerLabel: "DPA",
    title: "Data Processing Agreement",
    eyebrow: "Conditional business-to-business template",
    description:
      "This template applies only where MRTLA processes personal data for an organizational customer under that customer's documented instructions. It is not an agreement for ordinary public users.",
    sections: [
      {
        heading: "1. Parties and applicability",
        paragraphs: [
          "This draft is intended to be completed and signed by the customer (Controller) and the legal entity operating MRTLA (Processor). Insert each party's full legal name, address, registration details, signatory, and effective date before use. If MRTLA determines its own purposes and means for a processing activity, the parties must identify that activity and its correct legal roles instead of assuming this Processor model applies.",
          "This DPA is not effective until completed, reviewed, and signed by both parties, and only applies to the processing described in its completed Schedule 1.",
        ],
      },
      {
        heading: "2. Documented instructions and purpose",
        paragraphs: [
          "The Processor will process personal data only on the Controller's documented instructions and for the specific purpose and duration recorded in Schedule 1, unless applicable law requires otherwise. The customer must not submit data beyond the agreed scope.",
        ],
      },
      {
        heading: "3. Confidentiality and security",
        paragraphs: [
          "The parties must document appropriate technical and organizational measures in Schedule 2 before processing begins. Do not treat the current prototype's controls as a complete security commitment. Authorized personnel must be bound by confidentiality obligations appropriate to their role.",
        ],
      },
      {
        heading: "4. Sub-processors and transfers",
        paragraphs: [
          "List every approved sub-processor, service, processing location, purpose, and transfer mechanism in Schedule 3. Google Gemini may receive submitted question text when answer generation is needed; the hosting and infrastructure providers depend on deployment. The parties must confirm provider terms, authorization, safeguards, and applicable cross-border transfer requirements before enabling processing.",
        ],
      },
      {
        heading: "5. Assistance, incidents, and audits",
        paragraphs: [
          "The parties must agree how the Processor will assist with data-subject requests, security incidents, impact assessments, regulator inquiries, and audits, including response times and reasonable evidence requirements. The notice period, contact routes, and audit limits must be completed in the schedules; this template does not invent an incident-response guarantee.",
        ],
      },
      {
        heading: "6. Return, deletion, and end of service",
        paragraphs: [
          "At the end of the services, the Controller must choose in Schedule 1 whether data is returned or deleted, subject to legal retention duties and technically documented backups. Define deletion confirmation and backup expiry before signing.",
        ],
      },
      {
        heading: "7. Required schedules and legal review",
        paragraphs: [
          "Schedule 1 must identify subject matter, duration, nature and purpose, data subjects, personal-data categories, sensitive-data status, and Controller instructions. Schedule 2 must state verified security measures. Schedule 3 must name approved sub-processors and transfer details. Add liability, governing law, dispute, cooperation, and signature provisions only after legal review.",
          "This is an incomplete drafting template, not a signed agreement or a certification of compliance. A qualified privacy lawyer must adapt it to the parties, applicable law, deployed vendors, and actual data flows. Contact: [insert monitored legal/privacy contact].",
        ],
      },
    ],
  },
};

export const legalDocumentKeys = Object.keys(legalDocuments);
