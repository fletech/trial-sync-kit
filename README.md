# THEMISON - MVP

A modern clinical trial management system built with React, TypeScript, and Supabase.

## ⚡ Quick Setup (For DevOps)

**Already have a Supabase project?** Just need to connect this frontend:

1. **Get credentials** from Supabase Dashboard → Project Settings → API
2. **Create `.env.local`** with your credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. **Run the app**:
   ```bash
   npm install
   npm run dev
   ```

That's it! The app connects to your existing Supabase auth and database.

## 🚀 Project Overview

THEMISON is an interactive prototype for demonstrating clinical trial management capabilities. It features real-time collaboration, task management, document handling, and team organization tools.

### Key Features

- **Authentication System** - Real Supabase auth with sign up, sign in, password reset
- **Trial Management** - Create, view, and manage clinical trials
- **Task Management** - Kanban board and Gantt chart views
- **Team Organization** - Manage team members, roles, and permissions
- **Notifications** - Real-time notification system
- **Document Assistant** - AI-powered document management
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **State Management**: React Context + localStorage
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Charts**: Recharts

## 📋 Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **Docker** (for local Supabase development) - [Download here](https://docker.com/)
- **Supabase CLI** - [Installation guide](https://supabase.com/docs/guides/cli)

## 🏗 Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone <YOUR_GIT_URL>
cd themison-demo
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Supabase Local Development Setup

Initialize and start Supabase locally:

\`\`\`bash

# Initialize Supabase (only needed once)

npx supabase init

# Start local Supabase services

npx supabase start
\`\`\`

This will start the following services:

- **API**: http://127.0.0.1:54321
- **Studio**: http://127.0.0.1:54323
- **Inbucket (emails)**: http://127.0.0.1:54324

### 4. Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`bash

# Supabase Local Development

VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Optional: Enable dev tools

VITE_DEV_TOOLS=true
\`\`\`

### 5. Database Migration

Apply the database schema:

\`\`\`bash

# Apply existing migrations

npx supabase db reset

# Or apply specific migration

npx supabase migration up
\`\`\`

### 6. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at **http://localhost:8081**

## 🚀 Connecting to Your Supabase Project

### 1. Get Your Supabase Credentials

If you already have a Supabase project set up:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your existing project
3. Go to **Project Settings** → **API**
4. Copy these two values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **Anon/Public Key** (starts with: `eyJhbGciOiJIUzI1NiIs...`)

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

\`\`\`bash

# Replace with YOUR actual Supabase credentials

VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

**⚠️ Important:**

- Replace `your-project-ref` with your actual project reference
- Replace `your-anon-key-here` with your actual anon key
- Never commit these credentials to version control

### 3. Test the Connection

\`\`\`bash

# Install dependencies

npm install

# Start the development server

npm run dev
\`\`\`

The app should now connect to your Supabase project. Test by:

- Visiting http://localhost:8081
- Trying to register a new user
- Checking if authentication works

### 4. Deploy the Application

**Option A - Vercel** (Recommended):

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Option B - Netlify**:

1. Build the project: \`npm run build\`
2. Deploy \`dist\` folder to Netlify
3. Configure environment variables

**Option C - Custom Server**:

\`\`\`bash

# Build for production

npm run build

# Serve the dist folder with your preferred web server

\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/ # Reusable UI components
│ ├── ui/ # shadcn/ui components
│ ├── Sidebar.tsx # Main navigation
│ └── ProtectedRoute.tsx
├── pages/ # Page components
│ ├── auth/ # Authentication pages
│ ├── dashboard/ # Dashboard pages
│ └── trials/ # Trial management
├── services/ # API and business logic
│ ├── userService.ts # User authentication
│ └── storage.js # Local storage utilities
├── hooks/ # Custom React hooks
│ ├── useAuth.ts # Authentication hook
│ └── use-toast.ts # Toast notification hook
├── lib/ # Utilities
│ ├── supabase.ts # Supabase client
│ └── utils.ts # Helper functions
└── contexts/ # React contexts
└── TrialContext.tsx
\`\`\`

## 🔧 Available Scripts

\`\`\`bash

# Development

npm run dev # Start dev server

# Building

npm run build # Build for production
npm run preview # Preview production build

# Database (Supabase)

npx supabase start # Start local Supabase
npx supabase stop # Stop local Supabase
npx supabase status # Check service status
npx supabase db reset # Reset local database
npx supabase migration new <name> # Create new migration

# Code Quality

npm run lint # Run ESLint
npm run type-check # TypeScript type checking
\`\`\`

## 🗄 Database Schema

### Core Tables

- **\`auth.users\`** - Managed by Supabase (authentication)
- **\`public.profiles\`** - User profiles and metadata

### Data Flow

1. **Authentication**: Handled by Supabase Auth
2. **User Data**: Stored in \`profiles\` table + localStorage for preferences
3. **Application Data**: Currently localStorage (trials, tasks, notifications)

## 🔐 Authentication Flow

1. **Sign Up**: Creates user in \`auth.users\` + auto-creates profile
2. **Sign In**: Establishes session, loads user data
3. **Password Reset**: Sends email via Supabase Auth
4. **Session Management**: Auto-refresh tokens, persistent sessions

## 🌍 Environment Configuration

### Development

\`\`\`bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=local-anon-key
VITE_DEV_TOOLS=true
\`\`\`

### Production

\`\`\`bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
\`\`\`

## 📧 Email Configuration (Production)

For production email functionality:

1. Go to Supabase Dashboard → Authentication → Settings
2. Configure SMTP settings or use a service like:
   - SendGrid
   - Mailgun
   - AWS SES
   - Resend

## 🔍 Monitoring & Debugging

### Local Development

- **Supabase Studio**: http://127.0.0.1:54323
- **Email Testing**: http://127.0.0.1:54324 (Inbucket)
- **Dev Tools**: Alt/Option + Click on logo to toggle

### Production

- **Supabase Dashboard**: Monitor auth, database, and API usage
- **Browser DevTools**: Check network requests and console logs
- **Error Boundaries**: Implemented for graceful error handling

## 🚨 Troubleshooting

### Common Issues

**1. Supabase not starting locally**
\`\`\`bash

# Check Docker is running

docker ps

# Restart Supabase

npx supabase stop
npx supabase start
\`\`\`

**2. Authentication errors**

- Check environment variables are correct
- Verify Supabase project is active
- Check network connectivity

**3. Database connection issues**

- Ensure migrations are applied
- Check RLS policies are enabled
- Verify API keys are correct

**4. Build errors**
\`\`\`bash

# Clear node_modules and reinstall

rm -rf node_modules package-lock.json
npm install

# Clear Vite cache

npm run dev -- --force
\`\`\`

## 👥 Team Collaboration

### Git Workflow

1. Create feature branch: \`git checkout -b feature/your-feature\`
2. Make changes and commit
3. Push and create Pull Request
4. Review and merge

### Database Changes

1. Create migration: \`npx supabase migration new your_migration_name\`
2. Write SQL in the generated file
3. Test locally: \`npx supabase db reset\`
4. Push to production: \`npx supabase db push\`
