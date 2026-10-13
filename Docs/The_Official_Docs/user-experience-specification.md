# User Experience Specification

**Document ID:** UX-001  
**Version:** 0.1  
**Status:** Draft for Team Review  
**Product:** AI-Powered Road Traffic Law and Fine Assistance System for Malawi  
**Product Lead:** Tamanga  
**Country:** Malawi  
**Parent Documents:**
- `product-definition.md`
- `product-vision-and-scope.md`
- `product-requirements-document.md`

---

## 1. Purpose

This document defines how users will interact with the AI-Powered Road Traffic Law and Fine Assistance System for Malawi.

It describes the user interface, navigation, conversation flows, answer presentation, legal citations, prescribed fine information, official payment guidance, error handling, accessibility, and usability requirements.

The purpose is to ensure that users can ask questions in ordinary language and receive understandable, evidence-based information about Malawian road traffic laws.

This document defines the expected user experience rather than the technical implementation.

## 2. UX Objectives

The system's user experience must:

1. Make road traffic laws easier for ordinary people to understand.
2. Allow users to ask questions without knowing the exact legal terminology.
3. Present relevant legal provisions and their sources clearly.
4. Display prescribed fines only when supported by verified, applicable legal sources.
5. Distinguish confirmed legal information from incomplete or uncertain results.
6. Guide users towards verified official payment or follow-up channels.
7. Avoid misleading users into believing that an AI response is an official legal decision.
8. Work on desktop computers and mobile devices.

## 3. Target Users

### 3.1 Drivers

Drivers need to understand traffic rules, possible offences, applicable penalties, and the appropriate next steps.

### 3.2 Learner Drivers

Learner drivers need accessible explanations of road traffic rules to improve their knowledge and compliance.

### 3.3 Vehicle Owners and Other Road Users

Vehicle owners, passengers, pedestrians, and other road users may need clarification about rules that affect them.

### 3.4 Users Seeking Fine Information

Users who have been informed of a possible traffic offence may want to understand the relevant provision, the prescribed penalty, and how to verify or pay through an official channel.

The system must not assume that a user has committed an offence merely because they ask about it.

## 4. UX Principles

### 4.1 Simplicity

The interface should be understandable to people with different levels of technical and legal knowledge.

### 4.2 Evidence Before Confidence

Legal answers must be based on retrieved and verified legal sources. The interface must never make an unsupported answer appear authoritative.

### 4.3 Explain, Then Cite

The assistant should explain the relevant rule in plain English and provide the legal reference supporting that explanation.

### 4.4 Transparency

Users must be able to distinguish between:

- Information supported by verified legal sources.
- Information that requires additional facts.
- Information the system cannot reliably establish.
- Official actions that must be completed outside the assistant.

### 4.5 User Control

Users should be able to refine their question, inspect sources, correct misunderstandings, and leave the conversation without being forced to provide unnecessary personal information.

### 4.6 Responsible Legal Guidance

The system provides legal information and explanations. It does not determine guilt, issue penalties, overturn enforcement decisions, or replace courts and authorized officials.

## 5. Platform and Navigation

### 5.1 Initial Platform

The MVP will use a responsive web interface accessible through a browser on a desktop, laptop, tablet, or mobile phone.

A dedicated mobile application is outside the initial MVP scope.

### 5.2 Main Navigation

The proposed navigation contains:

- **Home:** Introduction to the system and example questions.
- **Ask a Question:** Opens the legal assistant.
- **How It Works:** Explains how the assistant uses legal sources.
- **Legal Sources:** Shows the legal materials used by the system, including source dates and verification status where available.
- **About and Limitations:** Explains the system's purpose and limitations.

The navigation should remain simple. Features that are not implemented or supported by verified data must not appear as working features.

## 6. Core Screens

### 6.1 Home Screen

**Purpose:** Help users understand what the system does and start asking a question quickly.

Required elements:

- Product name and short description.
- A prominent question input.
- A clear action to submit the question.
- Example questions.
- A short explanation that answers are based on legal sources.
- A visible notice that the system does not issue official legal decisions.

Proposed introductory copy:

> Understand Malawi's road traffic laws. Ask a question, explore the relevant legal provisions, and find verified information about prescribed penalties and official next steps.

Example questions:

- What does Malawi's road traffic law say about driving without a valid licence?
- What penalty is prescribed for a particular traffic offence?
- How can I verify the official payment procedure for a traffic fine?
- Which legal provision covers this traffic rule?

These are example questions, not guarantees that the system already has sufficient verified data to answer each one.

### 6.2 Question and Answer Screen

**Purpose:** Allow users to ask questions and inspect the assistant's responses.

Required elements:

- A conversation area.
- A text input for questions.
- A submit action.
- A loading indicator while a response is being prepared.
- Clearly distinguished user questions and assistant answers.
- Legal citations attached to relevant claims.
- A way to ask a follow-up question.
- A way to report an incorrect or unsupported answer.

The interface must not display a fabricated answer while waiting for a real result.

### 6.3 Legal Source Details

**Purpose:** Allow users to inspect the legal basis of an answer.

Where the source data supports it, the source details should show:

- Title of the legal instrument.
- Relevant section, regulation, schedule, or paragraph.
- The relevant legal text or an appropriate excerpt.
- Publication or amendment date, where known.
- Source version and effective date, where verified.
- A link to the original official document when available.
- Any applicable qualification or limitation.

A source link must open the actual referenced source. The system must not generate links or legal references that have not been verified.

### 6.4 Penalty Information

**Purpose:** Present a prescribed penalty only when the system can establish that the penalty applies to the relevant legal provision and circumstances.

When verified information is available, the response should show:

- The offence or relevant legal description.
- The applicable legal provision.
- The prescribed fine or penalty.
- Any relevant conditions, ranges, or qualifications.
- The source supporting the penalty.
- A note explaining that the amount or penalty must be interpreted under the applicable law.

If the applicable penalty cannot be established, the interface must say so rather than display an estimated amount.

The system must distinguish a prescribed penalty from an amount appearing on an individual notice, receipt, or enforcement document.

### 6.5 Official Next Steps

**Purpose:** Help users proceed to a legitimate official channel.

Where a relevant channel has been verified, the assistant may provide:

- The official organization responsible for the next step.
- A verified official website or payment link.
- Relevant instructions supported by an official source.
- A reminder to verify the offence details and amount before payment.

The MVP will direct users to official channels. It will not claim to process a payment, settle a fine, or confirm payment unless such a capability is subsequently implemented and formally authorized.

### 6.6 About and Limitations Screen

This screen should explain:

- The purpose of the assistant.
- How legal sources are used.
- Why citations are provided.
- Why some questions cannot be answered conclusively.
- The difference between legal information and an official determination.
- How users can report incorrect answers or outdated sources.

## 7. Primary User Journey

The main journey is:

1. The user opens the website.
2. The user enters a question about a road traffic rule or possible offence.
3. The system identifies the subject of the question.
4. The system retrieves relevant legal evidence from its approved legal corpus.
5. The system checks whether the evidence supports an answer.
6. The assistant explains the relevant rule in plain language.
7. The assistant displays citations and applicable penalty information, if verified.
8. The user opens the cited source or asks a follow-up question.
9. If the user needs to take action, the assistant provides verified official next steps when available.

If the system cannot retrieve sufficient evidence, the journey must lead to an honest limitation message rather than an invented legal answer.

## 8. Conversation and Response Specification

### 8.1 Standard Response Structure

A response should use the following structure when each section is relevant and supported:

1. **Direct answer:** A short response to the user's question.
2. **Explanation:** A plain-language explanation of the relevant rule.
3. **Applicable legal provision:** The verified citation or citations.
4. **Prescribed penalty:** Included only if the applicable penalty has been verified.
5. **Important qualifications:** Facts or legal conditions that could affect the answer.
6. **Official next step:** A verified channel or instruction, if appropriate.

Not every response must contain all six sections. For example, a general question about road safety may not require a fine or payment link.

### 8.2 Plain-Language Requirements

The assistant should:

- Prefer familiar words over unexplained legal terminology.
- Explain legal terms when they are necessary.
- Use short paragraphs and clear headings.
- Avoid unnecessarily long legal quotations.
- Preserve the meaning and qualifications of the original law.
- Separate the legal rule from the assistant's explanation of that rule.

The assistant must not simplify a legal provision so aggressively that its meaning changes.

### 8.3 Follow-Up Questions

If the answer depends on missing information, the assistant should ask a focused clarification question.

For example, if a user asks about a penalty but the available legal materials contain different penalties depending on the circumstances, the assistant should explain what information is missing before presenting a specific amount.

The assistant must not request personal information unless it is necessary for the task.

## 9. Uncertainty and Failure States

The user experience must support the following states.

### 9.1 Sufficient Verified Evidence

The assistant provides the supported explanation, relevant citations, and any verified penalty information.

### 9.2 Insufficient Evidence

Proposed message:

> I couldn't find enough verified legal information to answer this reliably. I won't guess the applicable rule or fine. You can review the available legal sources or consult the relevant official authority.

### 9.3 Conflicting Legal Sources

Proposed message:

> The available sources appear to differ. I can't confidently establish which provision or penalty applies. Please check the current official legal instrument or confirm the position with the relevant authority.

The system should explain the nature of the conflict when the evidence permits it.

### 9.4 Potentially Outdated Source

Proposed message:

> The available information may not reflect the current law. Please verify the applicable provision and penalty against the latest official legal materials before relying on it.

The system must not label a source as current unless its status has been checked.

### 9.5 Ambiguous Question

Proposed message:

> I need a little more information to identify the relevant rule. Can you clarify the circumstances of the situation?

The assistant should ask only the most important clarification question first.

### 9.6 Technical Failure

Proposed message:

> I couldn't retrieve the legal information right now. Please try again later. No fine or legal conclusion has been confirmed by this response.

### 9.7 Unverified Payment Channel

If the assistant cannot verify a payment channel, it must not provide it as an official destination.

Instead, it should tell the user to contact the relevant official authority through a verified contact route.

## 10. Legal Safety and Trust Indicators

The interface must not use decorative confidence scores or unsupported labels such as "100% legally correct."

Trust should be communicated through verifiable evidence, not visual design alone.

The system should:

- Display source citations near the claims they support.
- Make source details easy to inspect.
- Identify uncertainty clearly.
- Avoid implying government endorsement unless formally established.
- Avoid presenting an AI-generated explanation as an official notice or ruling.
- Avoid asserting that a user is guilty based on a brief description.
- Never claim that a payment has been completed based only on displaying a payment link.

A short legal-information disclaimer should be visible in the assistant interface and available in full on the About and Limitations screen.

## 11. Visual and Interaction Requirements

### 11.1 Visual Direction

The proposed visual direction is clean, professional, readable, and suitable for a public-service information tool.

The interface should prioritize:

- Clear typography.
- Strong text contrast.
- Simple navigation.
- Consistent spacing.
- Readable source references.
- Restrained use of color.
- Clear visual separation between answers, citations, warnings, and actions.

The interface must not resemble an official government portal unless the project has received the relevant authorization.

### 11.2 Mobile Experience

On mobile devices:

- The question input must be easy to reach and use.
- Long answers must remain readable without horizontal scrolling.
- Citations must be tappable.
- Important warnings must not be hidden below decorative content.
- Buttons and links must be usable on touchscreens.
- Source documents should open in a usable mobile format when available.

### 11.3 Accessibility

The MVP should follow practical accessibility principles:

- Use semantic headings and form labels.
- Ensure adequate contrast.
- Support keyboard navigation.
- Make interactive elements understandable to screen readers.
- Do not communicate warnings through color alone.
- Provide meaningful text for loading, success, and error states.
- Ensure that text can be enlarged without breaking the layout.

## 12. Privacy and User Control

The MVP should allow users to ask general legal questions without creating an account.

The interface should not request a user's national identification number, driving licence number, payment credentials, or other sensitive information to answer a general legal question.

If users enter personal information voluntarily, the system must handle it according to the project's approved privacy and data-retention requirements.

The interface should explain what information is collected when that information is necessary for the service.

Conversation history, user accounts, notifications, and personalized legal reminders are not required for the initial MVP.

## 13. Feedback and Reporting

Users should have a straightforward way to report:

- An incorrect legal explanation.
- A missing or broken citation.
- An apparently outdated legal provision.
- A penalty that may be incorrectly stated.
- An unverified or broken official link.
- A technical problem.

Reports should capture the relevant answer or reference where possible, without unnecessarily collecting personal information.

The team should use these reports to identify problems in the legal data, retrieval process, generated explanations, and interface.

## 14. UX Acceptance Criteria

The user experience will be accepted for the MVP when the following conditions are met:

- [ ] A user can submit a road traffic law question from a desktop or mobile browser.
- [ ] The interface clearly distinguishes user questions from assistant responses.
- [ ] Supported answers display relevant legal citations.
- [ ] Users can open available source details.
- [ ] A prescribed fine is displayed only when supported by verified, applicable legal data.
- [ ] The assistant asks for clarification when missing information materially affects the answer.
- [ ] Insufficient or conflicting evidence produces an appropriate limitation message.
- [ ] Outdated or unverified information is not presented as confirmed current law.
- [ ] Official payment links are displayed only after verification.
- [ ] The interface never falsely claims that a fine has been paid or legally settled.
- [ ] Users can report incorrect answers and broken citations.
- [ ] The interface remains usable on common mobile and desktop screen sizes.
- [ ] Core interactions are keyboard accessible and readable with assistive technology.
- [ ] The legal-information disclaimer is available to users.
- [ ] The team has tested representative successful, ambiguous, unsupported, and failure scenarios.

## 15. Team Responsibilities

### Tamanga — Product Lead

- Approve the core user journeys and product requirements.
- Coordinate feedback across the teams.
- Confirm that the interface aligns with the intended MVP.
- Prioritize usability improvements.

### Mphatso — UI/UX and Frontend

- Produce initial wireframes and screen designs.
- Define navigation and reusable interface components.
- Implement or coordinate frontend work according to the team's agreed allocation.
- Test responsiveness, accessibility, and usability.

### Valentino — AI and Retrieval

- Ensure that the assistant's response structure supports citations and uncertainty.
- Coordinate how retrieved evidence is represented to the frontend.
- Ensure that the interface receives enough information to distinguish supported answers from unsupported ones.

### Vitumbiko and Papela — Engineering and Testing

- Support integration between the interface, backend, retrieval pipeline, and legal data.
- Test error states, missing evidence, conflicting sources, and malformed responses.
- Report UX-related defects and verify fixes according to the team's agreed responsibilities.

### Research and Data Team

- Provide verified legal source metadata and provision references.
- Confirm the availability and verification status of penalty records and official links.
- Flag legal data that is incomplete, ambiguous, or potentially outdated.

### Presentation and Communication Team

- Help explain the product to the intended audience.
- Ensure demonstrations accurately represent implemented features.
- Avoid presentation materials that imply unsupported capabilities or official endorsement.

These responsibilities are proposed allocations and should be confirmed by the team.

## 16. Dependencies

The UX depends on:

- An approved and maintained legal corpus.
- Reliable legal citations and source metadata.
- Verified penalty information where penalties are displayed.
- A backend response format that can represent citations and uncertainty.
- Verified official links and payment guidance.
- An agreed privacy policy and data-handling approach.
- A working frontend-to-backend integration.

If these dependencies are missing, the interface must communicate the limitation rather than substitute fabricated information.

## 17. Open Decisions

The team must decide the following before finalizing the UX:

1. Whether the MVP will support English only or include Chichewa.
2. Whether legal source documents will open within the website or in a separate browser tab.
3. Whether users will be able to copy or download answer summaries.
4. How users will report incorrect answers and how those reports will be reviewed.
5. Which official organizations and payment channels have been verified for inclusion.
6. Whether the MVP will retain anonymous conversation data for evaluation, and for how long.
7. Which accessibility and mobile-device test targets will be used for release approval.

These decisions must be recorded before the relevant features are treated as final requirements.

## 18. Completion and Approval

This specification is complete when the team has reviewed the main screens, primary user journey, answer format, source presentation, uncertainty states, and acceptance criteria.

Before implementation is approved, the team should produce wireframes for the home screen, question-and-answer screen, legal source details, penalty information, and important error states.

Any changes that affect legal accuracy, payment guidance, privacy, or the scope of the MVP must be reviewed by the relevant team members and recorded in the project documentation.

**Document status:** Draft for Team Review  
**Next recommended document:** Technical Architecture Document  
