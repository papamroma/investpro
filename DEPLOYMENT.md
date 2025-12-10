# Deployment Guide - InvestPro Platform

## Prerequisites

Before deploying, ensure you have:
- ✅ Supabase project set up with database schema
- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ Payment gateway accounts (optional for testing)

---

## Step 1: Prepare for Deployment

### 1.1 Initialize Git Repository

```bash
cd /home/appolo/.gemini/antigravity/scratch/investment-platform

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - InvestPro platform"
```

### 1.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `investment-platform` (or your choice)
3. Don't initialize with README (we already have one)

### 1.3 Push to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/investment-platform.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 2.2 Configure Build Settings

Vercel should auto-detect these, but verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.3 Add Environment Variables

Click "Environment Variables" and add ALL of these:

#### Database (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Authentication (Required)
```
JWT_SECRET=your_random_secret_min_32_chars
NEXTAUTH_SECRET=another_random_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

#### Phone Verification (Optional - for SMS)
```
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

#### M-Pesa (Optional)
```
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-app.vercel.app/api/payments/mpesa/callback
MPESA_ENVIRONMENT=sandbox
```

#### Stripe (Optional)
```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### PayPal (Optional)
```
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_ENVIRONMENT=sandbox
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://investment-platform-xyz.vercel.app`

---

## Step 3: Post-Deployment Configuration

### 3.1 Update Supabase

In your Supabase project:
1. Go to **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**
3. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

### 3.2 Update M-Pesa Callback

If using M-Pesa:
1. Go to Daraja API portal
2. Update callback URL to: `https://your-app.vercel.app/api/payments/mpesa/callback`

### 3.3 Update Stripe Webhooks

If using Stripe:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/payments/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. In Vercel project, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `investpro.com`)
3. Follow DNS configuration instructions

### 4.2 Update Environment Variables

Update `NEXTAUTH_URL` to your custom domain:
```
NEXTAUTH_URL=https://investpro.com
```

---

## Step 5: Testing Production

### 5.1 Test Authentication

1. Visit your deployed URL
2. Click "Get Started"
3. Create a test account
4. Verify you can login

### 5.2 Test Deposits (Demo Mode)

1. Login to dashboard
2. Go to Wallet
3. Try a demo deposit
4. Check Supabase to verify transaction was recorded

### 5.3 Test M-Pesa (Sandbox)

If configured:
1. Use Safaricom test numbers
2. Test phone: `254708374149`
3. Test PIN: Any 4 digits
4. Verify STK push appears

---

## Step 6: Monitoring & Maintenance

### 6.1 View Logs

- **Vercel Logs**: Project → Deployments → Click deployment → Logs
- **Supabase Logs**: Supabase Dashboard → Logs

### 6.2 Set Up Alerts

In Vercel:
1. Go to **Settings** → **Notifications**
2. Enable deployment notifications
3. Add your email

### 6.3 Monitor Database

In Supabase:
1. Check **Database** → **Tables** regularly
2. Monitor **Reports** for usage
3. Set up backups in **Settings** → **Database**

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Solution: Check `package.json` has all dependencies
- Run `npm install` locally first

**Error: "Environment variable not found"**
- Solution: Add missing variables in Vercel dashboard
- Redeploy after adding

### Runtime Errors

**Error: "Unauthorized" on API calls**
- Check JWT_SECRET is set
- Verify token is being sent in requests

**Error: "Supabase connection failed"**
- Verify SUPABASE_URL and keys are correct
- Check Supabase project is active

### Payment Issues

**M-Pesa STK not appearing**
- Verify callback URL is publicly accessible
- Check M-Pesa credentials are for correct environment (sandbox/production)
- Test with Safaricom test numbers first

**Stripe payments failing**
- Verify webhook secret is correct
- Check Stripe dashboard for error details
- Ensure using test keys in sandbox mode

---

## Security Checklist

Before going live:

- [ ] All environment variables are set
- [ ] JWT secrets are strong (32+ characters)
- [ ] Supabase RLS (Row Level Security) is enabled
- [ ] HTTPS is enabled (Vercel does this automatically)
- [ ] API rate limiting is implemented
- [ ] Error messages don't expose sensitive data
- [ ] Payment webhooks verify signatures
- [ ] Database backups are configured
- [ ] Monitoring/alerting is set up

---

## Going to Production

### Switch from Sandbox to Production

1. **M-Pesa**:
   - Get production credentials from Safaricom
   - Update `MPESA_ENVIRONMENT=production`
   - Use production shortcode and passkey

2. **Stripe**:
   - Switch to live API keys
   - Update webhook endpoints
   - Complete business verification

3. **PayPal**:
   - Switch to production credentials
   - Complete business verification

### Legal Requirements

Before accepting real money:
- [ ] Register business entity
- [ ] Obtain necessary licenses
- [ ] Implement KYC/AML procedures
- [ ] Create Terms of Service
- [ ] Create Privacy Policy
- [ ] Comply with local financial regulations

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Vercel will auto-deploy in ~2 minutes
```

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **M-Pesa Daraja**: https://developer.safaricom.co.ke
- **Stripe Docs**: https://stripe.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Your Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All environment variables added
- [ ] First deployment successful
- [ ] Database schema applied in Supabase
- [ ] Test account created
- [ ] Demo deposit tested
- [ ] Custom domain configured (optional)
- [ ] Payment gateways configured
- [ ] Monitoring set up

**Congratulations! Your platform is live! 🎉**

Access it at: `https://your-app.vercel.app`
