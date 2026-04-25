# Architecture Overview

High-level architecture of the Tutorial Platform.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
├─────────────────────────────────────────────────────────┤
│                      React 18.2                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │ Components   │  │  Contexts    │  │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤  │
│  │ Home         │  │ Navbar       │  │ AuthContext  │  │
│  │ Login        │  │ Footer       │  │ ThemeContext │  │
│  │ Register     │  │ ProtectedRoute           │  │
│  │ Admin        │  │ ScrollAnimate            │  │
│  │ Tutorials    │  │ TypewriterText           │  │
│  │ TutorialDetail  │                         │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│                   React Router v6                        │
│              (Routing & Navigation)                      │
├─────────────────────────────────────────────────────────┤
│                    Tailwind CSS                          │
│         (Styling + Dark Mode Support)                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTPS API
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Firebase Services                       │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────┐  ┌────────────────────┐      │
│  │  Authentication    │  │  Firestore         │      │
│  ├────────────────────┤  ├────────────────────┤      │
│  │ • Google OAuth     │  │ • adminUsers       │      │
│  │ • Email/Password   │  │ • users            │      │
│  │ • GitHub OAuth     │  │ • tutorials        │      │
│  │ • Session Mgmt     │  │ • categories       │      │
│  └────────────────────┘  └────────────────────┘      │
│                                                        │
│  ┌────────────────────────────────────────┐           │
│  │  Cloud Storage                         │           │
│  ├────────────────────────────────────────┤           │
│  │ • Profile pictures                     │           │
│  │ • Tutorial assets                      │           │
│  └────────────────────────────────────────┘           │
│                                                        │
│  ┌────────────────────────────────────────┐           │
│  │  Security Rules                        │           │
│  ├────────────────────────────────────────┤           │
│  │ • Role-based access control            │           │
│  │ • Collection-level permissions         │           │
│  └────────────────────────────────────────┘           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Authentication Flow
```
User Login Request
        ↓
Firebase Authentication
        ↓
User Data Stored in Firestore
        ↓
AuthContext Updated
        ↓
Protected Routes Checked
        ↓
User Redirected Based on Role
```

### User Role System
```
┌─────────────────────────────────┐
│     User Authenticates          │
└──────────────┬──────────────────┘
               │
        ┌──────▼──────┐
        │ OAuth        │ Email/Password
        │ (Google/GH)  │
        └──────┬───────┘
               │
        ┌──────▼────────────────────┐
        │  Check Firebase Auth       │
        │  + Firestore Collection    │
        └──────┬─────────────────────┘
               │
        ┌──────▼──────────────────┐
        │  Assign Role             │
        │ • OAuth = Admin          │
        │ • Email = User           │
        └──────┬───────────────────┘
               │
        ┌──────▼────────────────────┐
        │  Store in Firestore       │
        │ • adminUsers (admin)      │
        │ • users (user)            │
        └──────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 18.2.0 | UI library |
| **Build Tool** | Vite | 5.0.8 | Dev server & bundler |
| **Routing** | React Router | v6 | Client-side routing |
| **Styling** | Tailwind CSS | 3.3.6 | Utility-first CSS |
| **State Management** | React Context | - | Global state |
| **Backend-as-a-Service** | Firebase | 10.7.1 | Auth, Database, Storage |
| **Authentication** | Firebase Auth | - | User management |
| **Database** | Cloud Firestore | - | NoSQL database |
| **Storage** | Cloud Storage | - | File storage |
| **Icons** | Lucide React | - | Icon library |
| **Markdown** | react-markdown | - | Content rendering |
| **Code Highlight** | react-syntax-highlighter | - | Syntax highlighting |

---

## Directory Structure

```
project-root/
├── src/
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point
│   ├── App.css                    # App styles
│   ├── index.css                  # Global styles
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx        # Auth state & logic
│   │   └── ThemeContext.jsx       # Theme state & logic
│   │
│   ├── pages/                     # Full-page components
│   │   ├── Home.jsx               # Homepage
│   │   ├── Login.jsx              # Login page
│   │   ├── Register.jsx           # Registration page
│   │   ├── AdminDashboard.jsx     # Admin panel
│   │   ├── Tutorials.jsx          # Tutorials list
│   │   └── TutorialDetail.jsx     # Single tutorial
│   │
│   ├── components/                # Reusable components
│   │   ├── Navbar.jsx             # Navigation bar
│   │   ├── Footer.jsx             # Footer
│   │   ├── ProtectedRoute.jsx     # Route guard
│   │   ├── ScrollAnimation.jsx    # Scroll effects
│   │   └── TypewriterText.jsx     # Typewriter effect
│   │
│   ├── firebase/
│   │   └── config.js              # Firebase setup
│   │
│   ├── utils/
│   │   └── firebaseHelpers.js     # Helper functions
│   │
│   └── assets/                    # Static files
│       └── images/
│
├── docs/                          # Documentation
│   ├── README.md                  # Docs index
│   ├── features/                  # Feature docs
│   ├── setup/                     # Setup guides
│   ├── architecture/              # Architecture
│   ├── api/                       # API reference
│   ├── components/                # Component docs
│   ├── database/                  # Database schema
│   └── guides/                    # Development guides
│
├── .github/
│   ├── copilot-instructions.md    # Agent instructions
│   ├── AGENTS.md                  # Custom agents
│   └── instructions/              # Specific instructions
│
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                 # Vite config
├── tailwind.config.js             # Tailwind config
├── postcss.config.js              # PostCSS config
├── firestore.rules                # Security rules
└── .env.local.example             # Env template
```

---

## State Management

### Global State (Context API)

#### AuthContext
```javascript
{
  currentUser: {
    uid: string,
    email: string,
    displayName: string,
    photoURL: string
  },
  userRole: "admin" | "user",
  isAdmin: boolean,
  loading: boolean,
  error: string,

  // Methods
  login(email, password),
  signup(email, password, displayName),
  logout(),
  loginWithGoogle(),
  loginWithGithub()
}
```

#### ThemeContext
```javascript
{
  theme: "light" | "dark",
  toggleTheme(),
  setTheme(theme)
}
```

---

## Component Hierarchy

```
App
├── Navbar
│   ├── Logo
│   ├── NavLinks
│   ├── ThemeToggle
│   └── UserMenu
├── Routes
│   ├── Home
│   │   ├── Hero
│   │   ├── Features
│   │   └── Footer
│   ├── Login
│   │   ├── LoginForm
│   │   └── OAuthButtons
│   ├── Register
│   │   ├── RegisterForm
│   │   └── OAuthButtons
│   ├── ProtectedRoute
│   │   └── AdminDashboard
│   │       ├── Sidebar
│   │       ├── UserManagement
│   │       ├── TutorialManagement
│   │       └── Analytics
│   ├── Tutorials
│   │   ├── TutorialList
│   │   └── Filters
│   └── TutorialDetail
│       ├── TutorialHeader
│       ├── MarkdownContent
│       └── Comments
└── Footer
```

---

## API Integration

### Firebase Services Used

#### Authentication
- `signInWithPopup(auth, provider)` - OAuth signin
- `createUserWithEmailAndPassword()` - Email signup
- `signInWithEmailAndPassword()` - Email login
- `signOut(auth)` - Logout
- `onAuthStateChanged(auth, callback)` - Session persistence

#### Firestore
- `collection(db, name)` - Get collection reference
- `doc(db, collection, id)` - Get document reference
- `setDoc()` - Create document
- `updateDoc()` - Update document
- `deleteDoc()` - Delete document
- `getDoc()` - Fetch document
- `getDocs()` - Fetch multiple documents
- `query()` - Build queries
- `where()` - Query conditions

#### Cloud Storage
- `ref(storage, path)` - Storage reference
- `uploadBytes()` - Upload file
- `downloadURL()` - Get download URL

---

## Security Architecture

### Firestore Rules
```
Rules by Collection:
├── adminUsers
│   ├── Read: Only self or any admin
│   └── Write: Only self (OAuth users)
├── users
│   ├── Read: Only self
│   └── Write: Only self (email users)
├── tutorials
│   ├── Read: Public
│   └── Write: Admin only
└── categories
    ├── Read: Public
    └── Write: Admin only
```

### Authentication Security
- ✅ OAuth providers handle credential security
- ✅ Firebase manages password hashing
- ✅ HTTPS-only communication
- ✅ Secure token storage by browser
- ✅ No credentials sent to backend
- ✅ Session tokens auto-expiring

---

## Performance Considerations

### Optimizations Implemented
- ✅ React Context for state (no prop drilling)
- ✅ Code splitting via React Router
- ✅ Tailwind CSS for minimal CSS output
- ✅ Dark mode with CSS variables
- ✅ Image optimization ready
- ✅ Lazy loading ready

### Potential Future Optimizations
- [ ] React.lazy() for route-based code splitting
- [ ] useMemo/useCallback for expensive operations
- [ ] Image lazy loading
- [ ] Pagination for large data sets
- [ ] Caching strategies for Firestore reads
- [ ] CDN for static assets

---

## Deployment Architecture

```
GitHub Repository
        ↓
    CI/CD Pipeline
        ↓
Build & Test
        ↓
    Production Build
        ↓
Firebase Hosting
        ↓
    CDN Distribution
        ↓
    User Browsers
```

---

## Related Documentation
- [System Design Diagrams](./SYSTEM_DESIGN.md)
- [Database Schema](../database/SCHEMA.md)
- [API Reference](../api/API_REFERENCE.md)
- [Development Workflow](../guides/DEVELOPMENT_WORKFLOW.md)

---

**Last Updated:** April 24, 2026
