# Troubleshooting Guide

Common issues and solutions for the Tutorial Platform.

---

## Setup Issues

### "npm install" fails

**Error:** `npm ERR! ERESOLVE unable to resolve dependency tree`

**Solutions:**
```bash
# Try deleting cache and reinstalling
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Or use legacy peer deps flag
npm install --legacy-peer-deps
```

---

### ".env.local not found" / Env variables not loading

**Problem:** Firebase credentials not loading

**Solutions:**
1. Verify `.env.local` exists in project root
2. Check file has correct variable names (must start with `VITE_`)
3. Restart dev server after creating `.env.local`
4. Check variable names match exactly (case-sensitive)

**Example .env.local:**
```env
VITE_FIREBASE_API_KEY=your-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
```

---

### "Firebase is not initialized"

**Problem:** Firebase config not loaded

**Solutions:**
1. Check `.env.local` has all 6 Firebase variables
2. Verify `firebase/config.js` imports correctly
3. Check import path in components: `import { db } from '../firebase/config'`
4. Restart dev server

---

### "Port 5173 already in use"

**Problem:** Another app using the dev port

**Solutions:**
```bash
# Kill process using port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

---

## Authentication Issues

### "Google OAuth popup blocked"

**Problem:** Browser blocking OAuth popup

**Solutions:**
1. Check browser popup settings
2. Disable ad blocker for localhost
3. Allow popups for `localhost:5173`
4. Try a different browser
5. Check if Safari (has stricter popup rules)

---

### "This domain is not authorized" error

**Problem:** Domain not in Firebase OAuth authorized list

**Solutions:**
1. Go to Firebase Console
2. Authentication → Settings
3. Add `localhost:5173` to authorized origins:
   - For development
4. Add `yourdomain.com` for production
5. Wait 5 minutes for changes to propagate
6. Restart dev server

---

### Login page shows no OAuth buttons

**Problem:** OAuth providers not configured

**Solutions:**
1. Go to Firebase Console
2. Authentication → Providers
3. Enable "Google"
4. Configure OAuth consent screen
5. Select support email
6. Save changes

---

### "User not found" when logging in

**Problem:** Email/password account doesn't exist

**Solutions:**
1. User hasn't signed up yet
2. Check email spelling
3. Try signup instead of login
4. Use different email if already exists

---

### Session lost after page refresh

**Problem:** User logged out after refresh

**Causes:**
- .env.local not set properly
- Firestore rules preventing auth state retrieval
- Browser localStorage cleared

**Solutions:**
1. Check .env.local has correct Firebase variables
2. Check browser's "Block third-party cookies" setting
3. Check browser console for Firebase errors
4. Try logging in again

---

### "Email already in use" error

**Problem:** Can't sign up - email already registered

**Solutions:**
1. Email is already associated with account
2. Try logging in instead of signing up
3. Use different email to create new account
4. Check if email used with Google/GitHub OAuth

---

## Build & Compilation Issues

### "Module not found" errors

**Problem:** Import path incorrect or file missing

**Solutions:**
1. Check import path spelling (case-sensitive)
2. Verify file exists in the location
3. Check file extension (`.jsx` vs `.js`)
4. Restart dev server

**Common mistakes:**
```javascript
// WRONG
import { MyComponent } from './MyComponent'  // Missing .jsx

// RIGHT
import { MyComponent } from './MyComponent.jsx'
```

---

### Build fails with "Unexpected token" error

**Problem:** Syntax error in code

**Solutions:**
1. Check browser console for line number
2. Look for missing braces, parentheses
3. Verify JSX syntax
4. Check for trailing commas in imports

---

### "Unknown CSS property" warnings

**Problem:** Tailwind classes not recognized

**Solutions:**
1. Restart dev server
2. Verify class name spelling
3. Check if `dark:` prefix used correctly
4. Check if responsive prefix used correctly

---

### TypeScript errors (if using TypeScript)

**Solutions:**
1. Check type definitions are installed
2. Run `npm install --save-dev @types/react`
3. Check for any type mismatches
4. Use `// @ts-ignore` as last resort

---

## Styling Issues

### Dark mode not working

**Problem:** Dark theme not applying

**Solutions:**
1. Click theme toggle in navbar (top right)
2. Check if `dark:` classes used in component
3. Verify ThemeContext is wrapping app
4. Reload page after toggle

**Correct dark mode pattern:**
```jsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

---

### Tailwind styles not applying

**Problem:** Styling not showing

**Solutions:**
1. Restart dev server
2. Check `tailwind.config.js` is configured
3. Verify class names spelled correctly
4. Check if styles bundled in `index.css`
5. Use browser DevTools to inspect element

---

### Mobile responsive not working

**Problem:** App not responsive on mobile

**Solutions:**
1. Use Chrome DevTools: F12 → Toggle device toolbar
2. Test on actual mobile device
3. Check if responsive classes used:
   ```jsx
   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
   ```
4. Check viewport meta tag in `index.html`

---

## Firestore Issues

### "Permission denied" error

**Problem:** Can't read/write Firestore data

**Solutions:**
1. Check Firestore security rules
2. Verify user is authenticated
3. Check user role (admin vs user)
4. Go to Firebase Console → Firestore → Rules
5. Look for security rule violations in error logs

---

### No data appearing from Firestore

**Problem:** Query returns empty results

**Solutions:**
1. Check collection has documents
2. Go to Firebase Console → Firestore → Data
3. Verify document exists in collection
4. Check if document matches query condition
5. Verify `where` clause values are correct

**Example check:**
```javascript
// If querying for published tutorials
where('published', '==', true)
// Make sure tutorial has published: true
```

---

### Firestore not updating

**Problem:** Data write failed silently

**Solutions:**
1. Check console for errors
2. Verify security rules allow write
3. Verify user is authenticated
4. Check if using `updateDoc` vs `setDoc` correctly
5. Try wrapping in try-catch:
   ```javascript
   try {
     await updateDoc(...);
   } catch (error) {
     console.error('Error:', error.message);
   }
   ```

---

### Real-time listener not updating

**Problem:** `onSnapshot` not getting updates

**Solutions:**
1. Verify listener is subscribed correctly
2. Check `unsubscribe()` not called prematurely
3. Verify changes made to document
4. Check browser console for errors
5. Try refreshing page

---

### Query too slow

**Problem:** Firestore query performance is poor

**Solutions:**
1. Check if query needs index
2. Firebase suggests creating index - do it
3. Limit results: `limit(10)`
4. Use `where` to filter more
5. Avoid scanning all documents

---

## Network Issues

### "Network request failed"

**Problem:** Can't connect to Firebase

**Solutions:**
1. Check internet connection
2. Verify Firebase project is active
3. Check if Firebase SDK loaded (F12 → Network)
4. Try refreshing page
5. Clear browser cache: F12 → Application → Clear storage

---

### Slow network requests

**Problem:** Firebase operations are slow

**Solutions:**
1. Check internet connection speed
2. Check Firebase usage (Console → Usage)
3. May be hitting rate limits (wait a bit)
4. Try from different network
5. Check if Firebase services are up (status.firebase.google.com)

---

## Component Issues

### Component not rendering

**Problem:** Page shows blank

**Solutions:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check if component imported
4. Check if route configured
5. Check if component has `export default`

---

### Button not working

**Problem:** Click handler not firing

**Solutions:**
1. Check `onClick` handler defined
2. Verify function is called correctly
3. Check if button is disabled
4. Look at console for errors
5. Verify state updates correctly

---

### Form validation not working

**Problem:** Invalid input accepted

**Solutions:**
1. Check `required` attribute on inputs
2. Verify validation logic in handler
3. Check error message display
4. Verify form prevents submission on error

---

## Browser Issues

### Console errors after refresh

**Problem:** App crashes on refresh

**Solutions:**
1. Check if auth state persists
2. Check if routes protected correctly
3. Look at error in console (F12)
4. Try clearing cache and reload
5. Try incognito/private mode

---

### Performance degradation after time

**Problem:** App gets slower over time

**Solutions:**
1. Check memory usage (DevTools → Performance)
2. May have memory leak in listeners
3. Verify `unsubscribe()` called on cleanup
4. Reload page to reset
5. Check if too many real-time listeners active

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "PERMISSION_DENIED" | Firestore rule blocking | Check security rules |
| "UNAUTHENTICATED" | User not logged in | Login first |
| "INVALID_ARGUMENT" | Query syntax error | Check query formatting |
| "ABORTED" | Operation interrupted | Retry operation |
| "NOT_FOUND" | Document doesn't exist | Verify document ID |
| "ALREADY_EXISTS" | Trying to create duplicate | Update instead of create |
| "FAILED_PRECONDITION" | Wrong state for operation | Check prerequisites |

---

## Debugging Tips

### Enable Debug Logging
```javascript
// In firebase/config.js
import { enableLogging } from 'firebase/firestore';
enableLogging(true);
```

### Check DevTools
1. Open F12
2. Console tab - check for errors
3. Network tab - check API calls
4. Application tab - check localStorage
5. React DevTools - inspect component state

### Use Console Logs
```javascript
console.log('Debug info:', data);
console.error('Error occurred:', error);
console.warn('Warning:', issue);
```

### Check Firebase Console
1. Go to https://console.firebase.google.com
2. Select project
3. Check:
   - Authentication → Users (see created users)
   - Firestore → Data (see documents)
   - Firestore → Usage (check quota)
   - Firestore → Rules (check permissions)

---

## When to Reset

### Clear Browser Cache
```
DevTools → Application → Clear storage
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Firebase Cache
```
Firebase Console → Settings → Clear cache
```

---

## Getting Help

1. **Check Documentation:**
   - See `/docs` folder for guides
   - Check [API Reference](../api/API_REFERENCE.md)

2. **Search Online:**
   - Firebase docs: firebase.google.com/docs
   - React docs: react.dev
   - Stack Overflow: stackoverflow.com

3. **Check Browser DevTools:**
   - F12 → Console for error details
   - F12 → Network for request details

4. **Test Isolate:**
   - Test one feature at a time
   - Verify each step works
   - Compare with working code

---

## Report a Bug

If issue persists:
1. Gather all error messages
2. Note steps to reproduce
3. Check recent changes
4. Ask team or check Git history
5. Create detailed bug report

---

**Last Updated:** April 24, 2026
