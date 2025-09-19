Quick SSL / HTTPS checklist

1. Enable managed TLS for your custom domain (velision.in)
   - Netlify: Site settings → Domain management → Add custom domain → Enable HTTPS (Netlify provisions cert automatically).
   - Render: Service → Custom Domains → Add domain → enable Automatic TLS.

2. Force HTTPS
   - Netlify: enable "Enforce HTTPS" in Domain settings OR add client/public/_redirects (this repo).
   - Render: enable "Force HTTPS" in the service settings.

3. Ensure Node app handles proxy and redirects
   - app.set('trust proxy', true)
   - Redirect HTTP to HTTPS (server already includes middleware)

4. Eliminate mixed content
   - Replace any http:// asset or API URLs with https:// or relative paths.
   - In React use fetch('/api/...') or process.env.REACT_APP_API_BASE with https in production.

5. Test
   - Visit https://velision.in and verify the padlock.
   - Open browser console for Mixed Content warnings.
   - Use https://www.ssllabs.com/ssltest/ to validate certificate.

If you prefer, I can:
- Add a short grep script to find http:// occurrences in the client code.
- Provide exact Render/Netlify UI steps for your account if you tell me which host you're using.
- If you use Netlify: add domain in Domains settings, enable HTTPS, and ensure publish directory is client/build.
