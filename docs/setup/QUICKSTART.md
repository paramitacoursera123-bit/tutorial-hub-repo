# Quick Start Setup

Get the Tutorial Platform running in 5 minutes.

---

## Prerequisites

- **Node.js** 16 or higher
- **npm** 7 or higher
- **Git** for cloning
- **Firebase project** (free tier works)
- **Modern browser** (Chrome, Firefox, Safari, Edge)

Check versions:
```bash
node --version    # Should be 16+
npm --version     # Should be 7+
git --version     # Should be installed
```

---

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd dynamic-tutorial-website
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs:
- React 18.2.0
- Vite 5.0.8
- Firebase 10.7.1
- Tailwind CSS 3.3.6
- React Router v6
- And other dependencies

---

## Step 3: Create Firebase Project

### Go to Firebase Console
1. Visit [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create project"
3. Enter project name (e.g., "tutorial-platform")
4. Accept terms and create

### Register Web App
1. In Firebase console, click "+" → "Web"
2. Enter app name (e.g., "tutorial-web")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase config (you'll need these 6 values):
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

---

## Step 4: Create Environment File

Create `.env.local` in project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

**Important:** Don't commit `.env.local` (it's in .gitignore)

---

## Step 5: Enable Authentication

### In Firebase Console:
1. Go to "Build" → "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider:
   - Click "Email/Password"
   - Toggle on "Enable"
   - Set "Email enumeration protection" to "Enabled"
   - Click "Save"
4. Enable "Google" provider:
   - Click "Google"
   - Toggle on "Enable"
   - Select support email
   - Click "Save"

---

## Step 6: Create Firestore Database

### In Firebase Console:
1. Go to "Build" → "Firestore Database"
2. Click "Create database"
3. Select region (closest to users)
4. Start in **Test mode** for development:
   - Select "Start in test mode"
   - Click "Create"
5. Wait for database creation

### Deploy Security Rules:
1. Go to "Firestore Database" → "Rules" tab
2. Copy content from `firestore.rules` file in project
3. Paste into Firebase Rules editor
4. Click "Publish"

---

## Step 7: Start Development Server

```bash
npm run dev
```

This starts Vite dev server at `http://localhost:5173`

---

## Step 8: Test the Application

### Open in Browser
Navigate to `http://localhost:5173`

### Test Google Sign-In
1. Click "Sign in with Google"
2. Complete Google authorization
3. Should redirect to `/admin` dashboard
4. Check browser console for errors (should be clean)

### Test Email/Password
1. Go to `/register`
2. Create account with email and password
3. Should auto-login and go to `/`
4. Login page should work

### Verify Firestore Data
1. Go to Firebase Console
2. "Firestore Database" → "Data"
3. Should see collections:
   - `adminUsers` - Google OAuth users
   - `users` - Email/password users

---

## Verification Checklist

After setup, verify:

- [ ] `npm install` completed without errors
- [ ] `.env.local` created with all 6 Firebase variables
- [ ] `npm run dev` runs without errors
- [ ] App loads at `http://localhost:5173`
- [ ] No errors in browser console (F12)
- [ ] Google OAuth popup appears on signin page
- [ ] Can sign in with Google
- [ ] Can create account with email/password
- [ ] Can login with email/password
- [ ] User appears in Firestore after signin
- [ ] Auth persists on page reload
- [ ] Dark mode toggle works
- [ ] Mobile responsive (use browser dev tools)

---

## Project Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check code style
npm run lint
```

---

## Troubleshooting

### "Module not found" errors
**Solution:** Run `npm install` again

### Firebase config not loading
**Solution:**
- Verify `.env.local` exists in project root
- Restart dev server after creating `.env.local`
- Check variable names start with `VITE_`

### Google OAuth popup blocked
**Solution:**
- Check browser settings for popup blocking
- Disable adblocker for this site
- Allow popups for `localhost:5173`

### "This domain is not authorized"
**Solution:**
1. Go to Firebase Console
2. Go to Authentication → Settings
3. Add `localhost:5173` to authorized domains
4. Restart dev server

### Firestore connection error
**Solution:**
- Verify Firestore database is created
- Check security rules are deployed
- Verify Firebase variables in `.env.local`

### Still having issues?
→ See [Troubleshooting Guide](../guides/TROUBLESHOOTING.md)

---

## Next Steps

After successful setup:

1. **Read the docs:**
   - [Features Overview](../features/FEATURES.md)
   - [Architecture Guide](../architecture/ARCHITECTURE.md)

2. **Start developing:**
   - [Development Workflow](../guides/DEVELOPMENT_WORKFLOW.md)
   - [Component Guide](../components/COMPONENTS.md)

3. **Understand the system:**
   - [Authentication Guide](../guides/AUTHENTICATION.md)
   - [Firestore Guide](../guides/FIRESTORE.md)

---

## External Resources

- [Vite Setup](https://vitejs.dev/guide/)
- [React Getting Started](https://react.dev/learn)
- [Firebase Setup](https://firebase.google.com/docs/web/setup)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/en/main)

---

**Last Updated:** April 24, 2026

**Time to complete:** ~5-10 minutes
