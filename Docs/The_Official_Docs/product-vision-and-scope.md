\# Product Vision and Scope



\*\*Product:\*\* AI-Powered Road Traffic Law and Fine Assistance System for Malawi  

\*\*Document ID:\*\* PROD-002  

\*\*Version:\*\* 0.1  

\*\*Status:\*\* Draft for Team Review  

\*\*Product Lead:\*\* Tamanga  

\*\*Country of Operation:\*\* Malawi  

\*\*Parent Document:\*\* `product-definition.md`



\---



\## 1. Purpose



This document defines the long-term vision, intended users, product boundaries, Minimum Viable Product (MVP), release objectives, and future development direction of the AI-Powered Road Traffic Law and Fine Assistance System for Malawi.



It establishes a shared understanding of what the team intends to build, what will be excluded from the initial release, and which conditions must be satisfied before the product can be considered ready for release.



This document serves as a planning baseline for product requirements, technical architecture, user experience design, data preparation, testing, and implementation.



\## 2. Product Vision



To make accurate, current, and understandable road traffic legal information accessible to road users throughout Malawi through a trusted, source-backed AI assistant.



The long-term vision is to reduce the difficulty of finding and understanding traffic laws by allowing people to ask questions naturally and receive clear explanations supported by authoritative legal sources.



The product should help users understand the rules, the potentially applicable offences, the prescribed penalties, and the appropriate official channels for further assistance.



\## 3. Product Mission



To transform verified Malawian road traffic legislation into accessible, searchable, and explainable legal information using structured data, information retrieval, and artificial intelligence.



The product will prioritize legal accuracy, traceability, transparency, privacy, and responsible use of AI over the appearance of providing an answer to every question.



\## 4. Product Goals



The product will pursue the following goals:



\### 4.1 Improve access to legal information



Enable users to ask questions in ordinary language instead of having to search through lengthy legal documents independently.



\### 4.2 Improve understanding



Translate relevant legal provisions into simple explanations without changing their legal meaning or omitting important conditions.



\### 4.3 Provide evidence-backed answers



Connect substantive legal explanations to the relevant legislation, regulations, schedules, and applicable amendments.



\### 4.4 Improve penalty information reliability



Provide prescribed penalty information only when the applicable legal provision and its current status have been sufficiently verified.



\### 4.5 Provide practical official guidance



Help users find verified official information and payment channels without misrepresenting the product as an enforcement authority or payment processor.



\### 4.6 Support ongoing legal updates



Establish a process through which legal documents and structured records can be reviewed, updated, versioned, and tested when legislation changes.



\## 5. Target Users and Priority



The following user groups are proposed for the initial product. Their priorities should be validated through user research.



| User group | Primary need | Initial priority |

|---|---|---|

| Drivers and road users | Understand a traffic rule, potential offence, or prescribed penalty | High |

| Learner drivers | Learn road traffic rules through accessible explanations | Medium |

| Driving instructors and road-safety educators | Explain rules using reliable legal references | Medium |

| Researchers and members of the public | Find and understand relevant legal provisions | Medium |

| Institutional stakeholders | Validate legal information and explore potential collaboration | Future engagement |



The first release should prioritize ordinary road users seeking answers to common road traffic law questions. Expanding the product to additional audiences should depend on evidence from testing and feedback.



\## 6. Product Scope



The scope is divided into the Minimum Viable Product, features that may follow after validation, and capabilities explicitly excluded from the initial release.



\### 6.1 Minimum Viable Product (MVP)



The MVP is the smallest complete version that can demonstrate the product's central value safely and reliably.



\#### A. Legal information corpus



The system will maintain an approved collection of relevant Malawian road traffic legislation, regulations, prescribed penalties, and applicable amendments.



The legal information must have identifiable sources and a documented verification status.



\#### B. Structured legal data



The system will organize extracted legal information into structured records that can be searched, updated, tested, and consumed by the backend.



Each record should preserve references to its original legal source and relevant provision.



\#### C. Conversational question-and-answer interface



Users will be able to submit natural-language questions about supported road traffic law topics through a web-based interface.



The system will identify the subject of the question and retrieve relevant legal information.



\#### D. Retrieval-based answer generation



The AI component will use retrieved legal evidence to generate plain-language explanations.



The system must not rely solely on the model's general knowledge to determine a legal rule or penalty.



\#### E. Legal source citations



Answers will provide references to supporting legal documents and specific provisions where available.



Citations must be relevant to the claims they support. The system should not present a citation as proof when the cited source does not establish the stated conclusion.



\#### F. Prescribed penalty lookup



When the legal data supports the answer, the system will provide the applicable prescribed penalty and any relevant conditions.



If the current penalty cannot be verified, the system will state that limitation rather than estimate or invent a fine.



\#### G. Uncertainty and error handling



The system will handle questions that are ambiguous, outside its supported legal corpus, or unsupported by sufficient evidence.



It should request clarification when necessary or direct the user to an appropriate verified official source.



\#### H. Official guidance



The system may provide verified links to relevant official information, payment channels, or assistance services.



It will not claim to have completed a payment or official transaction unless a separately authorized integration genuinely confirms that result.



\#### I. Basic evaluation and maintenance



The team will prepare test questions and expected evidence to assess retrieval relevance, legal accuracy, citation correctness, and uncertainty handling.



The legal corpus must have a documented update process.



\### 6.2 Post-MVP capabilities



The following features may be considered after the initial product has been tested and its core reliability demonstrated:



\- Chichewa and additional local-language support.

\- A mobile application or progressive web application enhancements.

\- User accounts and saved question history.

\- Notifications about changes to relevant laws.

\- Expanded legal search and browsing.

\- Additional accessibility features and low-bandwidth optimizations.

\- Administrative tools for reviewing and publishing legal updates.

\- Authorized integrations with relevant institutional systems.

\- Authorized payment integrations, subject to formal approval and technical feasibility.

\- Additional input methods, including voice interaction.



These features are not commitments for the first release. They require separate prioritization and requirements.



\### 6.3 Explicitly out of scope for the MVP



The first release will not:



\- Determine legal guilt or issue official rulings.

\- Issue, cancel, dispute, or settle a traffic fine on behalf of a public authority.

\- Collect or transfer money through an unverified payment mechanism.

\- Access restricted government enforcement systems without authorization.

\- Claim official government endorsement without evidence of formal approval.

\- Guarantee legal advice or replace qualified legal professionals.

\- Automatically treat a user's description of an incident as proof that an offence occurred.

\- Infer guilt from photographs, number plates, or other evidence.

\- Guarantee that every possible traffic-law question can be answered.

\- Provide unsupported legal conclusions when the applicable provision is uncertain.



Any proposal to expand these boundaries must be reviewed and documented before implementation.



\## 7. Core User Journey



The MVP will support the following primary journey.



1\. \*\*Ask:\*\* A road user submits a question about a traffic rule, potential offence, or prescribed penalty.

2\. \*\*Understand:\*\* The system identifies the subject and determines whether the question can be addressed using its approved legal corpus.

3\. \*\*Retrieve:\*\* The retrieval component searches for relevant legal provisions and supporting context.

4\. \*\*Validate:\*\* The system checks whether sufficient evidence is available to support the intended response.

5\. \*\*Explain:\*\* The system presents an accessible explanation and distinguishes established legal information from unresolved details.

6\. \*\*Reference:\*\* The user can inspect the cited source and relevant provision.

7\. \*\*Continue:\*\* Where appropriate, the system provides verified official links for further information or payment guidance.



If retrieval or validation fails, the system must not fabricate an answer simply to complete the journey.



\## 8. Product Boundaries and Responsibilities



\### 8.1 What the product is responsible for



The product is responsible for:



\- Retrieving information from the approved legal corpus.

\- Explaining supported legal information in accessible language.

\- Displaying accurate source references.

\- Presenting verified penalty information with appropriate context.

\- Communicating uncertainty and known limitations.

\- Directing users to verified official resources.

\- Protecting user information and maintaining the integrity of the legal dataset.



\### 8.2 What remains outside the product's authority



The product does not replace:



\- Authorized decisions by courts or enforcement authorities.

\- Official records confirming a person's actual offence or outstanding fine.

\- Formal legal interpretation by competent authorities.

\- Official processes for challenging or disputing a penalty.

\- Authorization and verification required for official payment processing.



A prescribed penalty listed in legislation must not automatically be treated as the amount a particular user owes. The actual amount or outcome may depend on the applicable provision, circumstances, subsequent legal changes, and official records.



\## 9. Legal Data and Currency Strategy



Legal accuracy is a release requirement, not an optional enhancement.



The research team must establish a verified source register and maintain the relationship between each structured legal record and its source document.



The source-management process should include:



1\. Identifying authoritative legislation, regulations, schedules, and amendments.

2\. Recording publication, commencement, and version details where available.

3\. Identifying the applicable legal provision for each offence or penalty record.

4\. Recording the date of collection and the date of the most recent verification.

5\. Flagging conflicting, incomplete, or potentially outdated records.

6\. Reviewing affected records when new legislation or amendments are identified.

7\. Testing the system against the updated records before publishing changes.



The 2026 amended prescribed-offence and penalty regulations must be considered when establishing the initial corpus. The team must verify their applicability and relationship to earlier instruments before publishing penalty information as current.



Where the legal status of a provision cannot be established, that provision must not be represented as definitively current.



\## 10. Non-Functional Product Expectations



The following qualities will guide the technical requirements.



\### Accuracy and reliability



Answers must be supported by retrieved legal evidence. Unsupported conclusions and invented penalties are unacceptable.



\### Transparency



Users must be able to identify the source behind substantive legal claims and understand when the system cannot provide a reliable answer.



\### Security and privacy



The system must collect only the information necessary for its intended functions, protect stored and transmitted information, and avoid exposing personal data through logs or responses.



\### Usability and accessibility



The interface should be readable, straightforward, responsive, and understandable to users with varying levels of technical and legal knowledge.



\### Maintainability



The legal corpus, backend, retrieval component, and user interface should be maintainable without unnecessary coupling between components.



\### Performance



The system should provide answers within a practical response time under the expected workload. Specific latency and availability targets will be defined in the technical requirements.



\### Traceability



Legal records, sources, versions, and test outcomes should be sufficiently documented to investigate and correct errors.



\## 11. MVP Success Measures



The team will evaluate the MVP using measurable indicators rather than relying only on whether the chatbot appears to work.



| Measure | Evaluation method |

|---|---|

| Legal answer support | Review substantive claims against the applicable source |

| Penalty correctness | Compare returned penalties with verified legal records |

| Retrieval relevance | Check whether the retrieved provisions support the test question |

| Citation accuracy | Verify that each citation supports the associated claim |

| Uncertainty handling | Test ambiguous, unsupported, and conflicting questions |

| User comprehension | Conduct usability testing with representative users |

| Legal update readiness | Demonstrate that a legal record can be reviewed, versioned, and updated |

| Security and privacy | Review data handling, access controls, and information exposure risks |



The project team must define numerical thresholds, test-set size, and release-blocking failures in the Product Requirements Document and testing plan.



Critical errors involving fabricated legal provisions, unsupported penalties, misleading citations, or false payment confirmations must be treated as release blockers.



\## 12. Dependencies and Assumptions



\### 12.1 Dependencies



The MVP depends on:



\- Access to authoritative legal documents.

\- Accurate extraction and verification of legal content.

\- A structured dataset and source register.

\- A functioning retrieval and answer-generation pipeline.

\- Backend and database integration.

\- A usable frontend.

\- A defined testing and legal-review process.

\- Verified official links for any payment guidance provided.



\### 12.2 Assumptions requiring validation



The team currently assumes that:



\- Road users will find a conversational legal assistant useful.

\- Sufficient authoritative legal material can be obtained and processed.

\- Relevant legal provisions can be retrieved reliably for common questions.

\- Users will benefit from explanations that include direct source references.

\- Official payment guidance can be provided without the MVP processing payments itself.



These assumptions must be tested rather than treated as proven facts.



\## 13. Risks and Mitigation



| Risk | Planned response |

|---|---|

| Outdated legislation | Track legal versions and establish a review process |

| Incorrect extraction of legal text | Validate extracted records against the original documents |

| AI-generated unsupported claims | Ground answers in retrieved evidence and test failure cases |

| Misleading or irrelevant citations | Evaluate citation support and relevance |

| Ambiguous descriptions of incidents | Ask for clarification or explain the limits of the available information |

| Users treating answers as official rulings | Communicate the product's informational role and limitations |

| Unverified payment links | Use an approved register of official channels and periodically verify links |

| Unauthorized institutional integration | Require documented authorization before integration |

| Excessive collection of personal data | Minimize data collection and review retention and access policies |



\## 14. Release Strategy



The product should progress through controlled stages.



\### Stage 1: Data and legal validation



Establish the authoritative source register, prepare the initial legal corpus, and validate selected offence and penalty records.



\### Stage 2: Technical proof of concept



Demonstrate that the system can retrieve a relevant legal provision and generate an answer with a source reference.



\### Stage 3: MVP integration



Connect the verified dataset, retrieval pipeline, backend, and user interface into a complete user journey.



\### Stage 4: Evaluation and controlled testing



Test supported questions, unsupported questions, ambiguous cases, conflicting sources, citations, usability, and security.



\### Stage 5: Release decision



Review the evaluation results, resolve critical issues, confirm official links, and obtain the necessary approvals before public release.



Passing a technical demonstration alone is not sufficient for release if legal accuracy and safety requirements remain unmet.



\## 15. Change Control



Any proposed addition or change to the product scope must be recorded and assessed for its effect on:



\- User value and project objectives.

\- Legal accuracy and safety.

\- Engineering effort and dependencies.

\- Data requirements.

\- Testing and acceptance criteria.

\- Delivery milestones and available resources.



The Product Lead coordinates scope decisions with the responsible department owners. Changes affecting legal interpretation, sensitive data, official integrations, or payment processing require additional review before approval.



\## 16. Definition of MVP Completion



The MVP can be considered complete when:



1\. The agreed initial legal corpus has been verified and documented.

2\. Users can submit supported traffic-law questions through the interface.

3\. The system retrieves relevant legal provisions from the approved corpus.

4\. Answers explain supported legal information in understandable language.

5\. Substantive legal claims provide appropriate supporting references.

6\. Prescribed penalties are displayed only when sufficiently verified.

7\. Unsupported and ambiguous questions are handled safely.

8\. Verified official guidance is available where relevant.

9\. Critical legal accuracy, citation, security, and privacy issues have been addressed.

10\. The complete user journey has been tested and demonstrated against agreed acceptance criteria.



\## 17. Decisions Required Before Scope Approval



The following decisions remain open:



\- Which traffic offences and legal topics are included in the first supported corpus?

\- Which languages are required for the MVP?

\- Is the first release a web application only?

\- Who is authorized to review and approve the legal dataset?

\- Which official payment and assistance channels can be verified?

\- What quantitative accuracy and performance thresholds will block release?

\- Will external legal or institutional reviewers participate in validation?

\- What budget, hosting, and operational constraints apply?



These decisions should be resolved or explicitly recorded as assumptions before the Product Requirements Document is finalized.



\## 18. Document Approval



\*\*Status:\*\* Draft for Team Review



\*\*Product Lead:\*\* Tamanga



\*\*Reviewing groups:\*\* Research and Data; Pipelines and AI Engineering; Presentation and Communication.



\*\*Approval criteria:\*\* Agreement on the product vision, MVP boundaries, exclusions, success measures, and unresolved decisions.



Once approved, this document becomes the scope baseline for the Product Requirements Document, technical architecture, user experience specification, testing plan, and delivery plan.

