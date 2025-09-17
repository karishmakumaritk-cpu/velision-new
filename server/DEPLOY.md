# Deploy notes (Render)

1. Add production DB connection:
   - In the Render dashboard → your service → Environment → Environment Variables:
     - Key: MONGO_URI
       Value: mongodb+srv://<user>:<pass>@cluster.example.mongodb.net/velision?retryWrites=true&w=majority
       (MUST start with `mongodb://` or `mongodb+srv://`)
     - Optional (only if you intentionally run without DB): SKIP_DB_ON_MISSING = true

2. Ensure .env is not committed:
   - Keep secrets in Render env vars, not in repo.

3. Commit & push local repo changes (example):
   - git add -A
   - git commit -m "Add deploy docs and .env.example"
   - git push

4. Redeploy:
   - Trigger Manual Deploy or push a new commit to the watched branch.

5. Verify:
   - Check service logs for either:
     - "MongoDB connected"  (good)
     - or the sanitized "Invalid MONGO_URI" message (fix the env)
   - Test endpoints:
     - GET /health       -> { status: "ok", dbConnected: true|false }
     - GET /health/db    -> 200 if DB connected, 503 if not
     - DB API endpoints (e.g. /api/users) -> 503 until DB is available

6. Troubleshooting:
   - If you see "Invalid MONGO_URI scheme" — remove surrounding quotes and ensure the value begins with mongodb:// or mongodb+srv://.
   - If you want service to stay up without DB, set SKIP_DB_ON_MISSING=true (not recommended for DB-backed APIs).
