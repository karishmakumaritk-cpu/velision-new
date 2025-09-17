# Deploy notes (Render)

Summary:
- For production set MONGO_URI in your Render service environment variables.
- If you intentionally want to run without a DB, set SKIP_DB_ON_MISSING=true (DB endpoints will return 503).

Steps:
1. Commit & push these files to your repo.
2. On Render → your Service → Environment → Environment Variables add:
   - MONGO_URI = <your-production-mongodb-connection-string>
   - (optional) SKIP_DB_ON_MISSING = true
3. Trigger a deploy (Manual Deploy or push). Render will run `npm install` and `npm start` for the server.
4. Verify logs: you should see "Server running on port ..." and no "Exiting" message.

Health endpoints:
- GET /health  → { status: "ok", dbConnected: true|false }
- GET /health/db → 200 if DB connected, 503 if unavailable

Troubleshooting:
- If the service still exits, confirm the Render environment variables are set on the correct service and branch.
- If you need a quick test without a production DB, set SKIP_DB_ON_MISSING=true on Render to allow the app to stay up (not recommended for production APIs that need persistence).
   - Share the exact startup logs if you need further help.

Example env values (do NOT commit real credentials):
- MONGO_URI = mongodb+srv://user:pass@cluster.example.mongodb.net/velision?retryWrites=true&w=majority
- SKIP_DB_ON_MISSING = true
