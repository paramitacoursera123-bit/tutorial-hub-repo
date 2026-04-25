# Firestore Guide

Working with Cloud Firestore database.

---

## Introduction

Cloud Firestore is the database backend for the Tutorial Platform:
- ✅ NoSQL document database
- ✅ Real-time synchronization
- ✅ Offline support
- ✅ Automatic scaling
- ✅ Security rules integration

---

## Basic Concepts

### Collections
Collections are like tables in SQL databases. They contain documents.

**Collections in this project:**
- `adminUsers` - OAuth user profiles
- `users` - Email/password user profiles
- `tutorials` - Tutorial content
- `categories` - Tutorial categories

### Documents
Documents are like rows. They contain data as key-value pairs (fields).

**Example document:**
```javascript
{
  id: "tutorial-123",
  title: "React Guide",
  category: "react",
  published: true,
  views: 150
}
```

### Fields
Fields are individual data properties.

**Field types:**
- String: `"text"`
- Number: `42`, `3.14`
- Boolean: `true`, `false`
- Timestamp: `Timestamp.now()`
- Array: `["a", "b"]`
- Map: `{ name: "John" }`
- Null: `null`
- Reference: `doc(db, 'users/id')`

---

## CRUD Operations

### Create (C)

**Add a new document:**
```javascript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

async function createTutorial(title, content) {
  try {
    const docRef = await addDoc(collection(db, 'tutorials'), {
      title: title,
      content: content,
      createdAt: serverTimestamp(),
      published: false,
      viewCount: 0
    });
    console.log("Document created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating document:", error);
  }
}
```

**Set a specific document:**
```javascript
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

async function createUserProfile(userId, email, displayName) {
  try {
    await setDoc(doc(db, 'users', email), {
      email: email,
      displayName: displayName,
      createdAt: serverTimestamp()
    });
    console.log("Profile created");
  } catch (error) {
    console.error("Error creating profile:", error);
  }
}
```

---

### Read (R)

**Get a single document:**
```javascript
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

async function getTutorial(tutorialId) {
  try {
    const docSnap = await getDoc(doc(db, 'tutorials', tutorialId));
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
}
```

**Get all documents in collection:**
```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

async function getAllTutorials() {
  try {
    const querySnapshot = await getDocs(collection(db, 'tutorials'));
    const tutorials = [];
    
    querySnapshot.forEach((doc) => {
      tutorials.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return tutorials;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}
```

---

### Update (U)

**Update specific fields:**
```javascript
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

async function updateTutorial(tutorialId, title, content) {
  try {
    await updateDoc(doc(db, 'tutorials', tutorialId), {
      title: title,
      content: content,
      updatedAt: serverTimestamp()
    });
    console.log("Document updated");
  } catch (error) {
    console.error("Error updating document:", error);
  }
}
```

**Increment a field:**
```javascript
import { updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

async function incrementViewCount(tutorialId) {
  try {
    await updateDoc(doc(db, 'tutorials', tutorialId), {
      viewCount: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing:", error);
  }
}
```

**Update array field:**
```javascript
import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';

// Add item to array
await updateDoc(doc(db, 'tutorials', tutorialId), {
  tags: arrayUnion('new-tag')
});

// Remove item from array
await updateDoc(doc(db, 'tutorials', tutorialId), {
  tags: arrayRemove('old-tag')
});
```

---

### Delete (D)

**Delete a document:**
```javascript
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

async function deleteTutorial(tutorialId) {
  try {
    await deleteDoc(doc(db, 'tutorials', tutorialId));
    console.log("Document deleted");
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}
```

**Delete a field:**
```javascript
import { updateDoc, doc, deleteField } from 'firebase/firestore';
import { db } from '../firebase/config';

async function removeField(tutorialId) {
  try {
    await updateDoc(doc(db, 'tutorials', tutorialId), {
      fieldName: deleteField()
    });
  } catch (error) {
    console.error("Error deleting field:", error);
  }
}
```

---

## Queries

### Simple Queries

**Get documents where condition is true:**
```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

async function getPublishedTutorials() {
  try {
    const q = query(
      collection(db, 'tutorials'),
      where('published', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const tutorials = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return tutorials;
  } catch (error) {
    console.error("Error querying:", error);
  }
}
```

### Comparison Operators

```javascript
// Equal
where('status', '==', 'active')

// Not equal
where('status', '!=', 'deleted')

// Greater than
where('views', '>', 100)

// Greater than or equal
where('views', '>=', 100)

// Less than
where('views', '<', 50)

// Less than or equal
where('views', '<=', 50)
```

### Array Operations

```javascript
// Contains
where('tags', 'array-contains', 'react')

// Includes any of
where('tags', 'array-contains-any', ['react', 'vue'])

// Contains value(s)
where('authors', 'array-contains', userId)
```

### Complex Queries

**Multiple where clauses (AND logic):**
```javascript
const q = query(
  collection(db, 'tutorials'),
  where('published', '==', true),
  where('category', '==', 'react'),
  where('difficulty', '==', 'beginner')
);
```

**Ordering:**
```javascript
import { orderBy } from 'firebase/firestore';

// Ascending
const q = query(
  collection(db, 'tutorials'),
  where('published', '==', true),
  orderBy('createdAt', 'asc')
);

// Descending
const q = query(
  collection(db, 'tutorials'),
  where('published', '==', true),
  orderBy('createdAt', 'desc')
);
```

**Limiting results:**
```javascript
import { limit, startAt } from 'firebase/firestore';

// Get first 10
const q = query(
  collection(db, 'tutorials'),
  where('published', '==', true),
  orderBy('createdAt', 'desc'),
  limit(10)
);

// Pagination
const firstPage = query(
  collection(db, 'tutorials'),
  orderBy('createdAt', 'desc'),
  limit(10)
);

const lastVisible = firstPageDocs[firstPageDocs.length - 1];

const nextPage = query(
  collection(db, 'tutorials'),
  orderBy('createdAt', 'desc'),
  startAfter(lastVisible),
  limit(10)
);
```

---

## Real-Time Updates

### Listen for Changes

```javascript
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect, useState } from 'react';

function TutorialList() {
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    // Set up listener
    const q = query(
      collection(db, 'tutorials'),
      where('published', '==', true)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setTutorials(data);
    }, (error) => {
      console.error("Error:", error);
    });

    // Clean up listener
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {tutorials.map(tutorial => (
        <div key={tutorial.id}>{tutorial.title}</div>
      ))}
    </div>
  );
}
```

### Listen for Single Document

```javascript
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect, useState } from 'react';

function TutorialDetail({ tutorialId }) {
  const [tutorial, setTutorial] = useState(null);

  useEffect(() => {
    const docRef = doc(db, 'tutorials', tutorialId);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      setTutorial({ id: doc.id, ...doc.data() });
    }, (error) => {
      console.error("Error:", error);
    });

    return () => unsubscribe();
  }, [tutorialId]);

  return tutorial ? <div>{tutorial.title}</div> : <div>Loading...</div>;
}
```

---

## Transactions

**Multiple operations as single unit:**
```javascript
import { runTransaction, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

async function transferData(fromId, toId, amount) {
  try {
    await runTransaction(db, async (transaction) => {
      const fromRef = doc(db, 'accounts', fromId);
      const toRef = doc(db, 'accounts', toId);

      const fromSnap = await transaction.get(fromRef);
      const toSnap = await transaction.get(toRef);

      if (fromSnap.data().balance < amount) {
        throw new Error("Insufficient balance");
      }

      transaction.update(fromRef, {
        balance: fromSnap.data().balance - amount
      });
      transaction.update(toRef, {
        balance: toSnap.data().balance + amount
      });
    });
    console.log("Transaction successful");
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}
```

---

## Batch Writes

**Multiple operations:**
```javascript
import { writeBatch, collection, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

async function batchCreateTutorials(tutorials) {
  try {
    const batch = writeBatch(db);

    tutorials.forEach((tutorial) => {
      const docRef = doc(collection(db, 'tutorials'));
      batch.set(docRef, tutorial);
    });

    await batch.commit();
    console.log("Batch write successful");
  } catch (error) {
    console.error("Batch write failed:", error);
  }
}
```

---

## Indexes

### When Indexes are Required
- Composite queries (multiple where conditions with orderBy)
- Array-contains with other conditions
- Multiple inequality conditions on different fields

### Create Index
1. Go to Firebase Console
2. Firestore Database → Indexes
3. Click "Create Index"
4. Select collection and fields
5. Click "Create"

### Best Practices
- ✅ Firebase suggests creating indexes automatically
- ✅ Monitor query performance
- ✅ Add indexes for frequently queried fields

---

## Common Patterns

### Search by Text
```javascript
// Not ideal (scans all documents)
const q = query(
  collection(db, 'tutorials'),
  where('title', '==', searchText)
);

// Better: Use tags array
const q = query(
  collection(db, 'tutorials'),
  where('tags', 'array-contains', searchText)
);

// Best: Use full-text search library (Algolia, etc.)
```

### Pagination
```javascript
// Get first page
const firstPage = query(
  collection(db, 'tutorials'),
  orderBy('createdAt', 'desc'),
  limit(10)
);
const firstPageDocs = (await getDocs(firstPage)).docs;

// Get next page
const nextPage = query(
  collection(db, 'tutorials'),
  orderBy('createdAt', 'desc'),
  startAfter(firstPageDocs[firstPageDocs.length - 1]),
  limit(10)
);
```

### Aggregation
```javascript
// Count documents
const q = query(
  collection(db, 'tutorials'),
  where('published', '==', true)
);
const count = (await getDocs(q)).size;

// Sum values
const snapshot = await getDocs(collection(db, 'tutorials'));
const sum = snapshot.docs.reduce((acc, doc) => {
  return acc + (doc.data().views || 0);
}, 0);
```

---

## Performance Tips

### Optimize Queries
- ✅ Limit query results with `limit()`
- ✅ Create indexes for complex queries
- ✅ Use `where` clauses efficiently
- ✅ Paginate large results

### Optimize Writes
- ✅ Use batch writes for multiple documents
- ✅ Use transactions for related updates
- ✅ Avoid excessive document size

### Optimize Reads
- ✅ Cache results client-side
- ✅ Use `limit()` to reduce data
- ✅ Unsubscribe from listeners when done
- ✅ Use real-time only when needed

---

## Troubleshooting

### "Permission denied" Error
**Cause:** Firestore security rules blocking access

**Solution:**
1. Check Firebase Console → Firestore → Rules
2. Verify rules allow your operation
3. Check user authentication status
4. Verify user role if role-based rules

### "No such document" Error
**Cause:** Document doesn't exist

**Solution:**
1. Verify document ID is correct
2. Check collection name spelling
3. Create document if needed

### "Failed to get document" Error
**Cause:** Network or Firebase issue

**Solution:**
1. Check internet connection
2. Verify Firebase credentials
3. Check Firebase service status
4. Look at browser console for details

### Queries too slow
**Cause:** Missing index or inefficient query

**Solution:**
1. Check if index required
2. Create composite index if needed
3. Limit query scope with `where`
4. Consider query optimization

---

## Best Practices

- ✅ Always use try-catch for Firestore operations
- ✅ Validate data before writing
- ✅ Use timestamps (createdAt, updatedAt)
- ✅ Denormalize data wisely (balance between updates)
- ✅ Use references for relationships
- ✅ Monitor security rule violations
- ✅ Test queries before using in production
- ✅ Paginate large result sets
- ✅ Use real-time listeners sparingly

---

## Related Documentation
- [Database Schema](../database/SCHEMA.md)
- [Security Guide](./SECURITY.md)
- [API Reference](../api/API_REFERENCE.md)

---

**Last Updated:** April 24, 2026
