# AI MYSTERY ROOM
## Product Requirements Document (PRD) & Technical Specification

**Document purpose:** Single Source of Truth for AI-assisted development using Codex  
**Project type:** AI-powered interactive mystery investigation web application  
**Architecture:** MERN Stack  
**AI Provider:** Google Gemini  
**Version:** 1.0  
**Status:** Development specification

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is an AI-powered interactive mystery investigation platform where users become investigators and solve fictional crime mysteries.

The user provides a short scenario, story, or situation. Based on this input, the AI generates a complete fictional investigation containing:

- A mystery scenario.
- A set of fictional characters and suspects.
- One actual culprit.
- A detailed backstory and timeline.
- Multiple pieces of evidence.
- Fake WhatsApp conversations.
- Images and photographs.
- CCTV footage or simulated camera recordings.
- Witness statements and other investigation records.

The user investigates the case by examining the available evidence, connecting clues, identifying contradictions, and eventually selecting the person they believe is responsible.

The application then evaluates the user's answer and reveals the actual culprit, the explanation behind the mystery, and how each piece of evidence connects to the final solution.

## 1.2 Core Concept

**User input → AI-generated mystery → Evidence investigation → Culprit selection → Case resolution**

The main objective is to create an engaging detective experience where every mystery is generated dynamically rather than relying on predefined cases.

Each investigation should have a logical solution. The culprit must be decided before the user begins investigating, and the generated evidence must support that solution.

## 1.3 Project Goals

1. Allow users to create unique mystery investigations using their own story prompts.
2. Use Gemini AI to generate realistic fictional investigations.
3. Generate multiple types of supporting evidence.
4. Provide an interactive investigation interface.
5. Encourage logical reasoning and critical thinking.
6. Evaluate the user's final culprit selection.
7. Provide an explanation of the mystery after submission.
8. Make the application scalable enough to support different mystery categories and difficulty levels.

## 1.4 Target Audience

- People interested in detective stories and crime mysteries.
- Puzzle and mystery game enthusiasts.
- Students interested in logical reasoning.
- Users looking for interactive AI-generated entertainment.

---

# 2. TECHNOLOGY STACK

The application must use the MERN stack with Gemini as its AI provider.

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Language | JavaScript |
| Styling | Tailwind CSS |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| AI Integration | Google Gemini API |
| AI SDK | Google Gen AI SDK |
| Authentication | JWT (optional for MVP; see authentication section) |
| API Communication | REST API |
| State Management | React Context API |
| Routing | React Router |
| HTTP Client | Axios |
| Environment Management | dotenv |
| Validation | Zod or equivalent schema validation |
| Image Storage | Cloudinary or compatible object storage |
| Deployment | Frontend and backend deployable independently |

### Important architectural rule

The Gemini API key must only be available on the backend.

All AI requests must pass through the Express backend. The frontend must never communicate directly with Gemini using a private API key.

---

# 3. USER JOURNEY AND APPLICATION FLOW

The following is the primary application workflow.

## Step 1: Landing Page

The user visits the AI Mystery Room website.

The landing page should introduce the concept of the application and provide a clear call to action.

Primary button:

**Start Investigation**

Clicking this button takes the user to the mystery creation page.

## Step 2: Mystery Creation

The user provides information about the mystery they want to investigate.

Required input:

- Story/scenario description.

Additional configurable options:

- Mystery category.
- Difficulty level.
- Number of suspects.
- Investigation setting.

Default configuration:

- Category: General Mystery.
- Difficulty: Medium.
- Number of suspects: 4.
- Setting: AI decides based on the story.

The user clicks:

**Generate Mystery**

The frontend sends the input to the backend.

## Step 3: AI Mystery Generation

The backend sends the user's scenario to Gemini.

Gemini generates a complete investigation in structured JSON format.

The generated investigation must contain:

1. Case title.
2. Case ID.
3. Introduction.
4. Crime or mystery description.
5. Location and time.
6. Character profiles.
7. Suspect list.
8. Actual culprit.
9. Motive.
10. Investigation timeline.
11. Evidence list.
12. Individual evidence details.
13. Hidden clues.
14. Final explanation.
15. Correct solution.

The backend validates the generated response before saving it to MongoDB.

The actual culprit and solution must remain hidden from the frontend during the investigation.

## Step 4: Investigation Room

After successful generation, the user enters the investigation interface.

This is the application's main gameplay screen.

The investigation room should contain:

**A. Case Overview**

- Case title.
- Case description.
- Crime location.
- Date and time.
- Case status.
- Short introductory briefing.

**B. Suspect Board**

Display all suspects as individual cards.

Each suspect card contains:

- Name.
- Profile image or avatar.
- Age (fictional).
- Occupation.
- Relationship to the case.
- Short description.
- Initial alibi.

Clicking a suspect opens their detailed profile.

**C. Evidence Room**

All generated evidence must be displayed in an organized interface.

Evidence categories:

1. Digital Messages.
2. Photographic Evidence.
3. CCTV Recordings.
4. Witness Statements.
5. Documents and Reports.

The user can open individual evidence items and examine them.

**D. Investigation Timeline**

Display important events chronologically.

The timeline should help users compare:

- Suspect statements.
- Recorded events.
- Message timestamps.
- Crime time.
- Evidence timestamps.

**E. Investigation Actions**

The user should be able to:

- Open and inspect evidence.
- View suspect profiles.
- Review the timeline.
- Mark evidence as important.
- Add personal investigation notes.
- Navigate between evidence categories.

For MVP, users should not be able to modify the original evidence.

## Step 5: Select the Culprit

Once the user has examined the available evidence, they can proceed to the final decision.

Display the question:

**Who do you think is responsible?**

Show all suspects as selectable options.

The user selects one suspect and clicks:

**Submit Investigation**

Before submission, show a confirmation message.

Once submitted, the answer must be locked.

The backend compares the selected suspect ID with the actual culprit ID stored in the investigation.

## Step 6: Case Resolution

After submission, display the investigation result.

If the user selects the correct culprit:

- Display a successful investigation message.
- Reveal the actual culprit.
- Explain the motive.
- Explain how the mystery happened.
- Show the decisive clues.
- Explain how the evidence connects to the culprit.

If the user selects the wrong culprit:

- Display an unsuccessful investigation message.
- Reveal the actual culprit.
- Explain why the selected suspect was incorrect.
- Explain the evidence that points towards the actual culprit.

The application should also display a complete case explanation.

**Important:** The solution must be generated and saved during initial case creation. Do not ask Gemini to independently decide the culprit again after the user submits an answer.

---

# 4. FUNCTIONAL REQUIREMENTS

## FR-01: Landing Page

The application must provide a visually appealing landing page.

Required elements:

- Application logo/name.
- Navigation bar.
- Hero section.
- Short application description.
- Start Investigation button.
- How It Works section.
- Footer.

The landing page should establish a dark detective/investigation atmosphere.

## FR-02: Mystery Creation

The application must accept a user-provided scenario.

Requirements:

- Multiline text input.
- Input validation.
- Character limit.
- Category selection.
- Difficulty selection.
- Suspect count selection.
- Generate button.
- Loading state while AI generates the case.
- Error handling if generation fails.

Recommended limits:

- Scenario minimum: 30 characters.
- Scenario maximum: 2,000 characters.
- Suspects: 3–6.
- Difficulty: Easy, Medium, Hard.

## FR-03: AI Mystery Generation

Gemini must generate a complete fictional mystery based on the user's scenario.

Requirements:

- Generate a unique case.
- Generate fictional characters.
- Establish one actual culprit.
- Create a logical motive.
- Generate a consistent investigation timeline.
- Generate evidence supporting the mystery.
- Include misleading but fair clues.
- Ensure that all evidence is logically consistent.
- Generate a final explanation.

The AI must not generate evidence that contradicts the established solution.

## FR-04: Evidence Generation

The application must support multiple evidence types.

### Evidence Type A: WhatsApp Messages

Generate fictional WhatsApp-style conversations.

Each conversation should contain:

- Sender name.
- Receiver name or group name.
- Message content.
- Timestamp.
- Message sequence.
- Relevant conversation context.

The interface should resemble a messaging application.

Messages may contain important clues, suspicious statements, deleted-message indicators, or contradictions.

All messages must be fictional.

### Evidence Type B: Photographic Evidence

Generate fictional photographs relevant to the investigation.

Examples:

- Crime scene photographs.
- Photographs of objects.
- Photographs of locations.
- Photographs containing hidden clues.
- Photographs of relevant events.

Each photograph should have:

- Evidence ID.
- Title.
- Description.
- Capture timestamp (if applicable).
- Image URL.
- Investigation relevance.

Image generation should use a configurable image-generation provider.

Gemini should determine what image needs to be generated and provide a detailed image-generation prompt.

If the configured Gemini model does not support image generation, use a separate compatible image-generation provider.

### Evidence Type C: CCTV Recordings

CCTV evidence should simulate a security camera investigation.

Each recording should contain:

- Camera ID.
- Camera location.
- Recording date.
- Recording time.
- Duration.
- Recording description.
- Important timestamps.
- Observed events.
- Clues.

For the MVP, CCTV footage can be implemented using generated still frames, a simulated CCTV video assembled from those frames, or a video-style evidence viewer with timestamps and a generated event transcript.

Actual video generation is a separate capability and must not be assumed to be available through every Gemini model.

The interface should resemble a surveillance recording:

- Dark video frame.
- Camera identifier.
- Date and timestamp overlay.
- REC indicator.
- Playback controls where actual playable media exists.
- Event markers.

### Evidence Type D: Witness Statements

Generate statements from fictional witnesses.

Each statement should contain:

- Witness name.
- Relationship to the case.
- Statement.
- Date and time.
- Important observations.
- Potential inconsistencies.

### Evidence Type E: Documents and Reports

Examples:

- Police investigation reports.
- Medical reports.
- Entry and exit records.
- Receipts.
- Letters.
- Security logs.
- Incident reports.

Each document should have a title, content, date, and relevant clues.

## FR-05: Suspect Management

Each mystery should have 3–6 suspects.

Every suspect must have:

- Unique ID.
- Full name.
- Age.
- Occupation.
- Profile description.
- Relationship to the victim or incident.
- Initial alibi.
- Possible motive.
- Personality description.
- Profile image or avatar.

The actual culprit must be included in the suspect list.

Every suspect should have a believable background.

The actual culprit must not be visually identified as the culprit before case submission.

## FR-06: Investigation Interface

The user must be able to explore all evidence.

Required functionality:

- Evidence category navigation.
- Evidence cards.
- Evidence detail view.
- Suspect detail view.
- Timeline.
- Personal notes.
- Mark/unmark important evidence.
- Back-to-case navigation.

Investigation progress should be retained when the user navigates between sections.

## FR-07: Culprit Selection

Requirements:

- Display all suspects.
- Allow only one suspect selection.
- Provide a submit confirmation.
- Prevent multiple submissions.
- Save the submitted answer.
- Compare the answer against the stored culprit ID.

## FR-08: Results and Explanation

The result page must contain:

- Investigation outcome.
- User's selected suspect.
- Actual culprit.
- Motive.
- Explanation of the mystery.
- Important evidence.
- Explanation of misleading clues.
- Final chronological reconstruction.

The explanation must be based on the original saved mystery solution.

---

# 5. AI GENERATION ARCHITECTURE

This is one of the most important sections of the project.

Gemini should act as the investigation designer and storyteller.

It should not simply generate random suspects and unrelated evidence.

The mystery must be generated as one logically connected investigation.

## 5.1 Generation Strategy

Use a structured multi-stage generation process.

### Stage 1: Mystery Blueprint

Gemini generates the internal investigation blueprint.

This includes:

- Actual culprit.
- Motive.
- Opportunity.
- Method.
- Crime timeline.
- Suspect relationships.
- Suspect alibis.
- Actual sequence of events.
- Key clues.
- Misleading clues.
- Final solution.

This is the foundation of the investigation.

### Stage 2: Suspect Generation

Generate detailed profiles for each suspect.

Every suspect should have:

- A believable reason to be investigated.
- A possible motive or suspicious connection.
- An alibi.
- A relationship to the incident.

The culprit must have a stronger evidence-based connection to the mystery, but their identity must not be obvious.

### Stage 3: Evidence Generation

Generate all evidence using the established mystery blueprint.

Examples:

- WhatsApp conversations must reflect the established timeline.
- CCTV observations must match the actual events.
- Witness statements must match the characters' knowledge.
- Photographs must correspond to the described locations and objects.
- Documents must support or challenge specific statements.

### Stage 4: Consistency Validation

Run a separate validation step.

Gemini should check:

1. Is there exactly one culprit?
2. Does the culprit have a believable motive?
3. Is the timeline consistent?
4. Does the evidence support the final solution?
5. Are the suspects distinguishable?
6. Are there enough clues to identify the culprit?
7. Are misleading clues fair rather than arbitrary?
8. Does any evidence directly contradict the established truth?

If validation fails, regenerate or repair the inconsistent sections.

### Stage 5: Save Investigation

Once validated:

- Save the mystery blueprint.
- Save the suspect profiles.
- Save the evidence.
- Save the solution.
- Save generation metadata.

The investigation should remain unchanged after it is created.

## 5.2 AI Prompt Requirements

All Gemini prompts must be stored in a dedicated backend prompts directory.

The main generation prompt must instruct Gemini:

"You are an expert mystery writer and investigation designer. Your responsibility is to create an engaging, logically consistent, fictional detective investigation based on the scenario provided by the user.

Create one actual culprit and a complete explanation of the mystery before generating any evidence.

All suspects must have believable backgrounds, motives or suspicious circumstances. Generate realistic supporting evidence such as digital conversations, CCTV observations, photographs, witness statements and official documents.

Every piece of evidence must belong to the same fictional world and follow the established investigation timeline.

Include meaningful clues that allow a careful investigator to identify the actual culprit. Include misleading clues, but never make the final solution depend on information that was never available to the user.

Do not reveal the actual culprit in the case introduction, suspect descriptions, or publicly visible evidence titles.

Return structured JSON following the required schema. Do not return Markdown or additional explanatory text."

The prompt must also include the selected difficulty and suspect count.

## 5.3 Structured Output

Gemini must return JSON rather than free-form text.

Use structured output capabilities or validate the response using Zod.

Example response structure:

```json
{
  "case": {
    "title": "The Midnight Disappearance",
    "description": "A mysterious incident...",
    "category": "Murder Mystery",
    "difficulty": "Medium",
    "location": "Fictional location",
    "incidentDate": "2026-10-20T22:00:00Z"
  },
  "suspects": [],
  "timeline": [],
  "evidence": [],
  "solution": {
    "culpritId": "suspect_02",
    "motive": "Personal revenge",
    "method": "Detailed explanation",
    "fullExplanation": "Complete solution...",
    "decisiveClues": []
  }
}
```

This is an illustrative structure. The final schema must be comprehensive and version-controlled.

## 5.4 AI Model Configuration

Do not hardcode model names throughout the application.

Store model configuration in environment variables.

Example:

GEMINI_API_KEY=your_api_key

GEMINI_TEXT_MODEL=your_supported_text_model

GEMINI_IMAGE_MODEL=your_supported_image_model

IMAGE_PROVIDER=gemini

The exact model identifiers must be selected based on current API availability and capabilities.

---

# 6. DATABASE DESIGN — MONGODB

Use MongoDB with Mongoose.

The following collections are required.

## 6.1 Users Collection

Authentication is optional for the initial MVP.

If authentication is implemented, store:

```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "passwordHash": "string",
  "createdAt": "Date"
}
```

Never store plaintext passwords.

## 6.2 Cases Collection

Stores the main mystery investigation.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId or null",
  "caseCode": "CASE-001",
  "title": "The Midnight Disappearance",
  "description": "Case introduction",
  "category": "General Mystery",
  "difficulty": "Medium",
  "location": "Fictional location",
  "incidentDate": "Date",
  "status": "active",
  "generationStatus": "completed",
  "suspects": [],
  "timeline": [],
  "evidence": [],
  "solution": {
    "culpritId": "suspect_02",
    "motive": "string",
    "method": "string",
    "fullExplanation": "string",
    "decisiveClues": []
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

The solution field must never be returned through public case APIs.

## 6.3 Evidence Collection

Evidence can initially be embedded inside the Cases collection for simpler retrieval.

However, if the application grows, it should be migrated into a separate Evidence collection.

Evidence structure:

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "evidenceCode": "EV-001",
  "type": "whatsapp",
  "title": "Suspicious Conversation",
  "description": "A conversation between two suspects",
  "content": {},
  "mediaUrl": null,
  "timestamp": "Date",
  "relevance": "high",
  "isUnlocked": true
}
```

Supported evidence types:

- whatsapp
- image
- cctv
- witness
- document

The `relevance` field is internal and must not be exposed to the player.

## 6.4 Investigation Submissions Collection

Stores the user's investigation results.

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "userId": "ObjectId or null",
  "selectedSuspectId": "suspect_02",
  "isCorrect": true,
  "submittedAt": "Date"
}
```

For anonymous MVP users, use a secure session identifier rather than relying on an arbitrary user-provided ID.

## 6.5 Investigation Notes

Stores user-created notes.

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "userId": "ObjectId or null",
  "notes": "My investigation notes...",
  "markedEvidenceIds": [],
  "updatedAt": "Date"
}
```

For anonymous users, associate notes with the appropriate secure session.

---

# 7. BACKEND ARCHITECTURE

Use a modular Express.js architecture.

Recommended folder structure:

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── gemini.js
│   │
│   ├── controllers/
│   │   ├── caseController.js
│   │   ├── evidenceController.js
│   │   └── investigationController.js
│   │
│   ├── models/
│   │   ├── Case.js
│   │   ├── User.js
│   │   ├── Submission.js
│   │   └── InvestigationNotes.js
│   │
│   ├── routes/
│   │   ├── caseRoutes.js
│   │   ├── evidenceRoutes.js
│   │   └── investigationRoutes.js
│   │
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── mysteryGenerator.js
│   │   ├── evidenceGenerator.js
│   │   ├── imageService.js
│   │   └── validationService.js
│   │
│   ├── prompts/
│   │   ├── mysteryPrompt.js
│   │   ├── suspectPrompt.js
│   │   ├── evidencePrompt.js
│   │   └── validationPrompt.js
│   │
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── rateLimitMiddleware.js
│   │
│   ├── validators/
│   │   ├── caseValidator.js
│   │   └── submissionValidator.js
│   │
│   ├── utils/
│   │   ├── responseHandler.js
│   │   └── generateCaseCode.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
└── README.md
```

### Backend Responsibilities

The backend is responsible for:

1. Receiving scenario input.
2. Validating user input.
3. Communicating with Gemini.
4. Generating the mystery blueprint.
5. Generating evidence.
6. Validating consistency.
7. Saving the complete case.
8. Serving public investigation data.
9. Protecting the actual solution.
10. Evaluating culprit submissions.
11. Saving investigation notes.
12. Managing media URLs.

Controllers should handle HTTP requests and responses.

Business logic should remain inside services.

Do not put Gemini generation logic directly inside route handlers.

---

# 8. REST API SPECIFICATION

Base URL:

`/api/v1`

## Case APIs

### POST /cases/generate

Creates a new AI-generated mystery.

Request:

```json
{
  "scenario": "A businessman disappears from his locked office...",
  "category": "General Mystery",
  "difficulty": "Medium",
  "suspectCount": 4
}
```

Response:

```json
{
  "success": true,
  "caseId": "case_id",
  "status": "completed"
}
```

The solution must not be included in the response.

### GET /cases/:caseId

Fetches public case information.

Returns:

- Case introduction.
- Suspects.
- Timeline.
- Evidence metadata.
- Investigation status.

Must exclude:

- Actual culprit.
- Motive if it reveals the solution.
- Internal relevance scores.
- Hidden clues or solution annotations.
- Final explanation.

### GET /cases/:caseId/evidence

Fetches the evidence available to the investigator.

### GET /cases/:caseId/evidence/:evidenceId

Fetches an individual evidence item.

Must not expose internal AI annotations or solution-related metadata.

## Investigation APIs

### POST /cases/:caseId/submit

Submits the user's selected culprit.

Request:

```json
{
  "selectedSuspectId": "suspect_02"
}
```

Response:

```json
{
  "success": true,
  "isCorrect": true,
  "resultId": "result_id"
}
```

Do not return the full solution through this endpoint before the submission has been accepted and the user is authorized to view the result.

### GET /cases/:caseId/result/:resultId

Returns the final result and explanation for an authorized submission.

### PUT /cases/:caseId/notes

Saves or updates investigation notes.

### GET /cases/:caseId/notes

Fetches saved investigation notes.

### POST /cases/:caseId/evidence/:evidenceId/bookmark

Marks evidence as important.

### DELETE /cases/:caseId/evidence/:evidenceId/bookmark

Removes an evidence bookmark.

All endpoints must return consistent JSON responses and appropriate HTTP status codes.

---

# 9. FRONTEND ARCHITECTURE

Recommended folder structure:

```text
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SuspectCard.jsx
│   │   ├── EvidenceCard.jsx
│   │   ├── Timeline.jsx
│   │   ├── WhatsAppViewer.jsx
│   │   ├── CCTVViewer.jsx
│   │   ├── ImageViewer.jsx
│   │   ├── DocumentViewer.jsx
│   │   └── LoadingScreen.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CreateMystery.jsx
│   │   ├── InvestigationRoom.jsx
│   │   ├── SuspectDetails.jsx
│   │   ├── EvidenceDetails.jsx
│   │   ├── SubmitInvestigation.jsx
│   │   └── CaseResult.jsx
│   │
│   ├── context/
│   │   └── InvestigationContext.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── hooks/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── README.md
```

## Frontend Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/create` | Create a mystery |
| `/investigation/:caseId` | Main investigation room |
| `/investigation/:caseId/suspects/:suspectId` | Suspect details |
| `/investigation/:caseId/evidence/:evidenceId` | Evidence details |
| `/investigation/:caseId/submit` | Culprit selection |
| `/investigation/:caseId/result/:resultId` | Final result |

## Frontend Design Requirements

The website should have a professional detective investigation aesthetic.

### Visual Direction

- Dark-themed interface.
- Charcoal and deep navy backgrounds.
- Muted grey text.
- Red accents for alerts and suspicious activity.
- Amber accents for important clues.
- Clean typography.
- Subtle animations.
- Card-based investigation layout.
- Responsive design.

The interface should feel like a detective's investigation workstation rather than a conventional form-based website.

### Design Principles

1. Prioritize readability.
2. Keep evidence organized.
3. Make navigation intuitive.
4. Avoid unnecessary animations.
5. Clearly distinguish suspects, evidence, and case information.
6. Maintain consistent spacing, typography, and colors.
7. Ensure mobile and desktop compatibility.

---

# 10. INVESTIGATION GAME LOGIC

The game must be fair and logically solvable.

## 10.1 Culprit Assignment

The culprit must be selected during the mystery blueprint generation stage.

The culprit ID must remain constant throughout the investigation.

No subsequent evidence-generation step should change the culprit.

## 10.2 Evidence Distribution

The generated investigation should contain a combination of:

- Direct clues.
- Indirect clues.
- Contradictory statements.
- Misleading clues.
- Supporting evidence.

Not every evidence item should directly reveal the culprit.

## 10.3 Difficulty Levels

**Easy**

- 3 suspects.
- Clearer clues.
- Short investigation timeline.
- Fewer misleading clues.
- Stronger connections between evidence and culprit.

**Medium**

- 4 suspects by default.
- Multiple evidence types.
- Some contradictory statements.
- Moderate number of misleading clues.
- Requires connecting multiple pieces of evidence.

**Hard**

- 5–6 suspects.
- More complex relationships.
- Multiple overlapping timelines.
- Subtle contradictions.
- More indirect clues.
- Requires careful examination of evidence.

Difficulty must affect the actual investigation complexity, not merely the label displayed on the screen.

## 10.4 Case State Management

Supported case statuses:

- generating
- active
- submitted
- completed
- failed

The application must prevent users from submitting multiple final answers for the same investigation.

For the MVP, one final answer per investigation session is sufficient.

---

# 11. SECURITY AND DATA PROTECTION

The following requirements are mandatory.

1. Gemini API keys must never be exposed to the frontend.
2. MongoDB credentials must remain in environment variables.
3. Validate all user inputs on the backend.
4. Validate all Gemini-generated JSON before saving it.
5. Sanitize user-provided text.
6. Implement rate limiting on mystery generation endpoints.
7. Prevent users from accessing hidden solution data through API responses.
8. Validate case and suspect IDs before processing submissions.
9. Restrict access to private investigation notes and results.
10. Do not trust any culprit ID or solution information supplied by the frontend.
11. Store generated media using controlled storage permissions.
12. Handle AI API failures and timeouts gracefully.

All scenarios, characters, messages, images, and investigation records must be clearly fictional.

The system must not generate or present fabricated evidence as real-world police evidence.

---

# 12. ERROR HANDLING

The application must handle the following situations:

| Situation | Expected Behaviour |
|---|---|
| Empty scenario | Show validation error |
| Scenario too short | Ask user to provide more details |
| Gemini API unavailable | Display generation failure message |
| Invalid AI JSON | Retry or return controlled error |
| Inconsistent mystery | Attempt repair or regenerate |
| Image generation failure | Use a placeholder or retry |
| CCTV video unavailable | Display simulated recording/transcript |
| Case not found | Show 404 page |
| Invalid suspect ID | Reject submission |
| Duplicate submission | Reject subsequent submission |
| Database unavailable | Display service error |
| Network failure | Show retry option |

The user should never see raw API errors, API keys, database errors, or internal stack traces.

---

# 13. PERFORMANCE AND SCALABILITY

Requirements:

- Keep frontend and backend independently deployable.
- Use pagination or lazy loading if evidence becomes large.
- Avoid regenerating an investigation when the user refreshes the page.
- Save generated cases in MongoDB.
- Store media externally rather than storing large binary files directly in MongoDB.
- Cache appropriate public case data.
- Implement request timeouts.
- Use asynchronous generation workflows if generation becomes lengthy.
- Keep AI model configuration separate from business logic.

For the MVP, synchronous case generation with clear loading feedback is acceptable if it completes within practical API limits.

If generation takes longer, use a background job or polling-based workflow.

---

# 14. ENVIRONMENT VARIABLES

Backend `.env.example`:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key
GEMINI_TEXT_MODEL=your_text_model
GEMINI_IMAGE_MODEL=your_image_model

IMAGE_PROVIDER=gemini

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173

JWT_SECRET=your_secret
```

Frontend `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Optional environment variables should only be required when the corresponding functionality is enabled.

---

# 15. MVP DEVELOPMENT SCOPE

The first version should focus on delivering a complete working investigation experience.

## Must Have

- Landing page.
- Mystery creation form.
- Gemini integration.
- Structured mystery generation.
- One fixed culprit per case.
- 3–6 suspects.
- WhatsApp-style evidence.
- Image evidence.
- CCTV-style evidence viewer.
- Witness statements.
- Investigation room.
- Suspect profiles.
- Evidence viewer.
- Investigation timeline.
- Culprit selection.
- Result page.
- Final mystery explanation.
- MongoDB persistence.
- API security and validation.
- Responsive design.

## Should Have

- Investigation notes.
- Evidence bookmarking.
- Case history.
- Anonymous session persistence.
- Difficulty selection.
- Case categories.
- Improved AI consistency validation.

## Future Enhancements

These features should not delay the MVP.

- User registration and login.
- User profiles.
- Leaderboards.
- Investigation scoring.
- Multiple attempts.
- Multiplayer investigations.
- Time-limited investigations.
- AI-generated playable CCTV videos.
- Voice-based interrogation.
- Interactive suspect questioning.
- AI-generated police reports.
- More advanced investigation analytics.

---

# 16. DEVELOPMENT PHASES

Codex should implement the project in the following order.

### Phase 1: Project Setup

- Initialize React frontend.
- Initialize Express backend.
- Configure MongoDB.
- Configure Tailwind CSS.
- Configure frontend routing.
- Set up environment variables.
- Establish frontend-backend connectivity.

**Deliverable:** Working MERN application skeleton.

### Phase 2: Frontend UI

Build:

- Landing page.
- Mystery creation page.
- Investigation room layout.
- Suspect cards.
- Evidence cards.
- Evidence viewers.
- Culprit selection page.
- Result page.

Use mock data initially.

**Deliverable:** Fully navigable frontend with mock investigation data.

### Phase 3: Gemini Integration

- Configure Gemini SDK.
- Implement mystery blueprint generation.
- Implement suspect generation.
- Implement evidence generation.
- Implement structured JSON validation.
- Implement consistency validation.

**Deliverable:** Gemini generates a complete investigation.

### Phase 4: Database Integration

- Implement Mongoose models.
- Save generated cases.
- Retrieve investigation data.
- Save user notes.
- Save submissions.
- Store final results.

**Deliverable:** Persistent investigation system.

### Phase 5: Evidence Media

- Implement WhatsApp viewer.
- Integrate image generation.
- Implement CCTV-style viewer.
- Implement document viewer.
- Connect evidence metadata and media URLs.

**Deliverable:** Interactive evidence investigation system.

### Phase 6: Game Logic

- Implement suspect selection.
- Implement final answer submission.
- Compare selected and actual culprit.
- Implement result generation from stored solution.
- Protect the solution before submission.

**Deliverable:** Complete playable mystery experience.

### Phase 7: Testing and Optimization

- Test complete user journey.
- Test AI-generated cases.
- Check evidence consistency.
- Test API security.
- Test database persistence.
- Test mobile responsiveness.
- Test error handling.
- Optimize loading and rendering.

**Deliverable:** Stable MVP ready for deployment.

---

# 17. ACCEPTANCE CRITERIA

The project will be considered MVP-complete only when the following conditions are satisfied.

### Mystery Generation

- [ ] User can submit a custom scenario.
- [ ] Gemini generates a complete mystery.
- [ ] Each case has one actual culprit.
- [ ] Each case has at least three suspects.
- [ ] Every suspect has a profile.
- [ ] Every case contains multiple evidence types.
- [ ] Evidence is consistent with the investigation timeline.
- [ ] The mystery has a logically explainable solution.

### Investigation Experience

- [ ] User can enter the investigation room.
- [ ] All suspects are visible.
- [ ] User can examine individual suspects.
- [ ] User can open and examine evidence.
- [ ] WhatsApp messages are displayed in a conversation format.
- [ ] Images are displayed correctly.
- [ ] CCTV evidence is viewable in the simulated recording interface.
- [ ] Timeline is accessible.
- [ ] Investigation progress is preserved.

### Submission and Results

- [ ] User can select one suspect.
- [ ] User can submit their answer.
- [ ] Backend checks the answer against the stored culprit ID.
- [ ] User cannot submit multiple answers.
- [ ] Correct and incorrect answers are handled appropriately.
- [ ] Actual culprit is revealed after submission.
- [ ] Final explanation correctly matches the original mystery.

### Security and Stability

- [ ] Gemini credentials are not exposed.
- [ ] Solution is not available through public case APIs.
- [ ] Invalid input is rejected.
- [ ] AI generation failures are handled.
- [ ] Cases persist after refresh.
- [ ] Application works on desktop and mobile.

---

# 18. NON-NEGOTIABLE DEVELOPMENT RULES FOR CODEX

These rules must be followed throughout development.

1. This document is the single source of truth for project requirements.
2. Use the MERN stack and Gemini integration as specified.
3. Do not replace the technology stack without explicit approval.
4. Follow the defined folder structure and modular architecture.
5. Keep controllers, services, models, routes, and prompts separate.
6. Do not hardcode API keys or credentials.
7. Do not expose the actual culprit or final solution before submission.
8. Generate the complete mystery solution before presenting the investigation to the user.
9. All evidence must be consistent with the established mystery blueprint.
10. Do not use random mock evidence in the final integrated application.
11. Mock data is acceptable during initial frontend development.
12. Do not use placeholder buttons that have no functionality in completed features.
13. Do not regenerate cases when users refresh the investigation page.
14. Validate Gemini responses before saving them.
15. Do not silently ignore errors.
16. Maintain responsive design.
17. Do not implement future enhancements before completing the MVP.
18. Update the README whenever setup instructions, dependencies, or environment configuration change.
19. Maintain an implementation checklist and mark completed features.
20. If a requirement is ambiguous, choose the simplest implementation consistent with this document and record the decision rather than introducing unnecessary complexity.

### Requirement Change Management

If the project requirements change:

- Update this document first.
- Identify affected frontend components, backend services, APIs, and database models.
- Implement changes consistently across the application.
- Update relevant tests and acceptance criteria.
- Do not maintain conflicting versions of the same requirement in different files.

---

# 19. DEFINITION OF DONE

The project is complete when a user can:

1. Open AI Mystery Room.
2. Enter any reasonable fictional mystery scenario.
3. Generate a complete investigation using Gemini.
4. Explore multiple suspects.
5. Examine AI-generated evidence, including conversations, photographs, and simulated CCTV recordings.
6. Connect clues and investigate the case.
7. Select the suspected culprit.
8. Submit the final answer.
9. Discover whether their answer was correct.
10. Read the complete explanation of the mystery.

**The most important success criterion is that the mystery must feel like a real investigation experience, not just an AI-generated story followed by a random guessing game.**

Every case must have a predetermined truth, consistent evidence, meaningful clues, and a defensible final solution.

---

**END OF SPECIFICATION**

Document Version: 1.0  
Project: AI Mystery Room  
Technology: MERN + Gemini  
Purpose: Primary development reference for Codex