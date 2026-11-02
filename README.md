# AI Mystery Room

An interactive, AI-assisted fictional investigation. Players receive a case file, inspect suspects and evidence, keep private notes, and submit one final finding.

## Local development

Requirements: Node.js 20+ and npm.

1. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`.
2. Set `GEMINI_API_KEY` and `MONGODB_URI` in `server/.env`. Without a Gemini key, `DEMO_MODE=true` serves a fixed sample case. Without MongoDB, local development uses in-memory demo storage.
3. From the repository root, run `npm install`, then `npm run dev`. In PowerShell where script execution blocks `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev`.
4. Open `http://localhost:5173`. The API health endpoint is `http://localhost:5000/api/v1/health`.

Gemini case generation can take a couple of minutes. The browser waits up to five minutes for generation.

## Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the walkthrough. The project is configured for a Vercel static frontend and a Render Express API, with MongoDB Atlas for persistent storage.

## API

All routes use `/api/v1`.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/cases/generate` | Validate options, generate and persist a case |
| GET | `/cases/:caseId` | Return the active public case (never its solution) |
| GET | `/cases/:caseId/evidence` | Return the case evidence collection |
| GET | `/cases/:caseId/evidence/:evidenceId` | Return one evidence item |
| POST | `/cases/:caseId/submit` | Lock one suspect selection and create a result |
| GET | `/cases/:caseId/result/:resultId` | Return the authorized case resolution |
| GET, PUT | `/cases/:caseId/notes` | Read or save session-specific notes |
| POST, DELETE | `/cases/:caseId/evidence/:evidenceId/bookmark` | Add or remove a session bookmark |

The MVP identifies an anonymous investigation with a client-generated session UUID. It is designed as a single-player MVP, not an account or production authentication system.

## Implementation checklist

- [x] Responsive landing, case intake, investigation room, evidence viewers, verdict, and result screens
- [x] Suspect profiles, evidence filters, timeline, notes, bookmarks, and submission confirmation
- [x] Express REST API, request validation, generation rate limit, CORS, and security headers
- [x] Gemini structured JSON prompt and schema validation; API key stays on the backend
- [x] Private culprit and solution fields; result uses the stored solution after submission
- [x] MongoDB models and local in-memory demo adapter
- [x] Render Blueprint and Vercel SPA routing configuration
- [x] Production startup checks and readiness health endpoint
- [ ] Add production-grade account authentication
- [ ] Configure a production image-generation and storage provider
