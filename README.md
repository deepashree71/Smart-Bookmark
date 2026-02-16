# Smart Bookmark App

A modern, professional bookmark manager built with React, TypeScript, Supabase, and Tailwind CSS. This application allows users to save, organize, and manage their favorite links with real-time synchronization across multiple tabs/devices.

## Features

- **Google OAuth Authentication**: Secure sign-in using Google accounts (no email/password required)
- **Private Bookmarks**: Each user's bookmarks are completely private and isolated
- **Real-time Synchronization**: Changes appear instantly across all open tabs without page refresh
- **CRUD Operations**: Create, read, update, and delete bookmarks with ease
- **Search Functionality**: Quickly find bookmarks by title or URL
- **Responsive Design**: Beautiful, professional UI that works on all devices
- **Modern Tech Stack**: Built with React, TypeScript, Supabase, and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication, PostgreSQL Database, Real-time)
- **Icons**: Lucide React

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier works perfectly)

### 2. Supabase Setup

#### a. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Fill in your project details and wait for setup to complete

#### b. Configure Google OAuth
1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Enable the **Google** provider
3. Follow Supabase's instructions to set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Go to **Credentials** > **Create Credentials** > **OAuth Client ID**
   - Select "Web application"
   - Add authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret
4. Paste the Client ID and Client Secret in Supabase Google provider settings
5. Save the configuration

#### c. Database is Already Set Up
The database schema and Row Level Security policies have been automatically applied via migration.

### 3. Local Development Setup

#### a. Clone and Install
```bash
# Install dependencies
npm install
```

#### b. Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase dashboard under **Settings** > **API**.

#### c. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Testing the Application

1. Open the app in your browser
2. Click "Continue with Google" to sign in
3. Add some bookmarks with titles and URLs
4. Open the app in another tab - bookmarks sync in real-time!
5. Try the search functionality
6. Delete bookmarks you no longer need

## Deployment to Vercel

### Option 1: Using Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click "Deploy"
8. Once deployed, copy your Vercel URL
9. Go back to Supabase > Authentication > URL Configuration
10. Add your Vercel URL to the "Site URL" and "Redirect URLs"

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts and add your environment variables
```

## Project Structure

```
src/
├── components/
│   ├── Login.tsx              # Login page with Google OAuth
│   ├── Dashboard.tsx          # Main dashboard with bookmark list
│   └── AddBookmarkModal.tsx   # Modal for adding new bookmarks
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── lib/
│   └── supabase.ts            # Supabase client configuration
├── App.tsx                    # Main app component with routing
├── main.tsx                   # App entry point
└── index.css                  # Global styles with Tailwind

Database:
└── Migration: create_bookmarks_table
    - Creates bookmarks table
    - Sets up Row Level Security
    - Creates indexes for performance
```

## Key Implementation Details

### Real-time Synchronization
The app uses Supabase's real-time subscriptions to listen for changes in the bookmarks table. When a bookmark is added, updated, or deleted in one tab, all other tabs receive the update instantly.

### Row Level Security
All database operations are protected by Row Level Security policies:
- Users can only view their own bookmarks
- Users can only add bookmarks for themselves
- Users can only modify/delete their own bookmarks
- No user can access another user's data

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google's consent screen
3. After approval, redirected back to the app
4. Supabase handles the session management automatically

## Problems Encountered & Solutions

### Problem 1: Real-time Updates Not Working
**Issue**: Initially, bookmarks weren't syncing across tabs in real-time.

**Solution**: Implemented Supabase real-time subscriptions with proper channel management. Added cleanup logic to remove channels when the component unmounts to prevent memory leaks.

### Problem 2: OAuth Redirect Configuration
**Issue**: Google OAuth was failing with redirect URI mismatch errors.

**Solution**: Ensured that all redirect URIs are properly configured in both Google Cloud Console and Supabase dashboard. Added clear instructions in the README for setting this up correctly.



## Performance Optimizations

- Database indexes on `user_id` and `created_at` for fast queries
- Optimistic UI updates for better user experience
- Efficient real-time subscriptions with proper filtering
- Component-level state management to minimize re-renders

## Security Features

- Google OAuth for secure authentication
- Row Level Security at the database level
- HTTPS-only for production deployments
- No sensitive data stored in client-side code
- Secure environment variable handling

## Future Enhancements

- Bookmark folders/categories
- Tagging system
- Import/export bookmarks
- Bookmark sharing with other users
- Browser extension for one-click bookmarking
- Full-text search with PostgreSQL

## License

This project is built as a portfolio/interview project and is free to use and modify.

## Support

If you encounter any issues or have questions, please check:
1. Supabase dashboard for any database errors
2. Browser console for client-side errors
3. Environment variables are correctly set
4. Google OAuth is properly configured

---

Built with ❤️ using React, TypeScript, Supabase, and Tailwind CSS
