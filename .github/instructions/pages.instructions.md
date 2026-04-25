---
description: 'Use when: adding new pages, creating page components, or modifying routing and navigation'
applyTo: 'src/pages/**/*.jsx'
---

# Page Components - Structure & Patterns

## File Naming
All page components use PascalCase: `HomePage.jsx`, `AdminDashboard.jsx`, `TutorialDetail.jsx`

## Standard Page Component Template

```jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PageName() {
  // State management
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Context and routing
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Event handlers
  const handleAction = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      // Async operation
      
      // Success navigation
      navigate('/destination');
    } catch (error) {
      setError('User-friendly error message');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Conditional rendering for auth checks
  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Page content */}
    </div>
  );
}

export default PageName;
```

## Common Patterns

### Form Handling
```jsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Validate and submit
};
```

### Data Loading
```jsx
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch from Firestore
      setData(result);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []); // Empty array = run once on mount
```

### Conditional Rendering
```jsx
return (
  <>
    {loading && <div>Loading...</div>}
    {error && <div className="error">{error}</div>}
    {data && <div>{/* Display data */}</div>}
    {!data && !loading && <div>No data found</div>}
  </>
);
```

## Current Pages

### Login.jsx
- Email/password login form
- Google OAuth button
- GitHub OAuth button
- Redirects to / (homepage) or /admin (for OAuth users)

### Register.jsx
- Email, password, confirm password, display name fields
- Email/password signup
- Google & GitHub OAuth options
- Redirects to / (homepage) or /admin (for OAuth users)

### Home.jsx
- Homepage/landing page
- Public page (no auth required)
- Shows tutorial overview

### Tutorials.jsx
- Browse all tutorials
- Search/filter functionality
- List view with tutorial cards
- Public access

### TutorialDetail.jsx
- View individual tutorial
- Display content (markdown, code, media)
- Progress tracking
- Comments section
- Public or restricted (depends on implementation)

### AdminDashboard.jsx
- Admin-only page (ProtectedRoute with adminOnly={true})
- Create new tutorials
- Edit existing tutorials
- Manage users
- View analytics

## Key Considerations

### Authentication Checks
```jsx
// In pages that require auth
const { currentUser, isAdmin } = useAuth();

if (!isAdmin) {
  return <div>You don't have permission to access this page</div>;
}
```

### Loading States
Always show feedback during async operations:
```jsx
<button disabled={loading}>
  {loading ? 'Processing...' : 'Submit'}
</button>
```

### Error Display
```jsx
{error && (
  <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
    {error}
  </div>
)}
```

### Dark Mode Support
Every className should support dark mode:
```jsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

## Navigation Between Pages

Register pages in `src/App.jsx` routes:
```jsx
<Route path="/page-name" element={<PageName />} />
<Route path="/page-name/:id" element={<PageNameDetail />} />
```

Add links to `src/components/Navbar.jsx` for navigation.

## Testing a New Page

1. Create file in `src/pages/PageName.jsx`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Navbar.jsx`
4. Test in browser at `http://localhost:5173/page-name`
5. Test dark/light mode toggle
6. Test mobile responsiveness (F12 → Device toolbar)
7. Test with authenticated/unauthenticated users
8. Check console for errors

## Common Issues

**Page doesn't render:**
- Verify route path matches import
- Check JSX syntax (closing tags, parentheses)
- Check export statement at bottom

**Styling looks wrong:**
- Ensure Tailwind classes are present
- Check for dark: prefix on color classes
- Test dark mode to verify contrast

**Data not loading:**
- Check Firestore rules allow access
- Verify user has correct role
- Check browser console for Firebase errors

**Auth redirect not working:**
- Verify useAuth() is called
- Check navigate() path is correct
- Ensure isAdmin variable reflects user role
