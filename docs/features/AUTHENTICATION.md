# Authentication Feature

Comprehensive guide to the authentication system.

---

## Overview

The Tutorial Platform uses a hybrid authentication system:
- **Google OAuth** - One-click authentication for admins
- **Email/Password** - Traditional registration for regular users
- **GitHub OAuth** - Ready for configuration (admin roles)

All authentication is handled by Firebase Authentication with Firestore for user profile storage.

---

## Architecture

### Authentication Flow

#### Google OAuth Flow
```
User clicks "Sign in with Google"
         ↓
Google OAuth popup appears
         ↓
User authorizes app
         ↓
Google sends user data to Firebase
         ↓
Firebase creates/updates user
         ↓
User stored in Firestore `adminUsers` collection
         ↓
Admin role automatically assigned
         ↓
Redirect to `/admin` dashboard
```

#### Email/Password Flow
```
User enters email, password, display name
         ↓
Validation checks performed
         ↓
Firebase creates user account
         ↓
User stored in Firestore `users` collection
         ↓
Regular user role assigned
         ↓
Automatic login after signup
         ↓
Redirect to home page
```

#### Login Flow
```
User enters credentials (email + password OR OAuth)
         ↓
Firebase authenticates user
         ↓
Role determined from Firestore collection
         ↓
Auth state updated in Context
         ↓
Redirect based on role
         - Admin → /admin dashboard
         - User → /home or previous page
```

---

## User Roles

### Admin Role (OAuth Users)
- **How Assigned:** Automatically on Google/GitHub OAuth login
- **Storage:** Firestore `adminUsers` collection
- **Permissions:**
  - Access `/admin` dashboard
  - Create new tutorials
  - Edit existing tutorials
  - Delete tutorials
  - Manage users
  - View analytics

### User Role (Email/Password Users)
- **How Assigned:** On email/password signup
- **Storage:** Firestore `users` collection
- **Permissions:**
  - Browse public tutorials
  - View tutorial details
  - No admin features
  - No content creation

---

## User Profile Data

### OAuth Users (adminUsers collection)
```javascript
{
  uid: "firebase-uid",                    // Firebase Auth UID
  email: "user@gmail.com",                // Email address
  displayName: "John Doe",                // Display name
  photoURL: "https://example.com/...",   // Profile picture
  role: "admin",                          // Always "admin" for OAuth
  providerData: [
    {
      provider: "google.com",
      uid: "google-uid",
      email: "user@gmail.com",
      displayName: "John Doe",
      photoURL: "https://..."
    }
  ],
  createdAt: Timestamp,                   // Account creation time
  lastLogin: Timestamp                    // Last login time
}
```

### Email Users (users collection)
```javascript
{
  email: "user@example.com",              // Email address
  displayName: "Jane Smith",              // Display name
  role: "user",                           // Always "user"
  createdAt: Timestamp,                   // Account creation time
  lastLogin: Timestamp                    // Last login time
}
```

---

## Implementation Details

### File Structure
```
src/
├── contexts/
│   └── AuthContext.jsx          # Central auth logic
├── pages/
│   ├── Login.jsx                # Login page
│   └── Register.jsx             # Registration page
├── components/
│   └── ProtectedRoute.jsx       # Route protection
├── firebase/
│   └── config.js                # Firebase setup
└── utils/
    └── firebaseHelpers.js       # Auth helper functions
```

### AuthContext Hook

Available methods and state:
```javascript
const {
  // State
  currentUser,        // Firebase User object
  userRole,          // "admin" or "user"
  isAdmin,           // Boolean
  loading,           // Loading state
  error,             // Last error message

  // Methods
  login,             // Email/password login
  signup,            // Email/password signup
  logout,            // Sign out
  loginWithGoogle,   // Google OAuth
  loginWithGithub    // GitHub OAuth (configured)
} = useAuth();
```

### Usage Example
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { currentUser, isAdmin, login, logout } = useAuth();

  return (
    <>
      {currentUser && <p>Welcome, {currentUser.displayName}</p>}
      {isAdmin && <div>Admin Section</div>}
      {!currentUser && <button onClick={login}>Login</button>}
      {currentUser && <button onClick={logout}>Logout</button>}
    </>
  );
}
```

---

## Error Handling

### Common Auth Errors

| Error | Cause | Message Shown |
|-------|-------|---------------|
| `auth/email-already-in-use` | Email already registered | "Email already in use" |
| `auth/weak-password` | Password too weak | "Password must be at least 6 characters" |
| `auth/user-not-found` | Email not registered | "User not found" |
| `auth/wrong-password` | Incorrect password | "Incorrect password" |
| `auth/too-many-requests` | Too many failed attempts | "Too many login attempts. Try again later" |
| `auth/popup-blocked` | Browser blocked OAuth popup | "Sign in popup was blocked. Enable popups" |
| `auth/unauthorized-domain` | Domain not in Firebase config | "This domain is not authorized" |

All errors are converted to user-friendly messages before display.

---

## Security Features

### Password Requirements
- Minimum 6 characters
- Firebase enforces additional complexity rules
- No plaintext storage (Firebase handles hashing)

### OAuth Scopes
- **Google OAuth:**
  - `profile` - Access profile information
  - `email` - Access email address
- **GitHub OAuth:**
  - Public profile access
  - Email access

### Secure Practices
- ✅ Credentials stored securely by Firebase
- ✅ No sensitive data logged
- ✅ HTTPS-only communication
- ✅ Environment variables for config
- ✅ Firestore rules protect data
- ✅ Role-based access control

---

## Configuration

### Firebase Setup Required
1. Create Firebase project
2. Enable Google OAuth provider
3. Enable Email/Password authentication
4. Optional: Enable GitHub OAuth
5. Configure authorized domains
6. Add credentials to `.env.local`

### Environment Variables
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## Login Pages

### Login Page (`/login`)
Allows users to:
- Sign in with Google OAuth
- Sign in with email/password
- Navigate to registration

### Registration Page (`/register`)
Allows users to:
- Sign up with email/password
- Set display name
- Confirm password
- Sign up with Google OAuth

---

## Protected Routes

### ProtectedRoute Component
```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

**Behavior:**
- Unauthenticated → Redirect to `/login`
- Authenticated but not admin → Redirect to `/`
- Admin → Show component

---

## Session Management

### Auto-Login
- App checks Firebase auth state on load
- If user logged in, automatically restores session
- No re-login required on page refresh

### Logout
- Clears Firebase auth session
- Clears user state
- Redirects to home page
- Clears all auth context data

### Session Persistence
- Firebase handles session storage
- Uses browser's secure storage
- Survives browser restart
- Cleared on logout

---

## Testing Authentication

### Test Google OAuth
1. Go to `/login`
2. Click "Sign in with Google"
3. Authorize with test account
4. Should redirect to `/admin`
5. Check Firestore `adminUsers` collection

### Test Email/Password
1. Go to `/register`
2. Enter email, password, display name
3. Submit form
4. Should auto-login and redirect to `/`
5. Check Firestore `users` collection

### Test Session Persistence
1. Login with any method
2. Refresh page
3. Should stay logged in
4. Check `/admin` dashboard (if admin)

---

## Troubleshooting

### "Google popup blocked"
- **Cause:** Browser or adblocker blocked popup
- **Solution:** Allow popups for this site or disable adblocker

### "Email already in use"
- **Cause:** Email already registered
- **Solution:** Use different email or login with existing account

### "Unauthorized domain"
- **Cause:** Domain not in Firebase authorized list
- **Solution:** Add domain in Firebase Console → Authentication → Settings

### "Wrong password"
- **Cause:** Incorrect password entered
- **Solution:** Check password or use "Forgot Password" (when available)

### Session lost after logout
- **Cause:** Normal behavior
- **Solution:** Login again, this is expected

---

## Related Documentation
- [Firestore Guide](../guides/FIRESTORE.md)
- [Security Guide](../guides/SECURITY.md)
- [Database Schema](../database/SCHEMA.md)
- [Authentication Guide](../guides/AUTHENTICATION.md)

---

**Last Updated:** April 24, 2026
