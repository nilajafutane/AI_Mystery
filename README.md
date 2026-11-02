# After Hours — AI Mystery Room

An interactive, AI-assisted fictional investigation. Players receive a case file, inspect suspects and evidence, keep private notes, and submit one final finding.

The app uses React, Vite, Express, MongoDB/Mongoose, and Google Gemini. The Gemini key stays on the server. A completed case keeps its culprit and explanation out of public case responses until a valid answer is submitted.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- MongoDB (local or hosted) for durable case storage
- Google Gemini API key for custom AI case generation

## Run locally

1. Copy server/.env.example to server/.env and client/.env.example to client/.env.
2. Set GEMINI_API_KEY and MONGODB_URI in server/.env. Without a Gemini key, the default DEMO_MODE=true serves a fixed, fictional sample case. Without MongoDB, the API uses in-memory demo storage; cases will not survive a server restart.
3. From the repository root, run npm install and then npm run dev. In PowerShell installations where script execution blocks npm.ps1, use npm.cmd install and npm.cmd run dev instead.
4. Open http://localhost:5173. The API health endpoint is http://localhost:5000/api/v1/health.

Set DEMO_MODE=false to return a controlled configuration error when Gemini is not configured. Set GEMINI_TEXT_MODEL to configure the Gemini model; model names are kept out of generation business logic.

Gemini case creation can take a couple of minutes for a detailed case. The browser allows up to five minutes for that request and shows a specific message if it still times out.

For production, set a strong JWT_SECRET, configure CLIENT_URL to the deployed client origin, use a managed MongoDB instance, and keep .env files out of version control.

## API

All routes use /api/v1.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | /cases/generate | Validate options, generate and persist a case |
| GET | /cases/:caseId | Return the active public case (never its solution) |
| GET | /cases/:caseId/evidence | Return the case evidence collection |
| GET | /cases/:caseId/evidence/:evidenceId | Return one evidence item |
| POST | /cases/:caseId/submit | Lock one suspect selection and create a result |
| GET | /cases/:caseId/result/:resultId | Return the authorized case resolution |
| GET, PUT | /cases/:caseId/notes | Read or save session-specific notes |
| POST, DELETE | /cases/:caseId/evidence/:evidenceId/bookmark | Add or remove a session bookmark |

The MVP identifies an anonymous investigation by a client-generated session UUID in the x-session-id header. This supports a single-player local experience; it is not an account or production authentication system.

## Implementation checklist

- [x] React landing page, case intake, investigation room, evidence viewers, verdict, and result screens
- [x] Responsive layouts, suspect profiles, evidence filters, timeline, notes, bookmarks, and submission confirmation
- [x] Express REST API, request validation, generation rate limit, CORS, and security headers
- [x] Gemini structured JSON prompt and schema validation; API key stays on the backend
- [x] Private culprit and solution fields; result is derived from the stored solution after submission
- [x] MongoDB models and an in-memory demo adapter when MongoDB is not configured
- [x] Fictional sample case for demo mode
- [ ] Run end-to-end acceptance checks with Gemini and MongoDB credentials
- [ ] Configure a production image-generation/storage provider
- [ ] Add production-grade authentication and deployment configuration

## Notes

- Demo mode uses a fixed sample case, not AI generation. Its case text is illustrative.
- Photo exhibits use configured case image URLs with a sample fallback. Image creation and Cloudinary upload are follow-up integration work; simulated CCTV is represented as a transcript viewer.
- The MVP uses a session UUID for results, notes, and bookmarks. Add real authentication before treating the service as a multi-user private-case product.
