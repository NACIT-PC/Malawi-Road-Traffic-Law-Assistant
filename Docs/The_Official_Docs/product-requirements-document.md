\# Product Requirements Document (PRD)



\*\*Product:\*\* AI-Powered Road Traffic Law and Fine Assistance System for Malawi  

\*\*Document ID:\*\* PROD-003  

\*\*Version:\*\* 0.1  

\*\*Status:\*\* Draft for Team Review  

\*\*Product Lead:\*\* Tamanga  

\*\*Country:\*\* Malawi  

\*\*Parent Documents:\*\*

\- `product-definition.md`

\- `product-vision-and-scope.md`



\---



\## 1. Purpose



This Product Requirements Document defines the functional requirements, user stories, acceptance criteria, non-functional requirements, constraints, and release priorities for the initial version of the AI-Powered Road Traffic Law and Fine Assistance System for Malawi.



It provides a shared implementation reference for the Research and Data, Pipelines and AI Engineering, and Presentation and Communication departments.



The PRD describes the expected system behaviour without prescribing every implementation detail. Technical design decisions will be documented separately in the technical architecture.



\## 2. Product Summary



The product is a conversational legal-information assistant that helps users understand Malawian road traffic laws, identify potentially applicable offences, find verified prescribed penalties, and access official guidance.



The system will retrieve relevant information from an approved legal corpus and generate explanations grounded in that evidence. Substantive legal claims should be accompanied by supporting references.



The system must not fabricate legislation, penalties, citations, official decisions, or payment confirmations.



\## 3. Problem Statement



Road users may have difficulty locating relevant traffic legislation, understanding legal terminology, identifying the provision that applies to a situation, or finding reliable information about prescribed penalties.



A general-purpose chatbot may produce an answer without establishing whether its legal claims are supported by current legislation.



The product addresses this problem by combining verified legal data, information retrieval, source-backed answer generation, and an accessible user interface.



The severity and frequency of these problems must be validated through user research.



\## 4. Product Objectives



The initial release must aim to:



1\. Allow users to ask supported traffic-law questions in ordinary language.

2\. Retrieve relevant legal provisions from an approved legal corpus.

3\. Explain supported legal information in clear language.

4\. Provide accurate references to the underlying legal sources.

5\. Display prescribed penalties only when supported by verified records.

6\. Handle ambiguous questions and insufficient evidence safely.

7\. Direct users to verified official resources where appropriate.

8\. Support legal data maintenance and version tracking.

9\. Provide a usable, testable end-to-end experience.



\## 5. Target Users



\### 5.1 Primary user



\*\*Road user or driver\*\*



A person who wants to understand a traffic rule, investigate a potentially applicable offence, or learn the prescribed penalty associated with an offence.



\### 5.2 Secondary users



\- Learner drivers studying traffic rules.

\- Driving instructors and road-safety educators.

\- Members of the public researching road traffic legislation.



\### 5.3 Internal users



\- Research and Data team members who prepare and verify legal records.

\- AI and backend engineers who maintain retrieval, APIs, and data integration.

\- Product and presentation team members who test and demonstrate the user experience.



Administrative capabilities for managing the legal corpus must be explicitly designed and access-controlled; they must not be assumed to exist merely because the team needs them.



\## 6. MVP Scope and Priorities



Priorities are defined as follows:



\- \*\*P0 — Must have:\*\* Required for the MVP to be considered complete.

\- \*\*P1 — Should have:\*\* Important, but may be deferred if necessary and approved.

\- \*\*P2 — Future:\*\* Outside the initial release unless formally added to scope.



| Capability | Priority |

|---|---|

| Approved legal corpus and source register | P0 |

| Structured legal records and validation | P0 |

| Natural-language question input | P0 |

| Retrieval of relevant legal provisions | P0 |

| Evidence-grounded answer generation | P0 |

| Supporting legal citations | P0 |

| Verified prescribed penalty lookup | P0 |

| Uncertainty and failure handling | P0 |

| Basic responsive web interface | P0 |

| Verified official guidance links | P0 |

| Legal record version tracking | P0 |

| Basic retrieval and answer evaluation | P0 |

| User accounts and saved history | P2 |

| Voice interaction | P2 |

| Mobile application | P2 |

| Multilingual support beyond the agreed initial language | P2 |

| Direct payment processing | P2, subject to authorization |

| Automated government-system integration | P2, subject to authorization |



The first release should prioritize a reliable, source-backed question-and-answer workflow over a large number of features.



\## 7. Functional Requirements



\### 7.1 Legal source management



\*\*FR-001 — Register legal sources\*\*



Priority: P0



The system's approved legal corpus must have a source register identifying each source document.



The register should contain, where available:

\- Document title.

\- Issuing authority.

\- Publication or commencement date.

\- Version and amendment information.

\- Official source URL or document reference.

\- Collection and verification dates.

\- Review status.



\*\*Acceptance criteria\*\*

\- Each approved source has a unique identifier.

\- Source metadata is recorded where available.

\- A legal record can be traced to its originating document.

\- Sources with unresolved validity or authenticity issues are flagged for review.



\*\*FR-002 — Structure legal provisions\*\*



Priority: P0



The system must represent extracted legal provisions as structured records.



A record should support fields such as:

\- Record identifier.

\- Offence or legal topic.

\- Legal provision.

\- Explanation or summary.

\- Prescribed penalty, where applicable.

\- Conditions and qualifications.

\- Source document identifier.

\- Relevant section, regulation, or schedule.

\- Legal version or effective dates, where available.

\- Verification status.



\*\*Acceptance criteria\*\*

\- Required fields are defined in a data dictionary.

\- Records conform to the agreed schema.

\- Invalid records can be identified before publication.

\- Penalty values remain linked to their supporting provisions.



\*\*FR-003 — Validate legal records\*\*



Priority: P0



Legal records must be checked against their source documents before being approved for use.



\*\*Acceptance criteria\*\*

\- Each published record has a documented verification status.

\- Unverified records cannot be treated as approved current legal data.

\- Missing or conflicting information is flagged.

\- Corrections can be traced to the responsible review process.



\*\*FR-004 — Track legal versions\*\*



Priority: P0



The system must support tracking changes to legal documents and associated records.



\*\*Acceptance criteria\*\*

\- A record can be associated with its source version.

\- Updated records can be distinguished from previous versions.

\- Records with uncertain current validity are flagged.

\- The team can identify which source version supported an answer.



\### 7.2 Question input and interpretation



\*\*FR-005 — Accept natural-language questions\*\*



Priority: P0



Users must be able to submit questions about supported road traffic law topics through the web interface.



\*\*Acceptance criteria\*\*

\- A user can enter and submit a question.

\- The system validates that the input is not empty.

\- The interface indicates when a response is being processed.

\- Input errors are communicated clearly.

\- The interface does not require the user to know a legal section number.



\*\*FR-006 — Identify the question's subject\*\*



Priority: P0



The system must identify the relevant legal topic sufficiently to retrieve useful evidence.



\*\*Acceptance criteria\*\*

\- Questions about supported topics are routed to the legal retrieval process.

\- Ambiguous questions can trigger a clarification request.

\- Questions outside the supported scope are not presented as verified legal answers.



\### 7.3 Retrieval and answer generation



\*\*FR-007 — Retrieve relevant legal evidence\*\*



Priority: P0



The system must retrieve relevant provisions from the approved legal corpus before generating substantive legal explanations.



\*\*Acceptance criteria\*\*

\- Retrieved passages retain source identifiers and provision references.

\- Retrieval results can be inspected during testing.

\- The system can return an insufficient-evidence result.

\- Retrieval tests use a documented set of representative questions and expected supporting provisions.



\*\*FR-008 — Generate evidence-grounded answers\*\*



Priority: P0



The AI component must explain the retrieved legal evidence in clear, accessible language.



\*\*Acceptance criteria\*\*

\- Legal claims are supported by the retrieved evidence.

\- The response does not introduce unsupported penalties or legal provisions.

\- Important qualifications in the source are not silently removed.

\- If the evidence does not support a reliable answer, the system communicates that limitation.



\*\*FR-009 — Provide legal citations\*\*



Priority: P0



The system must provide references to the legal sources supporting substantive legal claims.



\*\*Acceptance criteria\*\*

\- A citation identifies the source document and the relevant provision when available.

\- Citations are associated with the claims they support.

\- A citation is not displayed as verified if it cannot be resolved to a source record.

\- Citation correctness is included in evaluation tests.



\*\*FR-010 — Retrieve prescribed penalties\*\*



Priority: P0



When a user asks about a penalty, the system must retrieve the relevant prescribed penalty from verified legal records.



\*\*Acceptance criteria\*\*

\- The displayed penalty matches the approved record and applicable provision.

\- Relevant conditions and qualifications are included when necessary.

\- The source reference is displayed

