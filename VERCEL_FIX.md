# 🚨 CRITICAL: Force Vercel to Deploy the CORRECT Code

## The Problem
Vercel keeps deploying OLD commits from before we fixed the jsonwebtoken issue. Your local code is 100% correct (using `jose`), but Vercel's cache is stuck.

---

## ✅ SOLUTION: Manual Vercel Project Reset

### Step 1: Delete the Vercel Project
1. Go to: https://vercel.com/appolos-projects/investpro/settings
2. Scroll to bottom → **"Delete Project"**
3. Type `investpro` to confirm
4. Click **"Delete"**

### Step 2: Re-Import from GitHub
1. Go to: https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Find **`investpro`** repository
4. Click **"Import"**

### Step 3: Configure (Same as Before)
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Root Directory**: `./`

### Step 4: Add Environment Variables
Add these 6 variables (same as before):

```
NEXT_PUBLIC_SUPABASE_URL=https://cvzojhfzldopspwsstbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=(your anon key from Supabase)
SUPABASE_SERVICE_ROLE_KEY=(your service_role key from Supabase)
JWT_SECRET=0KDkSmo3KU5aCpoFcaNfy7vbLwXq/YPUZMyO/55YttU=
NEXTAUTH_SECRET=iOXLngnhD0o17uxRrsLE/FDKQLQoWKg3Pq9FcBHVE/s=
NEXTAUTH_URL=https://investpro.vercel.app
```

### Step 5: Deploy
Click **"Deploy"**

---

## 🎯 Why This Will Work

1. **Deleting the project** clears ALL Vercel caches
2. **Fresh import** will use the LATEST commit from GitHub
3. **Latest commit** (`df79495`) has the correct code:
   - ✅ Uses `jose` library
   - ✅ No `jsonwebtoken` anywhere
   - ✅ No Twilio dependency

---

## 📋 Quick Checklist

- [ ] Delete Vercel project
- [ ] Re-import from GitHub
- [ ] Add all 6 environment variables
- [ ] Click Deploy
- [ ] Wait 2-3 minutes
- [ ] ✅ SUCCESS!

---

## 💡 Alternative: Use Vercel CLI (Advanced)

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from current directory (will create new project)
cd /home/appolo/.gemini/antigravity/scratch/investment-platform
vercel --prod

# Follow prompts to set environment variables
```

---

## 🔍 How to Verify It's Working

After deployment, check the build logs. You should see:
- ✅ NO errors about `jsonwebtoken`
- ✅ Build completes successfully
- ✅ Shows "Deployment Ready"

If you see `import jwt from 'jsonwebtoken'` in the error, **Vercel is STILL using old code** - repeat the deletion and re-import.

---

**THIS IS THE DEFINITIVE FIX** - Deleting and recreating the project forces Vercel to start completely fresh with no cached artifacts.
