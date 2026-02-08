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
cd mobile
npm install
cp .env.example .env
npx expo start

## Deployment

- Backend: Render (pip install + gunicorn)
- Frontend: Vercel (auto-detects Vite)
- Mobile: EAS Build (npx eas build)

## License

MIT
