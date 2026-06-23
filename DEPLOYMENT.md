# Deployment Checklist (Vercel)

1. **Vercel Project Settings → General → Root Directory**: LEAVE BLANK (repo root). Do NOT set it to `client`.
2. **Environment Variables** (Project Settings → Environment Variables) — add for Production AND Preview:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL` (must exactly match the deployed frontend URL, no trailing slash)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
   - `NODE_ENV=production`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (if Stripe is live)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. **After first deploy**, hit `https://<your-domain>/api/health` and confirm it returns `{ "status": "ok" }` with `dbState: 1`.
4. **After confirming `/api/health` works**, test `/api/auth/login` and `/api/products` manually before testing the UI.
