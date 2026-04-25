---
name: agents
description: Custom agents and specialized workflows for this project
---

# Custom Agents for Tutorial Platform

## Overview

This file documents custom agents and specialized workflows for the Tutorial Platform project. Use these when you need focused, context-specific assistance for particular tasks.

## Available Workflows

### 1. Firebase Setup & Configuration
**When to use:** Setting up Firebase, configuring OAuth, creating Firestore collections, deploying security rules

**Use case example:**
- New developer needs Firebase project setup
- Adding new OAuth provider
- Updating Firestore collections structure
- Deploying to production

**Key context:** Knows Firebase setup steps, OAuth flow, Firestore rules, security best practices

### 2. Authentication & Authorization
**When to use:** Adding new auth methods, implementing role-based features, managing user access

**Use case example:**
- Implementing email verification
- Adding new user roles
- Protecting new routes
- Implementing session management

**Key context:** Knows auth patterns, user role system, protected route implementation, Firestore auth rules

### 3. Component Development
**When to use:** Creating new pages or components, implementing UI features, styling

**Use case example:**
- Building new tutorial page layout
- Creating admin forms
- Implementing dark mode for new feature
- Building responsive components

**Key context:** Knows React patterns, Tailwind styling, dark mode support, component conventions

### 4. Firestore Data Operations
**When to use:** Adding data features, implementing queries, creating helper functions

**Use case example:**
- Building search functionality
- Implementing data filtering
- Creating bulk operations
- Adding real-time updates

**Key context:** Knows Firestore queries, helper functions, security rules, data modeling

### 5. Troubleshooting & Debugging
**When to use:** Fixing errors, debugging issues, performance optimization

**Use case example:**
- Solving build errors
- Fixing auth issues
- Optimizing Firestore queries
- Debugging component rendering

**Key context:** Knows common issues, debugging patterns, error messages, solution approaches

---

## Recommended Workflow for Common Tasks

### Adding a New Feature

1. **Planning Phase**
   - Read project documentation (README.md, QUICKSTART.md, IMPLEMENTATION_GUIDE.md)
   - Check existing patterns in similar files
   - Verify Firestore rules support the feature

2. **Implementation Phase**
   - Use Component Development workflow
   - Follow established patterns and conventions
   - Add necessary Firestore operations using helpers

3. **Authentication Phase**
   - If feature requires auth, use Authentication & Authorization workflow
   - Verify user roles are properly checked
   - Update Firestore rules if needed

4. **Testing Phase**
   - Test locally (npm run dev)
   - Test in light and dark mode
   - Test on mobile (F12 → Device toolbar)
   - Test with different user roles (admin vs user)
   - Check browser console for errors

### Deploying to Production

1. Use Firebase Setup workflow for configuration
2. Update environment variables on hosting platform
3. Deploy Firestore security rules
4. Run production build: npm run build
5. Test production build: npm run preview

---

## Agent Instructions Integration

All agents should follow the project patterns documented in:
- `.github/copilot-instructions.md` - Main project guidelines
- `.github/instructions/auth-context.instructions.md` - Auth patterns
- `.github/instructions/pages.instructions.md` - Component patterns
- `.github/instructions/firestore-helpers.instructions.md` - Data operations

Before working on a task, agents should:
1. Read relevant instruction file
2. Check similar existing code
3. Follow established conventions
4. Test thoroughly before completing

---

## Extending This System

To add new custom agents or workflows:

1. Create `.github/agents/<name>.agent.md` file
2. Add YAML frontmatter with description and context
3. Document specific tasks and use cases
4. Link back to main instructions

Example:
```markdown
---
name: performance-optimization
description: Specialized agent for performance profiling and optimization
keywords: performance, optimization, profiling, bundle size
---

# Performance Optimization Agent

[Agent-specific instructions...]
```

---

## Quick Links

- **Main Instructions:** `.github/copilot-instructions.md`
- **Auth Instructions:** `.github/instructions/auth-context.instructions.md`
- **Component Instructions:** `.github/instructions/pages.instructions.md`
- **Firebase Instructions:** `.github/instructions/firestore-helpers.instructions.md`
- **Project Docs:** `README.md`, `QUICKSTART.md`, `AUTH_SETUP.md`

---

## Notes

- Agents inherit main project context from `.github/copilot-instructions.md`
- File-specific instructions apply automatically for matching files
- All agents should prioritize user-friendly error messages
- All agents should test thoroughly before completing
- All agents should follow established code patterns

---

Last Updated: April 24, 2026
