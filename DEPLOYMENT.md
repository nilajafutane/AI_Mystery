# Deployment walkthrough

This repository is prepared for:

- **Vercel** to host the React/Vite frontend as a static site.
- **Render** to run the Express API as a long-lived Node service.
- **MongoDB Atlas** to persist cases, notes, bookmarks, and submissions.
- **Gemini API** to generate the mystery cases.

The API is intentionally a Render web service rather than a Vercel Function: case generation took over two minutes locally, and Render supports long-running HTTP responses. [Render documents a 100-minute web-service response limit](https://render.com/docs/render-vs-vercel-comparison). Vercel only serves the static frontend.

## 1. Push the project to GitHub

Render and Vercel deploy from a Git repository.

1. In your terminal, check that the repository contains the latest project files:

   ```powershell
   git status
   ```

2. Commit the deployment files and code changes, then push your branch to GitHub. Do not add either `.env` file to Git; the repository ignores them.

## 2. Create the MongoDB Atlas database

1. Create an Atlas project and a cluster. Choose a region close to the Render service; this project’s Render Blueprint uses Singapore.
2. Create a **database user** with a strong password. This is separate from your Atlas website login.
3. In **Network Access**, add the Render API’s outbound IP ranges after creating the Render service in step 3. Atlas only accepts connections from IP addresses in its project access list. [MongoDB Atlas IP access-list guide](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/).
4. In Atlas, choose **Connect → Drivers** and copy the application connection string. Replace the password placeholder, URL-encode any reserved characters in the username or password, and use a database name such as `after-hours`.

Keep this connection string private. Do not put it in a frontend environment variable.

## 3. Deploy the API on Render

The root `render.yaml` Blueprint describes the API service, health check, Node version, and required environment variables. Render supports Blueprints from a connected Git repository. [Render Blueprint setup](https://render.com/docs/infrastructure-as-code).

1. In Render, choose **New → Blueprint** and connect the GitHub repository.
2. Select the repository’s branch. Render reads `render.yaml` and creates the API web service.
3. When Render asks for values, enter:
   - `GEMINI_API_KEY`: your Gemini API key.
   - `MONGODB_URI`: the Atlas application connection string.
   - `CLIENT_URLS`: a temporary comma-separated list such as `https://your-project.vercel.app,http://localhost:5173`. Replace the Vercel placeholder with the actual deployed domain in step 5. Do not add a trailing slash.
4. Wait for Render to create the service. The first deploy may fail its health check until Atlas permits the service’s network access.
5. Open the service’s **Connect → Outbound** panel and copy the outbound IP ranges for its region. Add those ranges to Atlas **Network Access**, then redeploy the API. Render’s Atlas guide also walks through this allow-list step. [Render → Atlas connection guide](https://render.com/docs/connect-to-mongodb-atlas).
6. Copy the service’s public URL, for example `https://ai-mystery-room-api.onrender.com`.
7. Open `https://YOUR-API-URL/api/v1/health`. It should return `success: true` and `database: "connected"`.

The Blueprint sets `NODE_ENV=production` and `DEMO_MODE=false`. The server refuses to start without MongoDB and a Gemini key, and its health check returns an error if MongoDB becomes unavailable. This prevents a production deployment from quietly saving cases only in temporary memory.

## 4. Deploy the frontend on Vercel

1. In Vercel, choose **Add New → Project** and import the same GitHub repository.
2. Use these project settings:
   - **Root Directory:** repository root (`./`)
   - **Framework Preset:** Other
   - **Install Command:** `npm ci`
   - **Build Command:** `npm run build --workspace=client`
   - **Output Directory:** `client/dist`
3. Add this environment variable for **Production** (and Preview if you want preview deploys to use the API):
   - `VITE_API_URL`: `https://YOUR-API-URL/api/v1`
4. Deploy. The root `vercel.json` rewrites client-side routes such as `/case/:id` to the SPA entry point, so refreshing an investigation route works.

Vercel’s Vite SPA guidance uses a rewrite to `/index.html` for deep links. [Vercel Vite documentation](https://vercel.com/docs/frameworks/frontend/vite).

## 5. Allow the deployed frontend in API CORS

After the first Vercel deployment:

1. Copy the production Vercel domain, for example `https://your-project.vercel.app`.
2. In Render, open the API service’s **Environment** settings and set `CLIENT_URLS` to:

   ```text
   https://your-project.vercel.app,http://localhost:5173
   ```

   Include any custom production domain you use. Add a Vercel preview domain only if you intend to allow it to call this API.
3. Save and redeploy the API.

The API normalizes trailing slashes and allows only origins listed in `CLIENT_URLS`.

## 6. Verify the deployed app

1. Open the Vercel URL and create a case using a fictional scenario.
2. Generation may take a few minutes; the browser allows up to five minutes.
3. Open suspects and evidence, add a note or bookmark, and refresh the case page.
4. Submit one suspect and confirm that the result reveals the stored case solution.
5. Check Render logs and Atlas for connection errors if anything fails.

Render’s free web services spin down after 15 minutes without requests, so the first request after idle can take about a minute to wake up. [Render free service behavior](https://render.com/docs/faq).

## Environment variables

| Variable | Where | Value |
| --- | --- | --- |
| `GEMINI_API_KEY` | Render only | Secret Gemini API key |
| `GEMINI_TEXT_MODEL` | Render only | `gemini-3.8-flash` by default |
| `MONGODB_URI` | Render only | Secret Atlas connection string |
| `CLIENT_URLS` | Render only | Comma-separated allowed browser origins |
| `NODE_ENV` | Render only | `production` |
| `DEMO_MODE` | Render only | `false` |
| `VITE_API_URL` | Vercel build | Public API URL ending in `/api/v1` |

Only variables prefixed with `VITE_` are compiled into the frontend. Never put the Gemini key or MongoDB URI in Vercel.

## Current deployment limitations

- Anonymous case/session IDs are not user authentication. Anyone with a case URL can access its public case data; use real authentication before making private user cases a production promise.
- Image generation and Cloudinary uploads are not wired up yet. Photo exhibits use supplied or fallback image URLs, and CCTV is simulated as a transcript.
- Atlas and Gemini may have their own billing or quota limits; review your account’s plan before public launch.
