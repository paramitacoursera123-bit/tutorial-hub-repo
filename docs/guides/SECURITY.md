# Security Guide

Security considerations and best practices for the Tutorial Platform.

---

## Overview

The Tutorial Platform implements security at multiple levels:
- ✅ **Authentication** - Firebase Auth with OAuth and email/password
- ✅ **Authorization** - Role-based access control (RBAC)
- ✅ **Data Security** - Firestore Security Rules
- ✅ **Transport Security** - HTTPS encryption
- ✅ **Environment Security** - Environment variables for credentials

---

## Authentication Security

### Firebase Authentication
- ✅ No plaintext passwords stored
- ✅ Passwords hashed using bcrypt
- ✅ Automatic session tokens
- ✅ OAuth handled by Firebase
- ✅ Multi-factor authentication ready

### OAuth Providers
- ✅ Google OAuth - Verified Google integration
- ✅ GitHub OAuth - Ready for configuration
- ✅ Additional providers (Microsoft, Apple) - Can be added

### Session Management
- ✅ Automatic session persistence
- ✅ Secure token storage by browser
- ✅ Auto-logout on sign out
- ✅ Session timeout (can be configured)

### Best Practices
- ✅ Always validate user input
- ✅ Never log sensitive data
- ✅ Use HTTPS only
- ✅ Keep dependencies updated
- ✅ Regular security audits

---

## Authorization (RBAC)

### Role Hierarchy

```
User Roles:
├── admin (OAuth users)
│   ├── Create tutorials
│   ├── Edit tutorials
│   ├── Delete tutorials
│   ├── View analytics
│   ├── Manage users
│   └── Access /admin dashboard
│
└── user (Email/password users)
    ├── View public tutorials
    ├── Update own profile
    └── Cannot access admin features
```

### Role Assignment

**Admin Role:**
- Assigned automatically on Google/GitHub OAuth
- User stored in `adminUsers` collection
- Cannot be manually downgraded (by user)

**User Role:**
- Assigned on email/password signup
- User stored in `users` collection
- No admin features by default

### Role Enforcement

```javascript
// In routes
<Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

// In ProtectedRoute component
if (adminOnly && !isAdmin) {
  navigate('/');  // Redirect non-admins
}
```

---

## Firestore Security Rules

### Rules File Location
`/firestore.rules` in project root

### Collection-Level Security

#### adminUsers Collection
```
match /adminUsers/{document=**} {
  // Read: Own document or any admin
  allow read: if request.auth.uid == resource.id 
    || request.auth.uid in get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == 'admin';
  
  // Write: Own document only
  allow write: if request.auth.uid == document.id;
}
```

**Permissions:**
- Users can read own profile
- Admins can read all admin profiles
- Users can only write own profile

#### users Collection
```
match /users/{document=**} {
  // Read: Own document only
  allow read: if request.auth.token.email == resource.data.email;
  
  // Write: Own document only (no role change)
  allow write: if request.auth.token.email == resource.data.email 
    && resource.data.role == 'user';
}
```

**Permissions:**
- Users can only read own profile
- Users can only update own profile
- Users cannot change their role

#### tutorials Collection
```
match /tutorials/{document=**} {
  // Read: Public (published = true)
  allow read: if resource.data.published == true;
  
  // Write: Admin only
  allow write: if get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == 'admin';
}
```

**Permissions:**
- Everyone can read published tutorials
- Only admins can create/edit/delete tutorials

#### categories Collection
```
match /categories/{document=**} {
  // Read: Public
  allow read: if true;
  
  // Write: Admin only
  allow write: if get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == 'admin';
}
```

---

## Deploying Security Rules

### Step 1: Update firestore.rules
Edit `/firestore.rules` with your rules

### Step 2: Deploy to Firebase
```bash
# Using Firebase CLI
firebase deploy --only firestore:rules
```

### Step 3: Test Rules
In Firebase Console:
- Go to Firestore → Rules
- Click "Test" to verify rules

---

## Environment Variables

### Secure Credential Storage

**File:** `.env.local` (in .gitignore)

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Best Practices
- ✅ Never commit `.env.local`
- ✅ Never share credentials
- ✅ Use different Firebase projects for dev/prod
- ✅ Rotate API keys regularly
- ✅ Use service accounts for backend

### Development vs Production
```env
# Development
VITE_FIREBASE_PROJECT_ID=project-dev
VITE_API_URL=http://localhost:3000

# Production
VITE_FIREBASE_PROJECT_ID=project-prod
VITE_API_URL=https://api.example.com
```

---

## Code Security

### Never Store Sensitive Data

❌ **WRONG:**
```javascript
const apiKey = "AIzaSyC...";  // Don't hardcode
const password = "user-password";  // Never store
```

✅ **RIGHT:**
```javascript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;  // From env
// Password is handled by Firebase Auth
```

### Input Validation

✅ **Always validate user input:**
```javascript
// Validate email format
if (!email.includes('@')) {
  setError('Invalid email');
  return;
}

// Validate password length
if (password.length < 6) {
  setError('Password too short');
  return;
}

// Sanitize display name (no XSS)
const sanitizedName = displayName.replace(/<[^>]*>/g, '');
```

### Error Messages

❌ **WRONG:**
```javascript
catch (error) {
  setError(error.message);  // "auth/email-already-in-use"
}
```

✅ **RIGHT:**
```javascript
catch (error) {
  if (error.code === 'auth/email-already-in-use') {
    setError('Email already registered');
  } else {
    setError('An error occurred. Please try again.');
  }
}
```

### Never Log Sensitive Data

✅ **Safe logging:**
```javascript
console.log('User UID:', user.uid);         // OK
console.log('User email:', user.email);     // OK
console.error('Auth failed:', error.code);  // OK
```

❌ **Avoid logging:**
```javascript
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY);  // NO!
console.log('Password:', password);                              // NO!
console.log('Full user:', currentUser);                          // NO!
```

---

## HTTPS & Transport Security

### Development
- ✅ Uses `http://localhost` (fine for dev)
- ✅ Firestore connections are secure (Firebase SDK)

### Production
- ✅ Always use HTTPS
- ✅ Firebase Hosting provides HTTPS automatically
- ✅ HSTS headers enabled by default

### Best Practices
- ✅ Never send credentials over HTTP
- ✅ Always use secure WebSocket connections
- ✅ Configure CORS properly
- ✅ Use secure cookies (HttpOnly, Secure flags)

---

## User Data Privacy

### What Data is Stored

**User Profile:**
- Email address
- Display name
- Profile picture URL (from OAuth)
- Account creation date
- Last login date

**User Activity:**
- View count on tutorials (aggregated)
- No browsing history stored
- No personal data beyond profile

### Data Retention

- ✅ User data stored indefinitely (unless deleted)
- ✅ Logs retained for 30 days
- ✅ Backups retained for 90 days

### Data Deletion

```javascript
// Delete user account (Firebase & Firestore)
async function deleteUserAccount(userId) {
  // Delete Firebase Auth user
  await deleteUser(auth.currentUser);
  
  // Delete Firestore user document
  await deleteDoc(doc(db, 'users', userId));
  // OR
  await deleteDoc(doc(db, 'adminUsers', userId));
}
```

---

## Dependency Security

### Keep Dependencies Updated
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update specific package
npm install package-name@latest
```

### Security Audit
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Commonly Used Dependencies
- `react` - UI library
- `firebase` - Backend services
- `react-router-dom` - Routing
- `tailwindcss` - Styling
- All regularly updated with security patches

---

## API Security

### Never Expose Secrets
❌ **WRONG:**
```javascript
// Sending API key to client
fetch(`/api/data?apiKey=${API_KEY}`);
```

✅ **RIGHT:**
```javascript
// Use environment variables
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY
};
// Firebase SDK handles secure communication
```

### Rate Limiting
- ✅ Firebase Auth has built-in rate limiting
- ✅ Firestore has quotas per project
- ✅ No custom rate limiting needed for MVP

### CORS Configuration
```javascript
// Firebase handles CORS automatically
// Requests to Firestore are properly authorized
```

---

## Security Checklist

### Before Deployment

- [ ] `.env.local` NOT committed to git
- [ ] Firestore rules deployed to production
- [ ] No hardcoded credentials
- [ ] Error messages don't leak sensitive info
- [ ] Password requirements enforced (6+ chars)
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Firebase project security settings reviewed
- [ ] OAuth providers configured for production domain

### Regular Maintenance

- [ ] Update npm dependencies monthly
- [ ] Run security audit (`npm audit`)
- [ ] Review Firebase security rules quarterly
- [ ] Check Firebase Console for security warnings
- [ ] Monitor user complaints about security
- [ ] Rotate API keys annually

### Incident Response

If security breach suspected:
1. Check Firebase Console for auth anomalies
2. Review Firestore rules access logs
3. Check billing for unusual activity
4. Invalidate all sessions
5. Force users to reset passwords
6. Update security rules if needed
7. Post-incident analysis

---

## Compliance

### Data Protection
- GDPR ready (with user consent)
- CCPA compatible
- Data deletion on request

### Terms of Service
Should cover:
- User responsibilities
- Account security
- Data privacy
- Acceptable use
- Liability limits

---

## Resources

- [Firebase Security Guide](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)
- [Firebase Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

## Questions?

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- See [Firestore Guide](./FIRESTORE.md)
- Review [Database Schema](../database/SCHEMA.md)

---

**Last Updated:** April 24, 2026
