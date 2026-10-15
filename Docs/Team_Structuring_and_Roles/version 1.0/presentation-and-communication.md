# Department Tasks: Presentation and Communication

**Document ID:** TASK-004
**Version:** 0.1
**Status:** Draft for Team Review
**Members:** Mphatso, Richard
**Department Lead:** to be confirmed by Tamanga (proposed: Mphatso for UI/UX and frontend, Richard for communication and testing)
**Parent Documents:** UX-001, PROD-002, TASK-001

---

## 1. Mission

Make the product usable and honestly presented. This department designs and builds the web interface described in UX-001, tests it with real users, and makes sure every demo, pitch, and public description matches what is actually implemented, with no official endorsement implied.

## 2. Architecture Components Owned

Presentation Layer (Home and Ask, Answer View, Legal Sources and Source Details, Report Issue, About and Limitations); user-facing copy; demo and pitch materials.

## 3. Task List

| ID | Task | Priority | Owner | Support | Output | Done when |
|---|---|---|---|---|---|---|
| PC-01 | Wireframes for Home, Question and Answer, Legal Source Details, Penalty Information, and the error states (UX-001 section 18) | P0 | Mphatso | Richard | Wireframes (H5) | Tamanga has approved them |
| PC-02 | Define navigation and reusable components: Home, Ask a Question, How It Works, Legal Sources, About and Limitations | P0 | Mphatso | | Component list | Matches UX-001 section 5; no non-working feature appears |
| PC-03 | Build the responsive web frontend and connect it to the backend API | P0 | Mphatso | Vitumbiko | Working web app | A question can be asked and answered with citations on desktop and phone |
| PC-04 | Render every response state: sufficient, insufficient, conflicting, outdated, ambiguous, technical failure, unverified payment channel | P0 | Mphatso | Valentino for payload | State screens | Each state shows the UX-001 section 9 message and never a made-up answer |
| PC-05 | Build citation display and source detail view; links open the real source | P0 | Mphatso | Bizwell for source data | Source UI | Citations are tappable on mobile; unverified sources are labelled |
| PC-06 | Build the report form: incorrect answer, missing citation, outdated provision, wrong penalty, broken link, technical problem | P0 | Mphatso | Vitumbiko | Report UI | Report sends answer reference with no unnecessary personal data |
| PC-07 | Accessibility and mobile checks: headings, labels, contrast, keyboard navigation, screen reader basics, enlarged text | P0 | Mphatso | Richard | Checklist result | UX-001 section 11.3 items pass |
| PC-08 | Write the copy deck: introduction, disclaimer, all limitation messages, About and Limitations, How It Works | P0 | Richard | Mphatso, Tamanga | Copy deck (H7) | Copy reviewed for no implied government endorsement and no promise of payment processing |
| PC-09 | Plan and run usability testing with representative users, including at least one non-technical driver | P0 | Richard | Mphatso | Test notes and issue list | Findings logged; severe usability issues fixed or assigned |
| PC-10 | Prepare the demo script and pitch using only features that are implemented | P0 | Richard | Tamanga | Script and slides | Every claim on every slide maps to a working feature or is labelled "future" |
| PC-11 | Collect and relay user feedback to Research and Data and Engineering | P1 | Richard | | Feedback log | Feedback routed within the team's agreed turnaround |
| PC-12 | Prepare a short privacy notice draft in plain language | P1 | Richard | Vitumbiko | Notice draft | Matches what the system actually collects |

## 4. Inputs Needed From Others

- From AI and Backend: API response contract (H4), working endpoints.
- From Research and Data: source register and official links register (H3), including which links are verified.
- From Tamanga: language decision, whether sources open in a new tab, whether users can copy or download answers (UX-001 section 17).

## 5. Outputs Others Depend On

- H5 wireframes (to Tamanga and Vitumbiko)
- H7 copy deck (to Mphatso, and used by Valentino for message consistency)
- Usability findings (to everyone, Stage 4)

## 6. Rules for This Department

1. Do not design to look like an official government portal.
2. Do not show a feature that is not backed by working, verified data.
3. Warnings must not rely on colour alone.
4. Never present an AI explanation as an official notice or ruling.
