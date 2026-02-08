# Personal Finance Tracker

> Your finances, simplified.

A modern personal finance app with web and mobile interfaces. Track income, expenses, budgets, and savings goals across all your accounts.

## Features

- Multi-platform: Web (React), iOS & Android (React Native)
- Account Management: Bank, MFS, Credit Card, Cash accounts
- Transaction Tracking: Income, expenses, transfers with categories
- Budgets: Monthly budget planning with progress tracking
- Savings Goals: Track progress toward financial goals
- Smart Suggestions: Rule-based savings recommendations
- Dark/Light Theme: System-aware theming with manual toggle
- Real-time Sync: Supabase real-time subscriptions

## Tech Stack

### Backend
- Django 6 + Django REST Framework
- PostgreSQL via Supabase (managed = False, Supabase owns schema)
- Authentication: Supabase JWT (ES256) via PyJWKClient
- Deployment: Render (free tier)

### Frontend (Web)
- React 18 + Vite + TypeScript
- Tailwind CSS v4 + CSS custom properties for theming
- TanStack Query for server state
- Zustand for client state
- Headless UI for accessible components
- Deployment: Vercel (free tier)

### Mobile
- Expo React Native (SDK 52)
- Expo Router for file-based navigation
- TanStack Query for server state
- Zustand for client state
- Expo SecureStore for secure token persistence
- React Native Reanimated for animations
- Deployment: EAS Build / App Stores

### Database & Auth
- Supabase (PostgreSQL + Auth + Realtime)
- Row-level security (RLS) on all tables
- PostgreSQL triggers for balance updates

## Setup

### 1. Supabase
1. Create project at supabase.com
2. Run schema from supabase/schema.sql in SQL Editor
3. Enable Google OAuth in Authentication → Providers
4. Note your project URL, anon key, JWT secret, database URL

### 2. Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your Supabase credentials
python manage.py runserver

### 3. Frontend
cd frontend
npm install
cp .env.example .env.local  # Add your Supabase & API URLs
npm run dev

### 4. Mobile
```bash
cd mobile
npm install
cp .env.example .env  # Add your Supabase & API URLs
npx expo start
```

**Environment Variables:**
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `EXPO_PUBLIC_API_BASE_URL` - Your Django API base URL (e.g., https://your-api.onrender.com/api/v1)

**Running on Device/Simulator:**
- iOS: Press `i` in terminal or run `npm run ios` (requires Xcode)
- Android: Press `a` in terminal or run `npm run android` (requires Android Studio)
- Physical Device: Scan QR code with Expo Go app (iOS/Android)

**Mobile App Features:**
- 📱 5 main screens: Dashboard, Accounts, Transactions, Budgets, Savings
- 🔐 Secure authentication with Supabase (persisted via SecureStore)
- 🎨 Dark theme with emerald green accents
- 👤 Personalized dashboard with time-based greetings
- 📊 Quick actions, balance overview, and recent transactions
- 🎯 Budget tracking and savings goals management

## Deployment

### Backend (Render)
1. Connect GitHub repo at [render.com](https://render.com)
2. Create new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn config.wsgi:application`
5. Add environment variables from `.env.example`

### Frontend (Vercel)
1. Connect GitHub repo at [vercel.com](https://vercel.com)
2. Framework Preset: Vite
3. Root Directory: `frontend`
4. Add environment variables from `.env.example`

### Mobile (EAS Build)
```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios     # or android, or all
eas submit                   # Submit to App Store / Play Store
```

**Production Builds:**
- iOS: Requires Apple Developer Program ($99/year)
- Android: Requires Google Play Developer account ($25 one-time)
- Both: Configure app icons, splash screens, and signing certificates via EAS

## License

MIT
