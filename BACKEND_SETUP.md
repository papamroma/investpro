# Backend Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `investpro` (or your choice)
   - Database password: (save this securely)
   - Region: Choose closest to Kenya (e.g., Singapore or Frankfurt)
5. Wait for project to be created (~2 minutes)

## Step 2: Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the schema

This will create all the necessary tables:
- users
- wallets
- transactions
- investments
- payment_methods
- otp_verifications

## Step 3: Get API Keys

1. In Supabase, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

## Step 4: Configure Environment Variables

1. Copy `env.template` to `.env.local`:
   ```bash
   cp env.template .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # Generate a random secret for JWT
   JWT_SECRET=your_random_secret_here_min_32_chars
   NEXTAUTH_SECRET=another_random_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Generate random secrets:
   ```bash
   # On Linux/Mac:
   openssl rand -base64 32
   
   # Or use online generator: https://generate-secret.vercel.app/32
   ```

## Step 5: Test the Backend

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test signup endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "fullName": "Test User",
       "idNumber": "12345678",
       "dob": "1990-01-01",
       "phone": "254712345678",
       "countryCode": "+254"
     }'
   ```

3. You should receive a response with a JWT token

## Step 6: Verify Database

1. Go to Supabase **Table Editor**
2. Check the `users` table - you should see your test user
3. Check the `wallets` table - a wallet should be created automatically

## Next Steps

Once the backend is working:
1. Update the frontend AuthContext to use the API
2. Implement phone verification
3. Add payment gateway integrations
4. Deploy to Vercel

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure `.env.local` exists and has the correct values
- Restart the dev server after adding environment variables

**Error: "Failed to create user"**
- Check Supabase SQL Editor for any errors
- Verify the schema was created correctly
- Check Supabase logs in the Dashboard

**Error: "Invalid token"**
- Make sure JWT_SECRET is set in `.env.local`
- Token expires after 7 days - try logging in again
