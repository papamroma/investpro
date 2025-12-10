# Quick Deployment Checklist

## ✅ Step 1: Git Repository (DONE)
- [x] Git initialized
- [x] All files committed
- [x] Branch renamed to 'main'

## 📝 Step 2: Create GitHub Repository

### Option A: Using GitHub Website
1. Go to https://github.com/new
2. Repository name: `investment-platform` (or your choice)
3. Description: "InvestPro - Investment Platform with Mobile Money"
4. **Important**: Leave "Initialize this repository" UNCHECKED
5. Click "Create repository"

### Option B: Using GitHub CLI (if installed)
```bash
gh repo create investment-platform --public --source=. --remote=origin --push
```

## 🔗 Step 3: Push to GitHub

After creating the repository on GitHub, run these commands:

```bash
cd /home/appolo/.gemini/antigravity/scratch/investment-platform

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/investment-platform.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## 🚀 Step 4: Deploy to Vercel

### 4.1 Sign Up / Log In
1. Go to https://vercel.com
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

### 4.2 Import Project
1. Click "Add New..." → "Project"
2. Find your `investment-platform` repository
3. Click "Import"

### 4.3 Configure Project
Vercel will auto-detect Next.js. Verify these settings:
- **Framework Preset**: Next.js
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 4.4 Add Environment Variables

Click "Environment Variables" and add these **REQUIRED** variables:

```
# Database (Get from Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Authentication (Generate random strings)
JWT_SECRET=your_random_32_character_secret_here
NEXTAUTH_SECRET=another_random_32_character_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

**Generate secrets:**
```bash
# Run this twice to get two different secrets
openssl rand -base64 32
```

**Optional variables** (add later when ready):
```
# M-Pesa
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=https://your-app.vercel.app/api/payments/mpesa/callback
MPESA_ENVIRONMENT=sandbox

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

# Twilio (for SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### 4.5 Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://investment-platform-xyz.vercel.app`

## 🎉 Step 5: Post-Deployment

### 5.1 Update NEXTAUTH_URL
1. Copy your Vercel URL
2. Go to Vercel → Settings → Environment Variables
3. Update `NEXTAUTH_URL` to your actual URL
4. Redeploy (Vercel → Deployments → ⋯ → Redeploy)

### 5.2 Test Your Deployment
1. Visit your Vercel URL
2. Click "Get Started"
3. Create a test account
4. Try logging in

## ⚠️ Important Notes

### Before You Can Use the Platform:
1. **Set up Supabase** (see BACKEND_SETUP.md)
   - Create project
   - Run database schema
   - Get API keys

2. **Add Environment Variables** to Vercel
   - At minimum: Supabase keys and JWT secrets
   - Payment gateways can be added later

3. **The platform will NOT work without Supabase!**
   - You'll get errors when trying to sign up/login
   - Set up Supabase first, then deploy

## 🔄 Making Updates

After deployment, any push to GitHub will auto-deploy:

```bash
# Make changes to your code
git add .
git commit -m "Your changes"
git push

# Vercel will automatically deploy in ~2 minutes
```

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Make sure Supabase is configured
4. Review DEPLOYMENT.md for detailed troubleshooting

---

## Current Status

✅ Git repository created
✅ All files committed
⏳ Waiting for: GitHub repository creation
⏳ Waiting for: Vercel deployment

**Next action: Create GitHub repository and push code**
