# Smart Bookmarks - Complete Setup Guide

## What You Need to Do Before Your Interview

This guide will walk you through everything you need to set up and deploy your Smart Bookmark App for the company evaluation.

---

## Step 1: Set Up Supabase (15-20 minutes)

### Create Your Supabase Project

1. **Go to Supabase**
   - Visit [https://supabase.com](https://supabase.com)
   - Sign up for a free account
   - Click "New Project"
   - Fill in:
     - Project Name: "smart-bookmarks"
     - Database Password: (create a strong password and save it)
     - Region: Choose closest to you
   - Click "Create new project" and wait 2-3 minutes for setup

2. **Get Your API Keys**
   - Once your project is ready, go to **Settings** (gear icon in sidebar)
   - Click **API**
   - You'll see two important values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon public** key (long string starting with `eyJ...`)
   - Keep this page open, you'll need these values

### Configure Google OAuth (IMPORTANT!)

3. **Set Up Google Cloud Console**
   - Go to [https://console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project (top left, click project dropdown > "New Project")
   - Name it "Smart Bookmarks" and click "Create"

4. **Enable Google+ API**
   - In the search bar, type "Google+ API"
   - Click on it and click "Enable"

5. **Create OAuth Credentials**
   - Go to **APIs & Services** > **Credentials**
   - Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
   - If prompted, configure the consent screen:
     - User Type: External
     - App name: Smart Bookmarks
     - User support email: your email
     - Developer contact: your email
     - Click "Save and Continue" through all steps
   - Now create OAuth client ID:
     - Application type: **Web application**
     - Name: "Smart Bookmarks"
     - Authorized redirect URIs: Add this (replace YOUR_PROJECT_REF with your actual Supabase project reference from the URL):
       ```
       https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
       ```
       Example: `https://abcdefghijk.supabase.co/auth/v1/callback`
   - Click "Create"
   - Copy the **Client ID** and **Client Secret**

6. **Configure Google OAuth in Supabase**
   - Go back to your Supabase dashboard
   - Go to **Authentication** (left sidebar) > **Providers**
   - Find **Google** and enable it
   - Paste your **Client ID** and **Client Secret** from Google
   - Click "Save"

### Database Setup (Already Done!)

7. **Verify Database Migration**
   - The database tables and security policies have been automatically set up
   - Go to **Database** > **Tables** in Supabase
   - You should see a "bookmarks" table
   - This confirms everything is ready!

---

## Step 2: Local Development Setup (5-10 minutes)

### Configure Your Project

1. **Create Environment File**
   - In your project root, create a file named `.env`
   - Add these lines (replace with your actual values from Step 1.2):
     ```
     VITE_SUPABASE_URL=https://your-project-ref.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Test Locally**
   ```bash
   npm run dev
   ```
   - Open your browser to `http://localhost:5173`
   - Click "Continue with Google"
   - Sign in with your Google account
   - Try adding a bookmark!
   - Open another tab with the same URL to see real-time sync

---

## Step 3: Deploy to Vercel (10 minutes)

### Prepare Your Code

1. **Create GitHub Repository**
   - Go to [https://github.com/new](https://github.com/new)
   - Name it "smart-bookmarks-app"
   - Make it **Public** (required for submission)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Push Your Code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Smart Bookmarks App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/smart-bookmarks-app.git
   git push -u origin main
   ```

### Deploy to Vercel

3. **Create Vercel Account**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Click "Import Project"

4. **Import Your Repository**
   - Select your "smart-bookmarks-app" repository
   - Click "Import"

5. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Add Environment Variables**
   Click "Environment Variables" and add:
   - Name: `VITE_SUPABASE_URL`
     Value: (paste your Supabase URL)
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: (paste your Supabase anon key)

7. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Once complete, you'll see "Congratulations!"
   - Click "Visit" to see your live app
   - Copy the URL (e.g., `https://smart-bookmarks-app.vercel.app`)

### Configure Supabase for Production

8. **Update Supabase URLs**
   - Go back to Supabase dashboard
   - Go to **Authentication** > **URL Configuration**
   - In "Site URL", enter your Vercel URL: `https://your-app.vercel.app`
   - In "Redirect URLs", add: `https://your-app.vercel.app/**`
   - Click "Save"

9. **Update Google OAuth**
   - Go back to [Google Cloud Console](https://console.cloud.google.com)
   - Go to **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Add to "Authorized redirect URIs": `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Add to "Authorized JavaScript origins": `https://your-app.vercel.app`
   - Click "Save"

---

## Step 4: Test Your Production App (5 minutes)

1. **Open Your Vercel URL**
   - Visit your deployed app: `https://your-app.vercel.app`

2. **Test All Features**
   - Click "Continue with Google"
   - Sign in successfully
   - Add 3-5 bookmarks with different titles and URLs
   - Try the search feature
   - Delete a bookmark
   - Open the app in a new tab
   - Add a bookmark in one tab, watch it appear in the other (real-time!)

3. **Verify Privacy**
   - Sign out
   - Sign in with a different Google account
   - Confirm you don't see the previous user's bookmarks

---

## Step 5: Prepare for Submission

### What to Submit

1. **Your Live Vercel URL**
   - Example: `https://smart-bookmarks-app.vercel.app`

2. **Your GitHub Repository URL**
   - Example: `https://github.com/yourusername/smart-bookmarks-app`
   - Make sure it's **public**!

3. **README.md** (Already included in your project)
   - Contains problems encountered and solutions
   - Explains the tech stack
   - Shows project structure

### Quick Checklist

- [ ] Supabase project created and configured
- [ ] Google OAuth working correctly
- [ ] Database migration applied successfully
- [ ] Local development tested and working
- [ ] Code pushed to public GitHub repository
- [ ] Deployed to Vercel successfully
- [ ] Environment variables configured in Vercel
- [ ] Supabase URLs updated with Vercel URL
- [ ] Production app tested with Google sign-in
- [ ] Real-time updates working in production
- [ ] Can add, view, search, and delete bookmarks

---