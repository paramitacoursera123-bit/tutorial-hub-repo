# Google OAuth & Firebase Authentication Implementation Guide

This document provides implementation details and best practices for your OAuth setup.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Your React App                            │
│  (Login.jsx, AdminDashboard.jsx, ProtectedRoute.jsx)         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              AuthContext (src/contexts/AuthContext.jsx)      │
│  • Manages auth state (currentUser, userRole, loading, error)│
│  • Provides hooks: useAuth()                                 │
│  • Methods: login, signup, loginWithGoogle, logout           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Firebase SDK                               │
│  (Authentication + Firestore Database)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│  Authentication  │      │  Firestore DB    │
│  • Google OAuth  │      │  • adminUsers    │
│  • Email/Pass    │      │  • users         │
│  • GitHub OAuth  │      │  • tutorials     │
└──────────────────┘      └──────────────────┘
        │                         │
        ▼                         ▼
   ┌─────────────────────────────────┐
   │   Google Cloud / Firebase       │
   │   Cloud Console                  │
   └─────────────────────────────────┘
```

## Authentication Flow

### Google OAuth Sign-In Flow

```
1. User clicks "Sign in with Google" button
   ↓
2. Google OAuth popup opens
   ↓
3. User authenticates with Google
   ↓
4. Firebase receives OAuth token from Google
   ↓
5. User added to Firestore "adminUsers" collection
   ↓
6. AuthContext updates with:
   - currentUser (Firebase User object)
   - userRole = "admin"
   ↓
7. App redirects to /admin dashboard
   ↓
8. Auth state persists via onAuthStateChanged listener
```

### Email/Password Sign-Up Flow

```
1. User fills signup form
   ↓
2. signup() called with email, password, displayName
   ↓
3. Firebase creates user account
   ↓
4. User added to Firestore "users" collection with role: "user"
   ↓
5. AuthContext updates with:
   - currentUser
   - userRole = "user"
   ↓
6. App redirects to / homepage
```

## User Role System

### Admin Users (OAuth)
- Sign in via Google OAuth
- Automatically added to `adminUsers` collection
- Can access admin dashboard (/admin)
- Have write access to tutorials
- Stored data includes: uid, email, displayName, photoURL, providerData, timestamps

### Regular Users (Email/Password)
- Sign up with email and password
- Added to `users` collection with role: "user"
- Can only access public pages
- Have no write access to admin data
- Stored data includes: email, displayName, role, createdAt

## Implementation Details

### File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Auth state & methods
├── components/
│   └── ProtectedRoute.jsx        # Route protection
├── pages/
│   ├── Login.jsx                 # Login UI
│   ├── Register.jsx              # Signup UI
│   └── AdminDashboard.jsx        # Admin-only page
├── firebase/
│   └── config.js                 # Firebase initialization
└── utils/
    └── firebaseHelpers.js        # Helper functions
```

### Key Functions in AuthContext

```javascript
// OAuth Sign-In
loginWithGoogle()    // Opens Google OAuth popup, creates admin user
loginWithGithub()    // Opens GitHub OAuth popup, creates admin user

// Email/Password Auth
signup()            // Creates regular user account
login()             // Signs in with email/password
logout()            // Signs out current user

// Hooks
useAuth()           // Returns auth context value

// Internal Utilities
addAdminUser()      // Creates admin profile in Firestore
checkAdminStatus()  // Checks if user is admin
```

### Helper Functions (firebaseHelpers.js)

```javascript
updateLastLogin(userId)              // Update last login timestamp
updateUserProfile(userId, data)      // Update user data
updateProfilePicture(userId, url)    // Store profile picture URL
getUserProfile(userId)               // Get user profile data
getAllAdminUsers()                   // Get all admin users
promoteUserToAdmin(userId, ...)      // Promote user to admin
demoteAdminToUser(userId, ...)       // Remove admin privileges
```

## Environment Variables

Required `.env.local` variables:

```env
VITE_FIREBASE_API_KEY              # Public API key
VITE_FIREBASE_AUTH_DOMAIN          # Auth domain
VITE_FIREBASE_PROJECT_ID           # Project ID
VITE_FIREBASE_STORAGE_BUCKET       # Storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID  # Messaging sender ID
VITE_FIREBASE_APP_ID               # App ID
```

All obtained from Firebase Console > Project Settings > Web App.

## Firestore Collections

### adminUsers
```
Collection: adminUsers
Documents: {uid}
Fields:
  - uid: string (document ID)
  - email: string
  - displayName: string
  - photoURL: string (optional)
  - providerData: array (OAuth provider info)
  - createdAt: timestamp
  - lastLogin: timestamp
  - role: string (optional, always "admin")
```

### users
```
Collection: users
Documents: {uid}
Fields:
  - email: string
  - displayName: string
  - role: string ("user")
  - createdAt: timestamp
```

### tutorials (optional, for content)
```
Collection: tutorials
Documents: {tutorialId}
Fields:
  - title: string
  - description: string
  - content: string (markdown)
  - category: string
  - createdBy: string (uid of admin)
  - createdAt: timestamp
  - updatedAt: timestamp
```

## Security Rules

Firestore rules implement:
- OAuth users (adminUsers) can access their own admin profile
- Admins can read all admin profiles
- Regular users can access their own user profile
- No cross-role access
- Tutorials readable by all, writable only by admins

See `firestore.rules` for complete rules.

## Error Handling

The updated AuthContext includes human-friendly error messages:

```javascript
// Email already in use
setError('Email already in use')

// Weak password
setError('Password should be at least 6 characters')

// User not found
setError('No account found with this email')

// Wrong password
setError('Incorrect password')

// Too many login attempts
setError('Too many failed login attempts. Try again later.')

// Popup blocked
setError('Sign in popup was blocked. Please allow popups for this site.')

// Unauthorized domain
setError('This domain is not authorized. Check Firebase Console configuration.')
```

## Testing Your Setup

### Manual Testing Checklist
- [ ] Click "Sign in with Google" button
- [ ] Google popup appears
- [ ] Can authorize the app
- [ ] Redirected to /admin dashboard
- [ ] User appears in Firestore adminUsers collection
- [ ] Page refresh maintains auth state
- [ ] Logout button works
- [ ] Console shows no errors

### Browser Console Debugging
```javascript
// In browser console:
const { currentUser, userRole, isAdmin } = await useAuth()
// Returns current user, role, and admin status
```

## Best Practices

1. **Never log environment variables** - They contain sensitive credentials
2. **Use .env.local for local development** - It's in .gitignore
3. **Use environment secrets on production** - Vercel, Netlify, etc.
4. **Update last login** on successful authentication
5. **Cache user profile** in context to avoid repeated Firestore reads
6. **Handle async auth state** properly with loading state
7. **Validate user role** on protected routes
8. **Clean up auth listeners** to prevent memory leaks (already done with unsubscribe)

## Extending the System

### Adding Profile Uploads
```javascript
// Store profile picture in Cloud Storage
const storageRef = ref(storage, `profiles/${userId}/photo`);
await uploadBytes(storageRef, file);
const photoURL = await getDownloadURL(storageRef);
await updateProfilePicture(userId, photoURL);
```

### Adding More OAuth Providers
```javascript
// For Microsoft:
const provider = new OAuthProvider('microsoft.com');

// For Apple:
const provider = new OAuthProvider('apple.com');

// Same pattern as Google/GitHub OAuth
```

### Adding Email Verification
```javascript
// After signup:
await sendEmailVerification(auth.currentUser);

// Check verification status:
console.log(auth.currentUser.emailVerified);
```

### Adding Role-Based UI
```javascript
function AdminPanel() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminContent /> : <AccessDenied />;
}
```

## Troubleshooting Guide

### Issue: "This domain is not authorized"
**Solution:** Add your domain to Google Cloud Console OAuth credentials

### Issue: Google popup doesn't open
**Solution:** Allow popups in browser settings for your domain

### Issue: User not appearing in Firestore
**Solution:** Check browser console for errors, verify Firestore rules allow writes

### Issue: Auth state doesn't persist on reload
**Solution:** Ensure onAuthStateChanged listener is set up (it is in AuthContext)

### Issue: .env.local variables not loading
**Solution:** Restart dev server, ensure variable names start with VITE_

## Migration Path

If you have existing users:

1. **Email/password users** → stored in `users` collection
2. **OAuth users** → automatically stored in `adminUsers` collection
3. **To migrate users** → use `promoteUserToAdmin()` helper function

## Performance Considerations

- Auth state updates via context listener (not polling)
- Admin status checked once per auth state change
- Firestore data fetched on demand (not continuously)
- Profile data can be cached if needed for frequently accessed pages

## Next Steps

1. ✅ Complete AUTH_SETUP.md configuration
2. Implement profile picture uploads to Cloud Storage
3. Add email verification for email/password signups
4. Add password reset functionality
5. Set up custom roles beyond admin/user
6. Implement session timeout/refresh tokens
7. Add two-factor authentication

