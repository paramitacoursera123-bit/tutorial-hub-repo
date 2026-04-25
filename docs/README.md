# Documentation Hub

Welcome to the Tutorial Platform documentation! This directory contains comprehensive guides and references for the entire project.

---

## 📚 Quick Navigation

### 🚀 Getting Started
- [Project Overview](#project-overview)
- [Features Overview](./features/FEATURES.md)
- [Quick Start Setup](./setup/QUICKSTART.md)
- [Development Environment](./setup/ENVIRONMENT.md)

### 🏗️ Architecture & Design
- [Architecture Overview](./architecture/ARCHITECTURE.md)
- [System Diagram](./architecture/SYSTEM_DESIGN.md)
- [Database Schema](./database/SCHEMA.md)
- [API Reference](./api/API_REFERENCE.md)

### 💻 Development
- [Component Guide](./components/COMPONENTS.md)
- [Authentication Guide](./guides/AUTHENTICATION.md)
- [Firestore Guide](./guides/FIRESTORE.md)
- [Development Workflow](./guides/DEVELOPMENT_WORKFLOW.md)

### 🔒 Operations
- [Security & Rules](./guides/SECURITY.md)
- [Deployment Checklist](./guides/DEPLOYMENT.md)
- [Troubleshooting](./guides/TROUBLESHOOTING.md)

---

## 📋 Project Overview

**Tutorial Platform** is a production-ready technical tutorial website with:

### Core Features ✨
- 🔐 **Authentication** - Google OAuth + Email/Password signin
- 👥 **Role-Based Access** - Admin and User roles with different permissions
- 📚 **Tutorial Management** - Create, read, and organize tutorials
- 🎨 **Dark Mode** - Full light/dark theme support
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ☁️ **Cloud Storage** - Firebase Firestore and Cloud Storage
- 🔒 **Security** - Firestore security rules with role-based access

### Tech Stack 🛠️
| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18.2.0 + Vite 5.0.8 |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **Styling** | Tailwind CSS 3.3.6 |
| **Routing** | React Router v6 |
| **State** | React Context API |
| **Build** | Vite |

---

## 📂 Documentation Structure

```
docs/
├── README.md                          # This file
├── features/                          # Feature documentation
│   ├── FEATURES.md                    # All features overview
│   ├── AUTHENTICATION.md              # Auth feature details
│   ├── TUTORIALS.md                   # Tutorial system
│   └── DASHBOARD.md                   # Admin dashboard
├── setup/                             # Setup & configuration
│   ├── QUICKSTART.md                  # 5-minute setup
│   ├── ENVIRONMENT.md                 # Environment setup
│   ├── FIREBASE_CONFIG.md             # Firebase configuration
│   └── IDE_SETUP.md                   # IDE configuration
├── architecture/                      # System design
│   ├── ARCHITECTURE.md                # Overall architecture
│   ├── SYSTEM_DESIGN.md               # System diagrams
│   └── FLOW_DIAGRAMS.md               # Flow diagrams
├── api/                               # API documentation
│   ├── API_REFERENCE.md               # Firebase API reference
│   ├── FIRESTORE_API.md               # Firestore operations
│   └── HELPERS.md                     # Helper functions
├── components/                        # Component reference
│   ├── COMPONENTS.md                  # Component overview
│   └── [Detailed component docs]
├── database/                          # Database documentation
│   ├── SCHEMA.md                      # Collection schema
│   ├── COLLECTIONS.md                 # All collections
│   └── INDEXES.md                     # Database indexes
└── guides/                            # Development guides
    ├── AUTHENTICATION.md              # Auth implementation
    ├── FIRESTORE.md                   # Working with Firestore
    ├── SECURITY.md                    # Security & rules
    ├── DEVELOPMENT_WORKFLOW.md        # Dev workflow
    ├── DEPLOYMENT.md                  # Deployment checklist
    └── TROUBLESHOOTING.md             # Common issues
```

---

## 🎯 Common Tasks

### I want to...

**Set up the project locally**
→ Read [Quick Start Setup](./setup/QUICKSTART.md)

**Understand the authentication system**
→ Read [Authentication Guide](./guides/AUTHENTICATION.md)

**Build a new feature**
→ Read [Development Workflow](./guides/DEVELOPMENT_WORKFLOW.md)

**Deploy the application**
→ Read [Deployment Checklist](./guides/DEPLOYMENT.md)

**Add new data to Firestore**
→ Read [Firestore Guide](./guides/FIRESTORE.md)

**Understand the codebase structure**
→ Read [Architecture Overview](./architecture/ARCHITECTURE.md)

**See all components available**
→ Read [Component Guide](./components/COMPONENTS.md)

**Troubleshoot an issue**
→ Read [Troubleshooting](./guides/TROUBLESHOOTING.md)

---

## 🚀 Key Features

### 1. Authentication System ✅
- ✅ Google OAuth integration
- ✅ Email/Password authentication
- ✅ GitHub OAuth ready (config needed)
- ✅ Role-based authorization (Admin/User)
- ✅ Persistent session management
- ✅ User profile management

**Status:** Production ready  
**Documentation:** [Authentication Guide](./guides/AUTHENTICATION.md)

### 2. Tutorial Management ✅
- ✅ Create tutorials (admin only)
- ✅ Browse tutorials (public)
- ✅ View tutorial details
- ✅ Markdown rendering with code highlighting
- ✅ Category organization
- ✅ Search and filtering

**Status:** In development  
**Documentation:** [Tutorial System](./features/TUTORIALS.md)

### 3. Admin Dashboard ✅
- ✅ Dashboard interface
- ✅ User management
- ✅ Tutorial management
- ✅ Content creation tools
- ✅ Analytics overview

**Status:** In development  
**Documentation:** [Admin Dashboard](./features/DASHBOARD.md)

### 4. User Management ✅
- ✅ User registration
- ✅ User profiles
- ✅ Role assignment
- ✅ Admin user management

**Status:** Core features complete  
**Documentation:** [Features Overview](./features/FEATURES.md)

---

## 🔐 Security

All data is protected with:
- Firebase Authentication for user verification
- Firestore Security Rules for data access control
- Role-based authorization (admin/user)
- HTTPS encryption in transit
- Secure environment variable handling

**Read:** [Security Guide](./guides/SECURITY.md)

---

## 📊 Current Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Google OAuth | ✅ Complete | Fully implemented and tested |
| Email/Password Auth | ✅ Complete | Fully implemented and tested |
| Role-Based Access | ✅ Complete | Admin/User roles working |
| User Profiles | ✅ Complete | Profile storage and management |
| Firestore Setup | ✅ Complete | Database collections ready |
| Security Rules | ✅ Complete | Role-based rules implemented |
| Components | ✅ Partial | Core components ready |
| Tutorials System | ⏳ In Progress | Infrastructure ready |
| Admin Dashboard | ⏳ In Progress | Interface ready |
| Email Verification | ⏹️ Planned | Not yet implemented |
| Password Reset | ⏹️ Planned | Not yet implemented |
| Profile Pictures | ⏹️ Planned | Storage ready, upload pending |
| Analytics | ⏹️ Planned | Not yet implemented |

---

## 🛠️ Development

### Prerequisites
- Node.js 16+ and npm
- Firebase project with credentials
- Modern web browser

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with Firebase credentials
cp .env.local.example .env.local
# Edit .env.local with your Firebase config

# 3. Start development server
npm run dev

# 4. Open http://localhost:5173
```

**Detailed setup:** [Environment Setup](./setup/ENVIRONMENT.md)

### Project Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code style
```

---

## 📖 Documentation by Role

### For Developers
Start with:
1. [Quick Start](./setup/QUICKSTART.md)
2. [Architecture](./architecture/ARCHITECTURE.md)
3. [Development Workflow](./guides/DEVELOPMENT_WORKFLOW.md)
4. [Component Guide](./components/COMPONENTS.md)

### For DevOps/Deployment
Start with:
1. [Environment Setup](./setup/ENVIRONMENT.md)
2. [Firebase Config](./setup/FIREBASE_CONFIG.md)
3. [Deployment Checklist](./guides/DEPLOYMENT.md)
4. [Security Guide](./guides/SECURITY.md)

### For Product Managers
Start with:
1. [Features Overview](./features/FEATURES.md)
2. [Implementation Status](#current-implementation-status)
3. [Architecture Overview](./architecture/ARCHITECTURE.md)

### For API Consumers
Start with:
1. [API Reference](./api/API_REFERENCE.md)
2. [Firestore Guide](./guides/FIRESTORE.md)
3. [Helper Functions](./api/HELPERS.md)

---

## 🐛 Troubleshooting

**Common issues:**
- Build errors? → [Troubleshooting Guide](./guides/TROUBLESHOOTING.md)
- Auth not working? → [Authentication Guide](./guides/AUTHENTICATION.md)
- Database issues? → [Firestore Guide](./guides/FIRESTORE.md)
- Styling problems? → [Component Guide](./components/COMPONENTS.md)

---

## 📞 Support

- **Setup Issues:** See [Environment Setup](./setup/ENVIRONMENT.md)
- **Firebase Problems:** See [Firebase Config](./setup/FIREBASE_CONFIG.md)
- **Code Questions:** See relevant guide in `/guides` folder
- **Architecture Questions:** See [Architecture](./architecture/ARCHITECTURE.md)

---

## 📝 Documentation Standards

All documentation follows these standards:
- Clear, concise language
- Code examples where applicable
- Step-by-step instructions for setup
- Troubleshooting sections
- Related documentation links
- Updated after each feature implementation

---

## 🔄 Keeping Docs Updated

Documentation is updated when:
- New features are added
- Bugs are fixed
- Configuration changes
- API changes
- Build process changes

**Last Updated:** April 24, 2026

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

---

**Navigation:** [Features](./features/FEATURES.md) | [Setup](./setup/QUICKSTART.md) | [Architecture](./architecture/ARCHITECTURE.md) | [Guides](./guides/DEVELOPMENT_WORKFLOW.md)
