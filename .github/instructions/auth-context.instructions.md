---
description: 'Use when: modifying authentication, login flows, user roles, or Firebase auth methods in AuthContext.jsx'
applyTo: 'src/contexts/AuthContext.jsx'
---

# AuthContext.jsx - Authentication System

## Overview

This file manages all authentication logic using Firebase and React Context. It's the single source of truth for user authentication state across the app.

## Key Exports

```javascript
export function useAuth()           // Hook to access auth context anywhere
export function AuthProvider({ children })  // Provider component for App.jsx
```

## Auth State Variables (from useAuth())

- **currentUser**: Firebase User object with uid, email, displayName, photoURL, providerData
- **userRole**: "admin" (OAuth users) or "user" (email/password users)
- **loading**: Boolean - true while checking auth state on app load
- **error**: String - last error message (cleared on success)
- **isAdmin**: Boolean shorthand for userRole === 'admin'

## Authentication Methods (from useAuth())

### signup(email, password, displayName)
- Creates new email/password user
- Stores user in Firestore `users` collection with role: "user"
- Throws error if email already exists or password too weak
- User-friendly error messages included

### login(email, password)
- Signs in with email/password
- Returns Firebase User object
- User-friendly error messages (wrong password, user not found, etc.)

### loginWithGoogle()
- Opens Google OAuth popup
- Automatically stores user in Firestore `adminUsers` collection
- All OAuth users get "admin" role
- Includes proper scopes (profile, email)
- Error handling for popup blocks, unauthorized domains, etc.

### loginWithGithub()
- Opens GitHub OAuth popup
- Same flow as Google OAuth (stores in adminUsers as admin)
- Error handling for OAuth failures

### logout()
- Signs out current user
- Clears currentUser and userRole state
- Redirects to login page (usually handled by component)

## Internal Helper Functions

### addAdminUser(user)
- Called after successful OAuth login
- Creates/updates user in Firestore `adminUsers` collection
- Stores: uid, email, displayName, photoURL, providerData, timestamps
- Returns true/false for success/failure

### checkAdminStatus(uid)
- Called by onAuthStateChanged listener
- Checks if user exists in `adminUsers` collection
- Returns true if admin, false otherwise
- Used to set userRole on app startup

## Error Handling Pattern

All methods use try-catch with user-friendly messages:
```javascript
try {
  setError(null);  // Clear previous errors
  // Async operation
} catch (err) {
  const errorMessage = err.code === 'auth/specific-code'
    ? 'User-friendly message'
    : err.message;
  setError(errorMessage);
  throw err;  // Re-throw so component can handle
}
```

## Authentication State Lifecycle

1. **App Mount**: `onAuthStateChanged` listener set up
2. **Pending**: loading = true, checking Firebase session
3. **Authenticated**: currentUser set, role checked, loading = false
4. **Unauthenticated**: currentUser = null, loading = false
5. **Auth Change**: Listener fires again, state updated

## When to Modify This File

### Adding a New OAuth Provider (Facebook, Microsoft, etc.)
```javascript
async function loginWithFacebook() {
  try {
    setError(null);
    const provider = new FacebookAuthProvider();  // (hypothetical)
    const result = await signInWithPopup(auth, provider);
    await addAdminUser(result.user);
    return result;
  } catch (err) {
    setError('Error message');
    throw err;
  }
}
```

### Adding New User Metadata
Update `addAdminUser()` to store additional fields:
```javascript
await setDoc(adminUserRef, {
  // ... existing fields
  customField: value,
  lastLoginAt: new Date()
}, { merge: true });
```

### Changing Role Assignment Logic
Modify `checkAdminStatus()` or add new role checking logic in `onAuthStateChanged`.

### Improving Error Messages
Update error message mappings in catch blocks for better user feedback.

## Dependencies

- React: `useState`, `useContext`, `createContext`, `useEffect`
- Firebase Auth: `signInWithPopup`, `signOut`, `onAuthStateChanged`, `GoogleAuthProvider`, `GithubAuthProvider`, `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`
- Firebase Firestore: `doc`, `setDoc`, `getDoc`
- Config: `auth`, `db` from `../firebase/config`

## Testing Checklist

- [ ] signup() creates user in Firestore with correct role
- [ ] login() with correct email/password works
- [ ] login() with wrong credentials shows friendly error
- [ ] loginWithGoogle() opens popup and saves to adminUsers
- [ ] OAuth users get admin role
- [ ] Email users get user role
- [ ] logout() clears auth state
- [ ] Auth state persists on page refresh
- [ ] Error messages are user-friendly
- [ ] No errors in console

## Related Files

- `src/pages/Login.jsx` - Uses loginWithGoogle(), login()
- `src/pages/Register.jsx` - Uses signup()
- `src/components/ProtectedRoute.jsx` - Uses userRole to check permissions
- `src/firebase/config.js` - Firebase initialization
- `src/utils/firebaseHelpers.js` - Additional user management functions
- `firestore.rules` - Database access rules based on roles
