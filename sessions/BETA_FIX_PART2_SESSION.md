# BETA-FIX PART 2 — Finish Vercel Env Vars + Commit + Deploy

## Access
You have FULL ACCESS to Vercel, Railway, and Neon. Do not leave manual steps for Jamie. Make all changes yourself.

## What's Already Done
- 9/9 beta_* tables created via safe migration
- Clerk env vars updated in `.env.local`
- Admin dashboard error handling hardened
- Build script updated with `prisma generate && prisma migrate deploy && next build`
- Seed data loaded (13 session prompts, 4 announcements)
- `pnpm run build` passes with 0 errors

## What You Need To Do Now

### Step 1 — Update Vercel Environment Variables
Use the Vercel CLI to update the env vars for the beta project. You have full access.

```bash
# Install Vercel CLI if not present
npm i -g vercel

# Link to the project (if not already linked)
vercel link

# Remove the deprecated env vars
vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL production
vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL preview
vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL development
vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL production
vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL preview
vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL development

# Add the new env vars (pipe the value to avoid interactive prompt)
echo "/portal" | vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL production
echo "/portal" | vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL preview
echo "/portal" | vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL development
echo "/register" | vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL production
echo "/register" | vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL preview
echo "/register" | vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL development
```

If the Vercel CLI prompts for project selection or login, handle it. The project is beta.adaptensor.io.

**Verify the env vars are set:**
```bash
vercel env ls
```

Confirm these exist:
- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `ADMIN_USER_IDS` (should be `user_39orNzw4ePkqW1E3ow0c8ZTT3Nk`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` (new, `/portal`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` (new, `/register`)

Confirm the OLD deprecated vars are GONE:
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` — should NOT exist
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` — should NOT exist

### Step 2 — Commit
```bash
git add -A
git commit -m "fix: resolve beta dashboard 500 errors and Clerk deprecation

- Create safe database migration for 9 beta_* tables (prisma migrate, not db push)
- Rename deprecated Clerk env vars to FALLBACK_REDIRECT variants
- Harden admin dashboard with response validation and error banner
- Update build script: prisma generate + migrate deploy before next build
- Seed initial session prompts and announcements
- Update Vercel env vars via CLI"
```

### Step 3 — Push and Deploy
```bash
git push origin main
```

This should trigger Vercel auto-deploy. After push, verify the deployment starts:
```bash
vercel ls --limit 1
```

### Step 4 — Post-Deploy Verification
Wait for the deployment to complete, then verify the live site:
```bash
# Check if the endpoints respond (may need auth cookies, so just check HTTP status)
curl -s -o /dev/null -w "%{http_code}" https://beta.adaptensor.io/api/beta/features?limit=5
curl -s -o /dev/null -w "%{http_code}" https://beta.adaptensor.io/api/beta/bugs?severity=critical&status=submitted&limit=5
```

If you get 401 (auth required) that's GOOD — it means the API is running and checking auth, not crashing with 500.
If you still get 500, check the Vercel deployment logs:
```bash
vercel logs beta.adaptensor.io --limit 50
```

### Step 5 — Print Final Summary
Print:
1. Vercel env vars — what was removed, what was added
2. Git commit hash
3. Deployment status
4. Any endpoint test results

## Rules
- You have full access to Vercel, Railway, and Neon — use it
- Do NOT leave manual steps for Jamie
- Do NOT run `prisma db push` or `prisma migrate reset` — ever
- If any step fails, troubleshoot and fix it yourself
- Print a final summary when everything is complete
