# Tutorial Data Schema & Collections

Complete documentation of Firestore collections and data structures for the Tutorial Platform.

---

## Collections Overview

```
Firestore Database (ai-augmentdynamic-tutorial-app)
├── adminUsers/
│   ├── {userId}
│   │   ├── uid: string
│   │   ├── email: string
│   │   ├── displayName: string
│   │   ├── photoURL: string (optional)
│   │   ├── role: "admin"
│   │   ├── savedTutorials: string[]
│   │   ├── createdAt: timestamp
│   │   ├── updatedAt: timestamp
│   │   └── lastLogin: timestamp
│   └── ...
│
├── users/
│   ├── {userId}
│   │   ├── email: string
│   │   ├── displayName: string
│   │   ├── role: "user"
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...
│
├── tutorials/
│   ├── {tutorialId}
│   │   ├── title: string (required)
│   │   ├── description: string (required)
│   │   ├── content: string (markdown, required)
│   │   ├── category: string (required)
│   │   ├── readTime: number (minutes)
│   │   ├── isPremium: boolean
│   │   ├── authorName: string
│   │   ├── thumbnail: string (URL, optional)
│   │   ├── videoUrl: string (YouTube embed URL, optional)
│   │   ├── tags: string[]
│   │   ├── sections: string[]
│   │   ├── views: number
│   │   ├── likes: number
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...
│
└── categories/
    ├── {categoryId}
    │   ├── name: string
    │   ├── description: string
    │   ├── icon: string
    │   ├── count: number
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
    └── ...
```

---

## Detailed Collection Schemas

### 1. adminUsers Collection

**Purpose:** Stores OAuth admin users (Google, GitHub)

**Access Rules:**
- Read: Only the user or other admins
- Write: Only the user or other admins
- Delete: Admins only

**Document Schema:**

```javascript
{
  uid: "google-123456789",                    // Firebase auth UID (document ID)
  email: "admin@example.com",                 // User email
  displayName: "Admin Name",                  // Display name
  photoURL: "https://...",                    // Profile picture URL
  role: "admin",                              // Always "admin" for OAuth users
  providerData: [                             // OAuth provider info
    {
      provider: "google.com",
      uid: "...",
      email: "...",
      displayName: "...",
      photoURL: "..."
    }
  ],
  savedTutorials: [                           // Array of tutorial IDs
    "tutorial-id-1",
    "tutorial-id-2"
  ],
  createdAt: Timestamp(2024, 1, 15, ...),    // Creation date
  updatedAt: Timestamp(2024, 1, 20, ...),    // Last modification
  lastLogin: Timestamp(2024, 1, 20, ...)     // Last login
}
```

**Example:**

```json
{
  "uid": "YhE1c5vV2QOZPcK9mL1w2X3y",
  "email": "john@example.com",
  "displayName": "John Developer",
  "photoURL": "https://lh3.googleusercontent.com/a/default-user",
  "role": "admin",
  "savedTutorials": ["tut_001", "tut_003"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T15:45:00Z",
  "lastLogin": "2024-01-20T15:45:00Z"
}
```

---

### 2. users Collection

**Purpose:** Stores regular email/password users

**Access Rules:**
- Read: Only the user or admins
- Write: Only the user or admins

**Document Schema:**

```javascript
{
  email: "user@example.com",                  // User email
  displayName: "User Name",                   // Display name
  role: "user",                               // Always "user" for email/password users
  savedTutorials: [                           // Saved tutorial IDs
    "tutorial-id-1"
  ],
  createdAt: Timestamp(...),                  // Registration date
  updatedAt: Timestamp(...),                  // Last update
  demotedAt: Timestamp(...) // Optional - when promoted to admin
}
```

**Example:**

```json
{
  "email": "jane@example.com",
  "displayName": "Jane Learner",
  "role": "user",
  "savedTutorials": ["tut_002"],
  "createdAt": "2024-01-10T08:20:00Z",
  "updatedAt": "2024-01-18T12:15:00Z"
}
```

---

### 3. tutorials Collection ⭐ PRIMARY

**Purpose:** Stores all tutorial content

**Access Rules:**
- Read: Public (everyone)
- Write: Admins only
- Delete: Admins only

**Document Schema:**

```javascript
{
  // Content Fields (Required)
  title: "string",                            // Tutorial title (max 200 chars)
  description: "string",                      // Short description (max 500 chars)
  content: "string (markdown)",               // Full markdown content
  
  // Categorization (Required)
  category: "string",                         // Category name (e.g., "React", "JavaScript")
  tags: ["string"],                           // Tags for filtering
  
  // Metadata (Required)
  authorName: "string",                       // Who created it
  createdAt: Timestamp,                       // Creation date
  updatedAt: Timestamp,                       // Last modification
  
  // Metrics (Optional)
  readTime: number,                           // Minutes to read (default: 15)
  views: number,                              // View count (default: 0)
  likes: number,                              // Like count (default: 0)
  
  // Media (Optional)
  thumbnail: "string (URL)",                  // Thumbnail image
  videoUrl: "string (URL)",                   // YouTube embed link
  
  // Features (Optional)
  isPremium: boolean,                         // Premium content flag
  sections: ["string"],                       // Section titles
  difficulty: "string"                        // Beginner/Intermediate/Advanced
}
```

**Example:**

```json
{
  "title": "Getting Started with React",
  "description": "Learn the fundamentals of React development",
  "content": "# Getting Started with React\n\nReact is a popular JavaScript library...",
  "category": "React",
  "tags": ["javascript", "react", "frontend", "components"],
  "authorName": "Tutorial Platform Team",
  "readTime": 15,
  "views": 342,
  "likes": 28,
  "isPremium": false,
  "thumbnail": "https://example.com/react-tutorial.jpg",
  "videoUrl": "https://www.youtube.com/embed/...",
  "sections": ["Introduction", "Components", "Props", "State"],
  "difficulty": "Beginner",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-20T15:00:00Z"
}
```

**Field Constraints:**

| Field | Type | Required | Max Length | Validation |
|-------|------|----------|-----------|------------|
| title | String | Yes | 200 | Not empty |
| description | String | Yes | 500 | Not empty |
| content | String | Yes | Unlimited | Valid markdown |
| category | String | Yes | 100 | Not empty |
| tags | Array | No | 10 items | Strings only |
| authorName | String | Yes | 100 | Not empty |
| readTime | Number | No | - | > 0 |
| views | Number | No | - | >= 0 |
| likes | Number | No | - | >= 0 |
| isPremium | Boolean | No | - | - |
| thumbnail | String | No | 2048 | Valid URL |
| videoUrl | String | No | 2048 | Valid URL |
| sections | Array | No | 50 items | Strings |
| difficulty | String | No | 50 | Beginner/Intermediate/Advanced |

---

### 4. categories Collection

**Purpose:** Stores tutorial categories

**Access Rules:**
- Read: Public
- Write: Admins only

**Document Schema:**

```javascript
{
  name: "string",                             // Category name (document ID)
  description: "string",                      // Category description
  icon: "string",                             // Icon name or emoji
  color: "string",                            // Hex color code
  count: number,                              // Number of tutorials
  featured: boolean,                          // Show on homepage
  createdAt: Timestamp,                       // Creation date
  updatedAt: Timestamp                        // Last update
}
```

**Example:**

```json
{
  "name": "React",
  "description": "React library and ecosystem tutorials",
  "icon": "⚛️",
  "color": "#61DAFB",
  "count": 12,
  "featured": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-20T15:00:00Z"
}
```

---

## Data Relationships

### User ↔ Tutorials Relationship

```
adminUser/
  ├── uid: "abc123"
  └── savedTutorials: ["tut_001", "tut_002"]
        ↓
tutorial/
  ├── id: "tut_001"
  ├── authorName: "John Developer" (reference)
  └── ...
```

Users can save tutorial references in their profile.

---

## Indexing Strategy

**Recommended Indexes (for performance):**

1. **tutorials** collection:
   - Index on: `category`, `createdAt` (descending)
   - For: Category browsing with latest first

2. **tutorials** collection:
   - Index on: `category`, `views` (descending)
   - For: Popular tutorials by category

3. **tutorials** collection:
   - Index on: `isPremium`, `createdAt` (descending)
   - For: Premium content filtering

**Note:** Firestore creates indexes automatically for most queries. Composite indexes are created on-demand.

---

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Admin users collection
    match /adminUsers/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.uid != null && 
                     exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }
    
    // Regular users collection
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
      allow read, update: if request.auth.uid != null && 
                            exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }
    
    // Tutorials collection - public read, admin write
    match /tutorials/{tutorialId} {
      allow read: if true;
      allow create, update, delete: if request.auth.uid != null && 
                                      exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }
    
    // Categories collection - public read, admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
                      exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Data Size Estimates

**Storage Calculations:**

| Collection | Avg Doc Size | Est. Docs | Total Storage |
|------------|-------------|----------|---------------|
| tutorials | ~15 KB | 100 | ~1.5 MB |
| adminUsers | ~2 KB | 50 | ~100 KB |
| users | ~1 KB | 500 | ~500 KB |
| categories | ~0.5 KB | 20 | ~10 KB |
| **TOTAL** | - | 670 | ~2.1 MB |

**Read/Write Estimates (per day):**
- Reads: ~10,000 (mostly public tutorials)
- Writes: ~100 (admin operations)

---

## Migration Scenarios

### Import from CSV to Firestore

```javascript
import Papa from 'papaparse'; // CSV parser
import { createTutorial } from '../utils/firebaseHelpers';

async function importTutorialsFromCSV(csvFile) {
  Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
    async complete(results) {
      for (const row of results.data) {
        await createTutorial({
          title: row.title,
          description: row.description,
          content: row.content,
          category: row.category,
          readTime: parseInt(row.readTime),
          authorName: row.author,
          tags: row.tags?.split(',') || []
        });
      }
    }
  });
}
```

### Export Tutorials to JSON

```javascript
import { getAllTutorials } from '../utils/firebaseHelpers';

async function exportTutorialsToJSON() {
  const tutorials = await getAllTutorials();
  const json = JSON.stringify(tutorials, null, 2);
  
  // Download as file
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tutorials.json';
  link.click();
}
```

---

## Best Practices

### ✅ Do

- Use document IDs for references between collections
- Include timestamps with all data
- Normalize data to avoid duplication
- Index frequently queried fields
- Use subcollections for one-to-many relationships
- Validate data before writing
- Use batch operations for multiple writes

### ❌ Don't

- Store large files (use Cloud Storage instead)
- Store deeply nested data
- Create unlimited subcollections
- Store denormalized data that changes frequently
- Write to the same document > 1/second
- Query without indexes on large collections

---

## Troubleshooting

### "Permission denied" Error

**Cause:** User is not admin or security rules are too restrictive

**Solution:**
1. Check user is in adminUsers collection
2. Verify security rules allow the operation
3. Refresh authentication token

### Slow Queries

**Cause:** Missing indexes on queried fields

**Solution:**
1. Check Firestore index creation
2. Use composite indexes for complex queries
3. Limit result sets with `limit()`

### Data Inconsistency

**Cause:** Race conditions or concurrent updates

**Solution:**
1. Use transactions for atomic updates
2. Use batch operations
3. Add conflict resolution logic

---

## Related Files

- [TUTORIAL_DATA_GUIDE.md](./TUTORIAL_DATA_GUIDE.md) - Usage guide
- [firebaseHelpers.js](./src/utils/firebaseHelpers.js) - Helper functions
- [seed-tutorials.js](./seed-tutorials.js) - Sample data seeding
- [firestore.rules](./firestore.rules) - Security rules
- [QUICKSTART.md](./QUICKSTART.md) - Setup instructions
