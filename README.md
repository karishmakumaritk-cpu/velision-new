# velision-new
Complete HR Management solution providing online services like hiring, payroll, PF, salary processing, compliance, documentation, rewards programs and more. One HR platform for all organizational needs at the cost of a single HR.

# velision-new — quick setup

Quick local setup:
1. From dev container terminal:
   - cd /workspaces/velision-new
   - chmod +x ./setup.sh
   - ./setup.sh

2. Start servers:
   - Server: cd server && npm run dev
   - Client: cd client && npm start

Notes for CI/Netlify:
- Netlify expects a root package.json. This repo provides a root "build" script which runs the client's build: `npm run build`.
- Ensure Netlify's publish directory is set to `client/build`.

Environment:
- For local dev set SKIP_DB_ON_MISSING=true in server/.env to avoid 503 while DB is not configured.
- For production set a valid MONGO_URI in your host (Render/Netlify environment variables).
