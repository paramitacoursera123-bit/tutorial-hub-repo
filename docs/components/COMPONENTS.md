# Components Documentation

Complete reference for all React components in the project.

---

## Components Overview

```
App
├── AuthProvider (Context)
├── ThemeProvider (Context)
├── Navbar
├── MainRoutes
├── Footer
└── Protected Routes
    └── AdminDashboard
```

---

## Core Components

### 1. Navbar Component

**File:** `src/components/Navbar.jsx`

**Purpose:** Main navigation bar for the application

**Features:**
- ✅ Logo and branding
- ✅ Navigation links
- ✅ User authentication display
- ✅ Dark mode toggle
- ✅ Responsive mobile menu
- ✅ Logout functionality

**Props:** None (uses AuthContext and ThemeContext)

**Usage:**
```jsx
<Navbar />
```

**Dark Mode:**
- Fully supports dark mode
- Uses `dark:` Tailwind classes
- Toggles theme via ThemeContext

**Responsive:**
- Hamburger menu on mobile
- Full menu on desktop
- Touch-friendly on mobile

---

### 2. Footer Component

**File:** `src/components/Footer.jsx`

**Purpose:** Site footer with links and information

**Features:**
- ✅ Copyright information
- ✅ Quick links
- ✅ Social media links
- ✅ Contact information

**Props:** None

**Usage:**
```jsx
<Footer />
```

**Content Sections:**
- Quick Links
- Resources
- Social Media
- Copyright

---

### 3. ProtectedRoute Component

**File:** `src/components/ProtectedRoute.jsx`

**Purpose:** Route protection based on user authentication and role

**Props:**
```javascript
{
  children: React.ReactNode,    // Component to protect
  adminOnly?: boolean           // Require admin role
}
```

**Behavior:**
- ✅ Unauthenticated → Redirect to `/login`
- ✅ Authenticated but not admin → Redirect to `/`
- ✅ Admin → Show component

**Usage:**
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

**Loading State:**
- Shows loading spinner while checking auth
- Waits for AuthContext to load

---

### 4. ScrollAnimation Component

**File:** `src/components/ScrollAnimation.jsx`

**Purpose:** Animate elements as they scroll into view

**Features:**
- ✅ Fade-in animation
- ✅ Slide animations
- ✅ Customizable timing
- ✅ Intersection Observer API

**Props:**
```javascript
{
  children: React.ReactNode,
  variant?: 'fade' | 'slideUp' | 'slideDown',  // Animation type
  duration?: number                            // Duration in ms
}
```

**Usage:**
```jsx
<ScrollAnimation variant="slideUp" duration={600}>
  <div>Content that animates on scroll</div>
</ScrollAnimation>
```

---

### 5. TypewriterText Component

**File:** `src/components/TypewriterText.jsx`

**Purpose:** Typewriter text effect for hero sections

**Features:**
- ✅ Character-by-character typing
- ✅ Backspace effect
- ✅ Customizable speed
- ✅ Loop support

**Props:**
```javascript
{
  text: string,                              // Text to type
  speed?: number,                            // Typing speed in ms
  loop?: boolean                             // Loop animation
}
```

**Usage:**
```jsx
<TypewriterText 
  text="Welcome to Tutorial Platform" 
  speed={100}
  loop={true}
/>
```

---

## Page Components

### 1. Home Page

**File:** `src/pages/Home.jsx`

**Purpose:** Landing page / homepage

**Features:**
- ✅ Hero section
- ✅ Features overview
- ✅ Call-to-action buttons
- ✅ Responsive design
- ✅ Dark mode support

**Route:** `/` or `/home`

**State:**
- No local state (uses AuthContext)

**Used Components:**
- TypewriterText
- ScrollAnimation

---

### 2. Login Page

**File:** `src/pages/Login.jsx`

**Purpose:** User authentication

**Features:**
- ✅ Email/password login form
- ✅ Google OAuth button
- ✅ GitHub OAuth button
- ✅ Link to registration
- ✅ Error messages
- ✅ Loading states

**Route:** `/login`

**State:**
```javascript
{
  email: string,
  password: string,
  loading: boolean,
  error: string
}
```

**Auth Methods:**
- `login()` - Email/password login
- `loginWithGoogle()` - Google OAuth
- `loginWithGithub()` - GitHub OAuth

---

### 3. Register Page

**File:** `src/pages/Register.jsx`

**Purpose:** New user registration

**Features:**
- ✅ Email/password signup form
- ✅ Password confirmation
- ✅ Display name field
- ✅ Google OAuth option
- ✅ GitHub OAuth option
- ✅ Form validation
- ✅ Error messages

**Route:** `/register`

**State:**
```javascript
{
  displayName: string,
  email: string,
  password: string,
  confirmPassword: string,
  loading: boolean,
  error: string
}
```

**Form Validation:**
- Email format check
- Password length check (6+ chars)
- Password match check
- Display name required

---

### 4. Admin Dashboard

**File:** `src/pages/AdminDashboard.jsx`

**Purpose:** Admin control panel

**Features:**
- ✅ Admin-only access
- ✅ Dashboard layout
- ✅ User management section
- ✅ Tutorial management section
- ✅ Navigation sidebar

**Route:** `/admin`

**Auth Required:**
- Admin role only
- Protected via ProtectedRoute

**Sections:**
- Dashboard Overview
- User Management
- Tutorial Management
- Content Creation

---

### 5. Tutorials Page

**File:** `src/pages/Tutorials.jsx`

**Purpose:** Browse all tutorials

**Features:**
- ✅ Tutorial listing
- ✅ Search and filtering
- ✅ Category filtering
- ✅ Pagination (planned)
- ✅ Responsive grid

**Route:** `/tutorials`

**Auth Required:** None (public page)

**State:**
```javascript
{
  tutorials: array,
  selectedCategory: string,
  searchQuery: string,
  loading: boolean
}
```

---

### 6. Tutorial Detail Page

**File:** `src/pages/TutorialDetail.jsx`

**Purpose:** View individual tutorial

**Features:**
- ✅ Markdown rendering
- ✅ Code syntax highlighting
- ✅ Tutorial metadata
- ✅ Back navigation
- ✅ Related tutorials (planned)

**Route:** `/tutorial/:id`

**Auth Required:** None (public if published)

**URL Params:**
- `id` - Tutorial document ID

**State:**
```javascript
{
  tutorial: object,
  loading: boolean,
  error: string
}
```

---

## Context Components

### 1. AuthContext

**File:** `src/contexts/AuthContext.jsx`

**Purpose:** Global authentication state management

**Provider:** `<AuthProvider>`

**Hook:** `useAuth()`

**State & Methods:**
```javascript
{
  // State
  currentUser,        // Firebase User
  userRole,          // "admin" | "user"
  isAdmin,           // boolean
  loading,           // boolean
  error,             // string

  // Methods
  login(email, password),
  signup(email, password, displayName),
  logout(),
  loginWithGoogle(),
  loginWithGithub()
}
```

**Usage:**
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { currentUser, login, logout } = useAuth();
  // ...
}
```

---

### 2. ThemeContext

**File:** `src/contexts/ThemeContext.jsx`

**Purpose:** Global theme state management

**Provider:** `<ThemeProvider>`

**Hook:** `useTheme()`

**State & Methods:**
```javascript
{
  theme: "light" | "dark",
  toggleTheme(),
  setTheme(theme: string)
}
```

**Usage:**
```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  // ...
}
```

---

## Component Styling

### Tailwind CSS Classes

**Button Styles:**
```jsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-danger">Danger</button>
```

**Card Styles:**
```jsx
<div className="card">
  {/* content */}
</div>
```

**Dark Mode:**
```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* content */}
</div>
```

**Responsive:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* responsive grid */}
</div>
```

---

## Component Patterns

### State Management Pattern
```jsx
function MyComponent() {
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { /* context */ } = useAuth();

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      // Action logic
    } catch (error) {
      setError('User-friendly message');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* content */}
    </div>
  );
}
```

### Form Pattern
```jsx
<form onSubmit={handleSubmit} className="space-y-4">
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <button type="submit" className="btn btn-primary" disabled={loading}>
    {loading ? 'Loading...' : 'Submit'}
  </button>
  {error && <div className="text-red-500">{error}</div>}
</form>
```

---

## Creating New Components

### Template
```jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState('');
  const { /* context */ } = useAuth();

  const handleEvent = () => {
    // Handler logic
  };

  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

### Best Practices
- ✅ Use descriptive component names
- ✅ Include proper error handling
- ✅ Support dark mode
- ✅ Make responsive
- ✅ Memoize if needed (useCallback, useMemo)
- ✅ Add comments for complex logic
- ✅ Use PropTypes or TypeScript for props
- ✅ Test on mobile and desktop

---

## Component Testing Checklist

Before using any component, verify:
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Props working correctly
- [ ] Error states shown
- [ ] Loading states shown
- [ ] Accessibility (keyboard nav, labels)

---

## Related Documentation
- [Development Workflow](../guides/DEVELOPMENT_WORKFLOW.md)
- [Styling Guide](../guides/STYLING.md)
- [Architecture](../architecture/ARCHITECTURE.md)

---

**Last Updated:** April 24, 2026
