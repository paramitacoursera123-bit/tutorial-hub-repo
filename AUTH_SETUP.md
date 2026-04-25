# Firebase Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication for your tutorial platform using Firebase.

## Overview

Your app is already configured to use Firebase Google OAuth. You just need to:
1. Create a Firebase project
2. Get OAuth credentials from Google Cloud
3. Add credentials to `.env.local`
4. Deploy Firestore security rules

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Name your project (e.g., "tutorial-platform")
4. Click **"Create project"**
5. Wait for project creation to complete

---

## Step 2: Register Your Web App in Firebase

1. In Firebase Console, click the **Web** icon `</>`
2. Register app with name (e.g., "Tutorial Platform Web")
3. **Copy the configuration values** - you'll need these:
   ```
   apiKey
   authDomain
   projectId
   storageBucket
   messagingSenderId
   appId
   ```
4. Click **"Continue to console"**

---

## Step 3: Enable Google Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"** or go to **"Sign-in method"** tab
3. Click **"Google"**
4. Toggle **"Enable"** to ON
5. Select a **Support email** from the dropdown
6. Click **"Save"**

---

## Step 4: Configure Google OAuth Credentials

### Option A: Automatic Setup (Easiest)
1. In Firebase Authentication > Google provider settings
2. Click **"Web SDK configuration"** 
3. Firebase auto-generates OAuth credentials - you're done with this step!

### Option B: Manual Setup (Google Cloud Console)
If you need custom scopes or additional configuration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure your Firebase project is selected (dropdown at top)
3. Go to **APIs & Services** → **Credentials** (left sidebar)
4. Click **"+ Create Credentials"** → **"OAuth Client ID"**
5. Choose application type: **Web application**
6. Add **Authorized JavaScript origins:**
   - `http://localhost:5173` (local development)
   - `http://localhost:3000` (alternative dev port)
   - `https://yourdomain.com` (production)
7. Add **Authorized redirect URIs:**
   - `http://localhost:5173/login`
   - `http://localhost:3000/login`
   - `https://yourdomain.com/login`
8. Click **"Create"**
9. Copy your **Client ID** (you might not need this if using Firebase's auto config)

---

## Step 5: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Choose location (closest to your users)
4. Start in **"Test mode"** for development
5. Click **"Create"**
6. Once created, go to **"Rules"** tab
7. Replace the default rules with the content from `firestore.rules` in your project
8. Click **"Publish"**

**Security Rules for Development:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Step 6: Create `.env.local` File

1. In your project root, create a file named `.env.local`
2. Copy the Firebase configuration values from Step 2:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**⚠️ IMPORTANT:**
- `.env.local` is already added to `.gitignore` - it won't be committed
- Never share `.env.local` with anyone
- Each developer should create their own `.env.local`

---

## Step 7: Test the Setup

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the login page:**
   - Open `http://localhost:5173/login`

3. **Click "Sign in with Google":**
   - A popup should appear
   - Sign in with your Google account
   - You should see an authorization screen

4. **Verify successful login:**
   - You should be redirected to `/admin` dashboard
   - Your user should appear in Firestore under `adminUsers` collection
   - Check browser console for any errors

5. **Check Firestore:**
   - In Firebase Console → Firestore Database
   - You should see a new `adminUsers` collection with your user record

---

## Firebase Collections Structure

After setup, your Firestore will have these collections:

### `adminUsers` Collection
Stores OAuth users (Google/GitHub logins) with admin privileges:
```
{
  uid: "user_id",
  email: "user@gmail.com",
  displayName: "John Doe",
  photoURL: "https://...",
  providerData: [...],
  createdAt: Timestamp,
  lastLogin: Timestamp
}
```

### `users` Collection
Stores email/password users with regular privileges:
```
{
  email: "user@example.com",
  displayName: "Jane Doe",
  role: "user",
  createdAt: Timestamp
}
```

### `tutorials` Collection (Optional)
For storing tutorial content:
```
{
  title: "Tutorial Title",
  description: "...",
  content: "...",
  category: "...",
  createdBy: "admin_uid",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Troubleshooting

### Google OAuth popup doesn't appear
- Check browser console for errors (F12)
- Verify authorized origins in Google Cloud Console
- Make sure you're using the correct localhost port (5173)
- Check if popups are blocked in your browser

### "This domain is not authorized" error
- In Google Cloud Console, verify your authorized JavaScript origins
- For local dev, use `http://localhost:5173`
- Make sure you've enabled Google as auth provider in Firebase

### `.env.local` not loading
- Restart your dev server after creating `.env.local`
- Variables are loaded at build time
- Check that variable names start with `VITE_`

### Firestore permissions denied
- Check Firestore security rules are published
- User must be in `adminUsers` collection to have admin access
- Google OAuth users automatically added to `adminUsers`

### User not appearing in Firestore
- Check browser console for errors in `addAdminUser()` function
- Verify Firestore database is created and accessible
- Check Firestore security rules allow writes

---

## Production Deployment

Before deploying to production:

1. **Update authorized origins in Google Cloud Console** with your production domain
2. **Set Firestore security rules** to the production rules (see `firestore.rules`)
3. **Create a new OAuth credential** for production or add production domain to existing one
4. **Set environment variables** on your hosting platform (Vercel, Netlify, etc.)
5. **Enable email verification** in Firebase Authentication settings
6. **Set up custom error pages** for authentication failures
7. **Enable two-factor authentication** options in Firebase Console

---

## Next Steps

- ✅ User authentication and authorization working
- Next: Add profile picture uploads to Cloud Storage
- Next: Implement role-based access control for tutorials
- Next: Add email verification for email/password users
- Next: Set up password reset functionality

---

## Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google OAuth Setup](https://firebase.google.com/docs/auth/web/google-signin)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
