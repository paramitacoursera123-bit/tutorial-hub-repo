# Tutorial Platform - Agent Instructions

AI agents working on this codebase should follow these patterns, conventions, and best practices.

---

## Project Overview

**Name:** Tutorial Platform (Dynamic Tutorial Website)
**Tech Stack:** React 18 + Vite + Firebase + Tailwind CSS
**Purpose:** A production-ready technical tutorial platform with secure authentication, admin dashboard, and content management
**Status:** In active development with Google OAuth authentication recently implemented

### Key Technologies
- **Frontend:** React 18.2.0, Vite 5.0.8, React Router v6
- **Backend:** Firebase (Auth, Firestore, Cloud Storage)
- **Styling:** Tailwind CSS 3.3.6, Lucide React icons
- **Content:** React Markdown with syntax highlighting
- **State:** React Context API (no Redux/Zustand)

---

## Directory Structure

```
src/
├── contexts/           # React Context for state management
│   ├── AuthContext.jsx    # Authentication state, user role, login methods
│   └── ThemeContext.jsx   # Dark/light mode theme management
├── pages/              # Full-page components (route pages)
│   ├── Home.jsx           # Homepage
│   ├── Login.jsx          # Login with Google OAuth + email/password
│   ├── Register.jsx       # User registration
│   ├── AdminDashboard.jsx # Admin-only dashboard
│   ├── Tutorials.jsx      # Tutorials listing/browsing
│   ├── TutorialDetail.jsx # Individual tutorial view
├── components/         # Reusable components (non-page)
│   ├── Navbar.jsx         # Navigation bar
│   ├── Footer.jsx         # Footer
│   ├── ProtectedRoute.jsx # Route guard for admin-only pages
│   ├── ScrollAnimation.jsx # Scroll-based animations
│   ├── TypewriterText.jsx # Typewriter text effect
├── firebase/          # Firebase configuration
│   └── config.js      # Firebase SDK initialization
├── utils/             # Utility functions
│   └── firebaseHelpers.js # User management helpers
├── assets/            # Static assets (images, icons, etc.)
├── App.jsx            # Root component
├── main.jsx           # Entry point
├── App.css            # Global app styles
└── index.css          # Tailwind + global CSS

Root files:
├── index.html         # HTML template
├── package.json       # Dependencies
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind configuration
├── postcss.config.js  # PostCSS configuration
├── .env.local.example # Firebase credentials template
└── .gitignore         # Git ignore rules
```

---

## Code Patterns & Conventions

### 1. Component Structure

**Pattern for Page Components:**
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PageName() {
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { /* context methods */ } = useAuth();
  const navigate = useNavigate();

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      // Action logic
      navigate('/destination');
    } catch (error) {
      setError('User-friendly error message');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* JSX */}
    </div>
  );
}

export default PageName;
```

**Key Points:**
- State management at component level (useState)
- Error state management with try-catch
- Loading state for async operations
- User-friendly error messages (not raw error messages)
- Console.error() for debugging
- Navigate to success page on completion

### 2. Styling Convention

**Tailwind CSS with dark mode support:**
```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-md">
  Content
</div>
```

**Reusable button classes:**
```jsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-danger">Danger</button>
<button className="btn disabled:opacity-50">Disabled</button>
```

**Card component pattern:**
```jsx
<div className="card">
  {/* Card content */}
</div>
```

**Form input pattern:**
```jsx
<input
  type="email"
  id="email"
  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
/>
```

### 3. Authentication Pattern (Context Hook)

**Usage in any component:**
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { currentUser, userRole, isAdmin, login, logout, error, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {currentUser && <p>Logged in as {currentUser.email}</p>}
      {isAdmin && <div>Admin section</div>}
      {error && <div className="error">{error}</div>}
    </>
  );
}
```

**Auth methods available:**
- `signup(email, password, displayName)` - Register new user
- `login(email, password)` - Email/password login
- `loginWithGoogle()` - Google OAuth sign-in
- `loginWithGithub()` - GitHub OAuth sign-in
- `logout()` - Sign out

**Auth state variables:**
- `currentUser` - Firebase User object (uid, email, displayName, photoURL, etc.)
- `userRole` - "admin" or "user"
- `isAdmin` - Boolean for easy admin checks
- `loading` - Auth state loading
- `error` - Last error message

### 4. Protected Routes Pattern

```jsx
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/AdminDashboard';

// In router configuration:
<Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
```

**ProtectedRoute component:**
- Checks if user is authenticated
- Optionally checks for admin role (adminOnly prop)
- Redirects to /login if not authenticated
- Redirects to / if user lacks admin permission

---

## Authentication System Details

### User Roles

**OAuth Users (Google/GitHub):**
- Stored in Firestore `adminUsers` collection
- Automatically granted "admin" role
- Can access `/admin` dashboard
- Have write access to tutorials and content

**Email/Password Users:**
- Stored in Firestore `users` collection
- Have "user" role (regular user)
- Can only access public pages
- No admin features

### Firestore Collections

**adminUsers:**
```javascript
{
  uid: "string",                    // Document ID, same as auth uid
  email: "user@gmail.com",
  displayName: "User Name",
  photoURL: "https://...",
  providerData: [
    {
      provider: "google.com",
      uid: "...",
      email: "...",
      displayName: "...",
      photoURL: "..."
    }
  ],
  createdAt: Timestamp,
  lastLogin: Timestamp
}
```

**users:**
```javascript
{
  email: "user@example.com",
  displayName: "User Name",
  role: "user",
  createdAt: Timestamp
}
```

### Environment Variables

**Required in `.env.local`:**
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

These are automatically loaded via `import.meta.env.VITE_*` in Firebase config.

---

## Common Tasks & Approaches

### Adding a New Page

1. Create file: `src/pages/NewPage.jsx`
2. Import React hooks and contexts needed
3. Follow component pattern (state, handlers, render)
4. Import in `src/App.jsx` and add to React Router
5. Add navigation link in `src/components/Navbar.jsx`

### Adding a New Reusable Component

1. Create file: `src/components/ComponentName.jsx`
2. Accept props for configuration
3. Use Tailwind classes for styling
4. Include dark mode support
5. Export as default
6. Import where needed

### Fetching User Data from Firestore

```jsx
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Fetch admin user
const userRef = doc(db, 'adminUsers', userId);
const userDoc = await getDoc(userRef);
if (userDoc.exists()) {
  const userData = userDoc.data();
  // Use userData
}
```

### Updating Firestore Data

```jsx
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const userRef = doc(db, 'adminUsers', userId);
await updateDoc(userRef, {
  displayName: 'New Name',
  updatedAt: serverTimestamp()
});
```

### Creating a New Firebase Collection

1. Use helper functions in `src/utils/firebaseHelpers.js`
2. Or import Firestore functions directly
3. Always include timestamps (createdAt, updatedAt)
4. Update Firestore security rules in `firestore.rules`
5. Test permissions locally before deploying

### Adding Error Messages

**Pattern:**
```jsx
try {
  setError('');
  // Async operation
} catch (error) {
  const errorMessage = error.code === 'auth/specific-error'
    ? 'User-friendly message'
    : error.message;
  setError(errorMessage);
}
```

**Always provide user-friendly messages instead of raw Firebase errors.**

---

## Best Practices

### Security
- ✅ Never log sensitive data (API keys, auth tokens, user passwords)
- ✅ Always use Firestore security rules (see `firestore.rules`)
- ✅ Validate user role on protected routes
- ✅ Don't expose Firebase credentials in code (use .env.local)
- ✅ Sanitize user input before displaying

### Performance
- ✅ Use React Context for global state (auth, theme)
- ✅ Avoid unnecessary re-renders (useCallback, useMemo when needed)
- ✅ Lazy load pages using React.lazy() if bundle size grows
- ✅ Optimize images before adding to assets
- ✅ Minimize Firestore reads with proper indexing

### Code Quality
- ✅ Keep components small and focused
- ✅ Extract reusable logic into utility functions
- ✅ Use descriptive variable names
- ✅ Add comments for complex logic
- ✅ Follow existing code style (check current files for patterns)
- ✅ Test locally before committing

### Accessibility
- ✅ Use semantic HTML (button, input, label tags)
- ✅ Add htmlFor attributes to labels
- ✅ Include aria-labels for icon-only buttons
- ✅ Ensure sufficient color contrast
- ✅ Support keyboard navigation

### Error Handling
- ✅ Always wrap async operations in try-catch
- ✅ Set loading state before async operations
- ✅ Clear error state on successful operations
- ✅ Log errors to console for debugging
- ✅ Display user-friendly error messages in UI

---

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page components | PascalCase | `HomePage.jsx`, `AdminDashboard.jsx` |
| Reusable components | PascalCase | `Navbar.jsx`, `ProtectedRoute.jsx` |
| Utilities | camelCase | `firebaseHelpers.js` |
| Context | PascalCase + Context | `AuthContext.jsx` |
| CSS files | matching-component | `App.css` (for App.jsx) |
| Config files | lowercase | `vite.config.js`, `tailwind.config.js` |
| Documentation | UPPERCASE.md | `README.md`, `AUTH_SETUP.md` |

---

## Development Workflow

### Starting Development
```bash
npm install           # Install dependencies once
npm run dev          # Start dev server on http://localhost:5173
```

### Building for Production
```bash
npm run build        # Build to dist/ folder
npm run preview      # Preview production build locally
```

### Linting
```bash
npm run lint         # Check code style (ESLint)
```

### Environment Setup
```bash
# Copy template to local env
cp .env.local.example .env.local

# Add your Firebase credentials to .env.local
# Then restart dev server
```

---

## Testing Checklist When Adding Features

- [ ] Feature works in development (npm run dev)
- [ ] No console errors (F12)
- [ ] Works in light and dark mode (check ThemeContext)
- [ ] Responsive on mobile (F12 → Device toolbar)
- [ ] Proper error handling with user-friendly messages
- [ ] Loading states show during async operations
- [ ] Authentication checks work (logged in / logged out / admin)
- [ ] Firestore data persists after page refresh
- [ ] Code follows project conventions

---

## Recent Implementations

### ✅ Google OAuth with Firebase (Latest)
- Location: `src/contexts/AuthContext.jsx`
- Features: Email/password + Google + GitHub OAuth
- Role system: OAuth users → admin, Email users → regular
- Documentation: See `AUTH_SETUP.md`, `IMPLEMENTATION_GUIDE.md`, `QUICKSTART.md`
- Firestore rules: See `firestore.rules`

---

## Common Issues & Solutions

### "Module not found" errors
- Verify file path in import statement
- Check file exists in the location
- Restart dev server after creating files

### Component not rendering
- Check if component is imported and exported correctly
- Verify JSX syntax (closing tags, parentheses)
- Check if route is configured in App.jsx

### Firestore data not saving
- Check Firestore security rules (firestore.rules)
- Verify user has proper role/permissions
- Check browser console for Firebase errors
- Ensure Firestore database is created

### Environment variables not loading
- Restart dev server after creating .env.local
- Variable names must start with VITE_
- Don't quote values in .env.local

### Dark mode not working
- Use `dark:` prefix in Tailwind classes
- Check that ThemeContext is provider in App.jsx
- Verify HTML root has `dark` class when needed

---

## Tips for AI Agents

### Do:
1. **Read existing code first** - Check similar components/pages for patterns
2. **Follow established conventions** - Match the style of existing files
3. **Use provided utilities** - Check `firebaseHelpers.js` before writing new functions
4. **Add user-friendly errors** - Never show raw Firebase error messages
5. **Test multiple scenarios** - Light/dark mode, mobile, authenticated/unauthenticated
6. **Include comments** - Especially for non-obvious logic
7. **Verify Firestore rules** - Before implementing data access features

### Don't:
1. **Don't add new dependencies** - Check if feature exists in current packages
2. **Don't hardcode values** - Use environment variables or constants
3. **Don't skip error handling** - All async operations need try-catch
4. **Don't ignore loading states** - Users need feedback during async operations
5. **Don't forget about auth** - Check user role before sensitive operations
6. **Don't create inline styles** - Use Tailwind classes
7. **Don't break existing features** - Test thoroughly before changing core files

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code quality
npm run lint            # Check code style

# Git workflow (post-implementation)
git status              # See changed files
git add .               # Stage all changes
git commit -m "message" # Commit with message
git push                # Push to remote
```

---

## Resources

- **Vite Docs:** https://vitejs.dev/guide/
- **React Docs:** https://react.dev/
- **React Router:** https://reactrouter.com/en/main
- **Firebase Docs:** https://firebase.google.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Firestore Security Rules:** https://firebase.google.com/docs/firestore/security/get-started

**Project Documentation:**
- See `QUICKSTART.md` for Firebase setup
- See `AUTH_SETUP.md` for authentication details
- See `IMPLEMENTATION_GUIDE.md` for technical architecture
- See `IMPLEMENTATION_SUMMARY.md` for what's implemented

---

## Last Updated
April 24, 2026 - Google OAuth & Firebase implementation complete, agent instructions generated
