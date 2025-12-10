# InvestPro - Investment Platform

A modern, full-stack investment platform with mobile money integration for Kenya.

## Features

### Current (Phase 1 - Backend Infrastructure) ✅
- ✅ User authentication (signup/login with JWT)
- ✅ PostgreSQL database via Supabase
- ✅ Secure password hashing
- ✅ User profiles with KYC fields
- ✅ Wallet system
- ✅ Investment tracking

### In Progress (Phase 2-6)
- 🚧 Phone verification with OTP
- 🚧 M-Pesa integration (Safaricom)
- 🚧 Airtel Money integration
- 🚧 T-Kash integration (Telkom)
- 🚧 Card payments (Stripe)
- 🚧 PayPal integration
- 🚧 Apple Pay support
- 🚧 Daily interest accrual (0.5%)
- 🚧 Transaction history
- 🚧 Withdrawal system

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Vanilla CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT tokens, bcrypt
- **Payments**: M-Pesa, Airtel Money, T-Kash, Stripe, PayPal
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ (currently using 18.19.1)
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd /home/appolo/.gemini/antigravity/scratch/investment-platform
   npm install
   ```

2. **Set up Supabase:**
   - Follow the detailed guide in `BACKEND_SETUP.md`
   - Create a Supabase project
   - Run the database schema from `database/schema.sql`
   - Get your API keys

3. **Configure environment variables:**
   ```bash
   cp env.template .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_random_secret_32_chars_min
   NEXTAUTH_SECRET=another_random_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to http://localhost:3000
   - Create an account and test the platform

## Project Structure

```
investment-platform/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/          # Login page
│   │   │   └── signup/         # Registration page
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── invest/         # Investment interface
│   │   │   ├── wallet/         # Deposit/Withdraw
│   │   │   └── profile/        # User profile
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── user/           # User data endpoints
│   │   │   └── payments/       # Payment gateway endpoints (coming)
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   └── layout/             # Layout components
│   └── lib/
│       ├── supabase.ts         # Supabase client
│       ├── auth-utils.ts       # Auth utilities
│       ├── authContext.tsx     # Auth context provider
│       └── financeContext.tsx  # Finance context provider
├── database/
│   └── schema.sql              # Database schema
├── BACKEND_SETUP.md            # Backend setup guide
└── env.template                # Environment variables template
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/user/me` - Get current user data

### Coming Soon
- `POST /api/auth/verify-phone` - Send OTP
- `POST /api/auth/confirm-phone` - Verify OTP
- `POST /api/wallet/deposit` - Initiate deposit
- `POST /api/wallet/withdraw` - Initiate withdrawal
- `POST /api/payments/mpesa/stk-push` - M-Pesa payment
- `POST /api/payments/card/create-intent` - Card payment
- `POST /api/investments/create` - Create investment

## Database Schema

See `database/schema.sql` for the complete schema. Main tables:

- **users** - User accounts and KYC data
- **wallets** - User wallet balances
- **transactions** - All financial transactions
- **investments** - Active investments
- **payment_methods** - Saved payment methods
- **otp_verifications** - Phone verification OTPs

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/investment-platform.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy

3. **Update environment variables:**
   - Set `NEXTAUTH_URL` to your Vercel URL
   - Update callback URLs for payment gateways

## Payment Gateway Setup

### M-Pesa (Safaricom)
1. Register for Daraja API at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create an app and get Consumer Key/Secret
3. Get a Paybill or Till number
4. Add credentials to `.env.local`

### Airtel Money
1. Contact Airtel Business for API access
2. Get Client ID and Secret
3. Add to `.env.local`

### T-Kash (Telkom)
1. Contact Telkom for merchant API access
2. Get API key and Merchant ID
3. Add to `.env.local`

### Stripe (Cards & Apple Pay)
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Add to `.env.local`

### PayPal
1. Create business account at [paypal.com](https://paypal.com)
2. Get Client ID/Secret from Developer Dashboard
3. Add to `.env.local`

## Development Roadmap

- [x] Phase 1: Backend Infrastructure
- [ ] Phase 2: Phone Verification
- [ ] Phase 3: Kenyan Mobile Money
- [ ] Phase 4: Card & Digital Payments
- [ ] Phase 5: Enhanced Features
- [ ] Phase 6: Production Deployment

## Security Notes

⚠️ **Important Security Considerations:**

- Never commit `.env.local` to version control
- Use strong, random secrets for JWT_SECRET
- Enable Row Level Security (RLS) in Supabase for production
- Implement rate limiting for API endpoints
- Use HTTPS in production (Vercel provides this automatically)
- Validate all user inputs
- Implement proper error handling without exposing sensitive data

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact support.
