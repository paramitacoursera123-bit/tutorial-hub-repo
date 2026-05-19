# Tutorial Data Storage Guide

This guide explains how to store and manage tutorial data in Firestore for your Tutorial Platform.

---

## Table of Contents

1. [Database Schema](#database-schema)
2. [Setup Instructions](#setup-instructions)
3. [Available Functions](#available-functions)
4. [Usage Examples](#usage-examples)
5. [Security & Permissions](#security--permissions)
6. [Best Practices](#best-practices)

---

## Database Schema

### Tutorials Collection

The `tutorials` collection stores all tutorial documents with the following structure:

```javascript
{
  id: "auto-generated",           // Firestore document ID
  title: "string",                // Tutorial title (required)
  description: "string",          // Short description (required)
  content: "string",              // Full markdown content (required)
  category: "string",             // Topic category (required)
  readTime: number,               // Estimated read time in minutes
  isPremium: boolean,             // Whether tutorial is premium
  authorName: "string",           // Author name
  thumbnail: "string",            // Thumbnail image URL
  videoUrl: "string",             // YouTube embed URL (optional)
  tags: ["string"],               // Array of tags
  sections: ["string"],           // Tutorial sections
  views: number,                  // View count (default: 0)
  likes: number,                  // Like count (default: 0)
  createdAt: Timestamp,           // Creation timestamp (auto)
  updatedAt: Timestamp,           // Last update timestamp (auto)
}
```

### Firestore Rules

Tutorials are publicly readable but only admin users can create/update/delete:

```
match /tutorials/{tutorialId} {
  allow read: if true;
  allow create, update, delete: if request.auth.uid != null && 
                                 exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
}
```

---

## Setup Instructions

### 1. Seed Sample Tutorials to Firestore

```bash
# Run the seed script
node seed-tutorials.js
```

**Expected Output:**
```
🌱 Starting to seed tutorials into Firestore...

✅ Added tutorial: "Getting Started with React" (ID: abc123xyz)
✅ Added tutorial: "JavaScript ES6+ Features" (ID: def456uvw)
✅ Added tutorial: "CSS Grid Layout Complete Guide" (ID: ghi789rst)
✅ Added tutorial: "Firebase Firestore Database Guide" (ID: jkl012mno)
✅ Added tutorial: "React Hooks Deep Dive" (ID: pqr345abc)
✅ Added tutorial: "Tailwind CSS Essentials" (ID: stu678def)

✨ Seeding complete!
✅ Successfully added: 6 tutorials
📚 Your tutorials are now available in Firestore!
```

### 2. Verify Data in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ai-augmentdynamic-tutorial-app**
3. Navigate to **Firestore Database**
4. Click on **tutorials** collection
5. Verify the documents are there

---

## Available Functions

All functions are exported from `src/utils/firebaseHelpers.js`

### CRUD Operations

#### Create Tutorial (Admin Only)

```javascript
import { createTutorial } from '../utils/firebaseHelpers';

const tutorialId = await createTutorial({
  title: "My Tutorial",
  description: "Tutorial description",
  content: "# Markdown content here",
  category: "React",
  readTime: 15,
  isPremium: false,
  authorName: "Your Name",
  tags: ["react", "javascript"],
  thumbnail: "",
  videoUrl: ""
});
```

#### Read Tutorial

```javascript
import { getTutorial, getAllTutorials } from '../utils/firebaseHelpers';

// Get single tutorial
const tutorial = await getTutorial('tutorial-id');

// Get all tutorials
const tutorials = await getAllTutorials();
```

#### Update Tutorial (Admin Only)

```javascript
import { updateTutorial } from '../utils/firebaseHelpers';

await updateTutorial('tutorial-id', {
  title: "Updated Title",
  description: "Updated description"
});
```

#### Delete Tutorial (Admin Only)

```javascript
import { deleteTutorial } from '../utils/firebaseHelpers';

await deleteTutorial('tutorial-id');
```

### Search & Filter Functions

#### Search Tutorials

```javascript
import { searchTutorials } from '../utils/firebaseHelpers';

// Search by term and/or category
const results = await searchTutorials('React', 'JavaScript');
```

#### Get Tutorials by Category

```javascript
import { getTutorialsByCategory } from '../utils/firebaseHelpers';

const tutorials = await getTutorialsByCategory('React');
```

#### Get All Categories

```javascript
import { getAllCategories } from '../utils/firebaseHelpers';

const categories = await getAllCategories();
// Returns: ['CSS', 'Firebase', 'JavaScript', 'React']
```

### Analytics Functions

#### Get Popular Tutorials

```javascript
import { getPopularTutorials } from '../utils/firebaseHelpers';

const popular = await getPopularTutorials(5); // Top 5 most viewed
```

#### Get Latest Tutorials

```javascript
import { getLatestTutorials } from '../utils/firebaseHelpers';

const latest = await getLatestTutorials(5); // Last 5 added
```

#### Increment View Count

```javascript
import { incrementTutorialViews } from '../utils/firebaseHelpers';

// Call when tutorial is opened
await incrementTutorialViews('tutorial-id');
```

### User Saved Tutorials

#### Save Tutorial

```javascript
import { saveTutorialToUser } from '../utils/firebaseHelpers';

await saveTutorialToUser(userId, 'tutorial-id');
```

#### Remove Saved Tutorial

```javascript
import { removeSavedTutorial } from '../utils/firebaseHelpers';

await removeSavedTutorial(userId, 'tutorial-id');
```

#### Get User's Saved Tutorials

```javascript
import { getUserSavedTutorials } from '../utils/firebaseHelpers';

const saved = await getUserSavedTutorials(userId);
```

---

## Usage Examples

### Example 1: Display All Tutorials in a Page

```jsx
import { useState, useEffect } from 'react';
import { getAllTutorials } from '../utils/firebaseHelpers';

function TutorialsPage() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTutorials = async () => {
      try {
        const data = await getAllTutorials();
        setTutorials(data);
      } catch (error) {
        console.error('Error loading tutorials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTutorials();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {tutorials.map(tutorial => (
        <div key={tutorial.id} className="card">
          <h2>{tutorial.title}</h2>
          <p>{tutorial.description}</p>
          <p className="text-sm text-gray-600">
            {tutorial.readTime} min read
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Create New Tutorial (Admin)

```jsx
import { useState } from 'react';
import { createTutorial } from '../utils/firebaseHelpers';
import { useAuth } from '../contexts/AuthContext';

function CreateTutorial() {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    readTime: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAdmin) return <div>Admin access required</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      const tutorialId = await createTutorial(formData);
      alert(`Tutorial created! ID: ${tutorialId}`);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        readTime: 10
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Tutorial Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />
      <textarea
        placeholder="Markdown Content"
        value={formData.content}
        onChange={(e) => setFormData({...formData, content: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
        required
      />
      <button 
        type="submit" 
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Creating...' : 'Create Tutorial'}
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}
```

### Example 3: Tutorial Detail with Views

```jsx
import { useState, useEffect } from 'react';
import { getTutorial, incrementTutorialViews } from '../utils/firebaseHelpers';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function TutorialDetail() {
  const { tutorialId } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTutorial = async () => {
      try {
        // Increment views when tutorial is opened
        await incrementTutorialViews(tutorialId);
        
        const data = await getTutorial(tutorialId);
        setTutorial(data);
      } catch (error) {
        console.error('Error loading tutorial:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTutorial();
  }, [tutorialId]);

  if (loading) return <div>Loading...</div>;
  if (!tutorial) return <div>Tutorial not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1>{tutorial.title}</h1>
      <p className="text-gray-600">
        By {tutorial.authorName} • {tutorial.readTime} min read
      </p>
      <p className="text-sm">
        📊 {tutorial.views} views
      </p>
      <ReactMarkdown>{tutorial.content}</ReactMarkdown>
    </div>
  );
}
```

---

## Security & Permissions

### Read Access
- ✅ Everyone can read all tutorials (public)
- ✅ No authentication required

### Write Access
- ✅ Only authenticated admins can create/update/delete tutorials
- ✅ Regular users cannot modify tutorials

### User Data
- ✅ Users can save tutorials to their profile
- ✅ Saved tutorials are stored in `adminUsers` collection
- ✅ Only the user can see their saved tutorials

### Firestore Rules

The current rules in `firestore.rules` provide:

```
Tutorials:
- Read: ✅ Public (everyone)
- Create/Update/Delete: ✅ Admin only

Categories:
- Read: ✅ Public
- Write: ✅ Admin only

Users:
- Read: ✅ Own profile or admin
- Write: ✅ Own profile or admin
```

---

## Best Practices

### 1. **Use Helper Functions**
Always use the helper functions from `firebaseHelpers.js` instead of writing raw Firestore code.

```javascript
// ✅ Good
import { getTutorial } from '../utils/firebaseHelpers';
const tutorial = await getTutorial(id);

// ❌ Avoid
import { doc, getDoc } from 'firebase/firestore';
const docSnap = await getDoc(doc(db, 'tutorials', id));
```

### 2. **Handle Errors Properly**
Always wrap Firestore calls in try-catch blocks.

```javascript
try {
  const tutorials = await getAllTutorials();
  setTutorials(tutorials);
} catch (error) {
  console.error('Error loading tutorials:', error);
  setError('Failed to load tutorials');
}
```

### 3. **Show Loading States**
Users need feedback during async operations.

```javascript
const [loading, setLoading] = useState(false);

try {
  setLoading(true);
  // ... async operation
} finally {
  setLoading(false);
}
```

### 4. **Validate Admin Access**
Before allowing write operations, verify user is admin.

```javascript
import { useAuth } from '../contexts/AuthContext';

function AdminTutorialForm() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <div>Admin access required</div>;
  }
  // ... form
}
```

### 5. **Optimize Queries**
Use specific queries instead of fetching all data when possible.

```javascript
// ✅ Good - specific category
const tutorials = await getTutorialsByCategory('React');

// ❌ Less efficient - fetch all then filter
const all = await getAllTutorials();
const filtered = all.filter(t => t.category === 'React');
```

### 6. **Include Proper Metadata**
Always include helpful metadata with tutorials.

```javascript
{
  title: "Tutorial Title",
  description: "Short description",
  category: "Category",
  readTime: 15,           // Helps users decide
  authorName: "Author",   // Credit
  tags: ["tag1", "tag2"], // Better search
  thumbnail: "url",       // Visual appeal
  createdAt: timestamp,   // Sorting
  updatedAt: timestamp,   // Freshness indicator
}
```

### 7. **Handle Timestamps**
Always use `serverTimestamp()` for auto timestamps.

```javascript
import { serverTimestamp } from 'firebase/firestore';

{
  ...tutorialData,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

### 8. **Test Thoroughly**
Test all CRUD operations locally before deploying.

**Checklist:**
- [ ] Create tutorial works (admin)
- [ ] Read tutorials works (public)
- [ ] Update tutorial works (admin)
- [ ] Delete tutorial works (admin)
- [ ] Search works
- [ ] Categories load correctly
- [ ] Views increment properly
- [ ] Error messages display correctly

---

## Troubleshooting

### Tutorials Not Showing

**Check:**
1. Run seed script: `node seed-tutorials.js`
2. Verify Firebase credentials in `.env.local`
3. Check browser console for errors
4. Verify Firestore rules allow read access

### Create Tutorial Not Working

**Check:**
1. User is authenticated (check Auth tab)
2. User is admin (check in adminUsers collection)
3. Check browser console for error
4. Verify form data is valid

### Firestore Rules Error

**Common Issues:**
- User is not admin → Promote to admin first
- Credentials expired → Restart dev server
- Rules too restrictive → Check firestore.rules

### Seed Script Fails

**Check:**
1. Node.js is installed: `node --version`
2. Firebase credentials in `.env.local`
3. Internet connection works
4. Firestore database exists and is initialized

---

## Next Steps

- [ ] Integrate tutorial creation into admin dashboard
- [ ] Add tutorial editing UI
- [ ] Implement tutorial deletion with confirmation
- [ ] Add tutorial comments/ratings
- [ ] Create tutorial progress tracking
- [ ] Add tutorial recommendations
- [ ] Implement tutorial search with filters
- [ ] Create tutorial collections/learning paths

---

## Related Documentation

- [Firebase Setup](./QUICKSTART.md)
- [Admin Dashboard](./docs/features/FEATURES.md)
- [Authentication](./docs/features/AUTHENTICATION.md)
- [Firestore Guide](./docs/guides/FIRESTORE.md)
