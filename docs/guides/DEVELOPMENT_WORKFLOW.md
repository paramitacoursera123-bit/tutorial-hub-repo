# Development Workflow

Guide for day-to-day development work on the Tutorial Platform.

---

## Project Setup

### Initial Setup (First Time)
```bash
# Clone repository
git clone <repo-url>
cd dynamic-tutorial-website

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Add Firebase credentials to .env.local
# (Edit .env.local with your Firebase project info)

# Start development server
npm run dev
```

**Verify setup:**
- [ ] No npm errors
- [ ] App loads at `http://localhost:5173`
- [ ] No errors in browser console
- [ ] Firebase services connected

---

## Development Commands

### Start Development Server
```bash
npm run dev
```

- Starts Vite dev server
- Hot module replacement (auto-refresh)
- Listens on `http://localhost:5173`
- Watch mode for file changes

### Build for Production
```bash
npm run build
```

- Compiles React with Vite
- Minifies and optimizes code
- Output in `dist/` folder
- Ready for deployment

### Preview Production Build
```bash
npm run preview
```

- Serves production build locally
- Test production optimization
- Helpful for debugging production issues

### Check Code Quality
```bash
npm run lint
```

- Runs ESLint
- Checks code style
- Reports issues
- Can be set to auto-fix

---

## File Structure Guide

### Where to Add New...

**Page Component:**
- Location: `src/pages/YourPage.jsx`
- Pattern: See existing pages
- Then add to routing in `App.jsx`

**Reusable Component:**
- Location: `src/components/YourComponent.jsx`
- Pattern: Follow existing components
- Import where needed

**Style/CSS:**
- Location: Component-specific CSS file
- Or use Tailwind classes inline
- Global styles in `src/index.css`

**Utility Functions:**
- Location: `src/utils/yourUtils.js`
- For Firebase: Use `src/utils/firebaseHelpers.js`
- Import where needed

**Firebase Config:**
- Location: `src/firebase/config.js`
- Don't modify unless absolutely necessary
- Use environment variables

---

## Git Workflow

### Basic Workflow
```bash
# 1. Start with latest code
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes
# Edit files in editor

# 4. Check changes
git status

# 5. Stage changes
git add .

# 6. Commit with message
git commit -m "Add feature description"

# 7. Push to remote
git push origin feature/your-feature-name

# 8. Create Pull Request on GitHub
# Request review
# Merge after approval
```

### Branch Naming Conventions
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/description` - Documentation
- `refactor/area` - Code refactoring

### Commit Message Format
```
[Type] Description

- Detail 1
- Detail 2

Fixes #123
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Styling changes
- `refactor:` - Code refactoring
- `test:` - Test additions
- `chore:` - Maintenance

---

## Common Development Tasks

### Add a New Page

1. **Create page component:**
   ```jsx
   // src/pages/NewPage.jsx
   import { useState } from 'react';
   import { useAuth } from '../contexts/AuthContext';

   function NewPage() {
     const [state, setState] = useState('');
     const { currentUser } = useAuth();

     return (
       <div className="page-container">
         {/* JSX */}
       </div>
     );
   }

   export default NewPage;
   ```

2. **Import in App.jsx:**
   ```jsx
   import NewPage from './pages/NewPage';

   function App() {
     return (
       <Routes>
         <Route path="/newpage" element={<NewPage />} />
         {/* Other routes */}
       </Routes>
     );
   }
   ```

3. **Add to Navbar if needed:**
   - Edit `src/components/Navbar.jsx`
   - Add link to new page

4. **Test:**
   - Navigate to `/newpage`
   - Check light/dark mode
   - Check mobile responsiveness

---

### Add a New Component

1. **Create component:**
   ```jsx
   // src/components/NewComponent.jsx
   function NewComponent({ prop1, prop2 }) {
     return (
       <div className="component">
         {/* JSX */}
       </div>
     );
   }

   export default NewComponent;
   ```

2. **Import and use:**
   ```jsx
   import NewComponent from './components/NewComponent';

   <NewComponent prop1="value" prop2={value} />
   ```

3. **Test:**
   - Component renders correctly
   - Props work as expected
   - No console errors

---

### Add Firestore Data Access

1. **Read data:**
   ```javascript
   import { getDoc, doc } from 'firebase/firestore';
   import { db } from '../firebase/config';

   const fetchData = async (docId) => {
     const docSnap = await getDoc(doc(db, 'collection', docId));
     if (docSnap.exists()) {
       return docSnap.data();
     }
   };
   ```

2. **Create data:**
   ```javascript
   import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
   import { db } from '../firebase/config';

   const createData = async (data) => {
     await setDoc(doc(db, 'collection', data.id), {
       ...data,
       createdAt: serverTimestamp()
     });
   };
   ```

3. **Update Firestore rules if needed:**
   - Edit `firestore.rules`
   - Test locally
   - Deploy to Firebase

---

### Style a Component

**Use Tailwind CSS:**
```jsx
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Title
  </h1>
</div>
```

**Dark mode pattern:**
```jsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

**Responsive pattern:**
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

**Buttons:**
```jsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
```

---

## Debugging

### Browser DevTools
- Press `F12` to open Developer Tools
- **Console tab** - Check for errors
- **Network tab** - Check API calls
- **Application tab** - Check localStorage/cookies
- **Lighthouse** - Performance audit

### React DevTools
- Install React DevTools extension
- Inspect component props and state
- Debug component re-renders
- Check Context values

### Firebase DevTools
- Check Firestore data in Firebase Console
- Monitor authentication events
- Check security rule violations
- View error logs

### Common Issues

**Component not rendering:**
- Check console for errors
- Verify component exported/imported
- Check routing configuration
- Check conditional rendering logic

**Firestore not updating:**
- Check security rules in Firebase Console
- Verify user has permission
- Check browser console for errors
- Verify network tab shows request

**Auth not working:**
- Check Firebase credentials in .env.local
- Verify .env.local loaded (restart dev server)
- Check Firebase Console for auth errors
- Look for popup blocking issues

---

## Testing Changes

### Before Committing

- [ ] Code builds without errors (`npm run build`)
- [ ] No console errors (press F12)
- [ ] Works in light mode
- [ ] Works in dark mode (toggle theme)
- [ ] Responsive on mobile (F12 → Toggle device toolbar)
- [ ] Tested main user flows
- [ ] Related features still work
- [ ] No commented-out code
- [ ] Added necessary documentation

### Manual Testing Checklist

**Authentication:**
- [ ] Email/password signup works
- [ ] Email/password login works
- [ ] Google OAuth works
- [ ] Session persists on reload
- [ ] Logout works

**Navigation:**
- [ ] All links work
- [ ] Mobile menu works
- [ ] Back buttons work

**Forms:**
- [ ] Validation works
- [ ] Error messages show
- [ ] Loading states show
- [ ] Success redirects

**Styling:**
- [ ] Buttons visible
- [ ] Text readable
- [ ] Colors consistent
- [ ] Spacing correct

---

## Performance Optimization

### Check Performance
```bash
# Build production version
npm run build

# Preview production
npm run preview

# Use Chrome Lighthouse (F12 → Lighthouse)
```

### Best Practices
- ✅ Use React Context efficiently
- ✅ Minimize component re-renders
- ✅ Lazy load heavy components
- ✅ Optimize images
- ✅ Use serverTimestamp() for dates
- ✅ Index Firestore queries

### Common Performance Issues
- Large bundle size → Lazy load pages
- Slow Firestore → Add indexes
- Excessive re-renders → Use useMemo/useCallback
- Large images → Optimize/compress
- Missing indexes → Check rules in Firebase

---

## Documentation

### When to Update Docs
- After adding features
- When changing architecture
- When fixing major bugs
- When updating configuration
- When adding new components

### How to Update Docs
- Edit files in `/docs` folder
- Update relevant sections
- Add examples if complex
- Link to related docs
- Update "Last Updated" date

---

## Troubleshooting

### "Cannot find module" errors
**Solution:** Check import paths, restart dev server after adding files

### Build fails with warnings
**Solution:** Check console for specific errors, fix linting issues

### Firestore permission denied
**Solution:** Check security rules and user role in Firebase Console

### Styles not applying
**Solution:** Verify Tailwind classes are correct, restart dev server

### App won't start
**Solution:** Check .env.local has correct Firebase credentials

---

## Getting Help

1. **Check existing docs:** See `/docs` folder
2. **Search codebase:** Look for similar implementations
3. **Check Firebase docs:** https://firebase.google.com/docs
4. **Check React docs:** https://react.dev
5. **Ask team:** Use Slack/Discord

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

---

**Last Updated:** April 24, 2026
