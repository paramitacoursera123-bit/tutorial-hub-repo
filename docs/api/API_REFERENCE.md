# API Reference

Complete reference for Firebase and helper function APIs.

---

## Firebase Authentication API

### Sign Up (Email/Password)

**Function:** `createUserWithEmailAndPassword(auth, email, password)`

```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

try {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    "user@example.com",
    "password123"
  );
  const user = userCredential.user;
  console.log("User created:", user.uid);
} catch (error) {
  console.error("Signup error:", error.code);
}
```

**Returns:** `UserCredential` object with user info

---

### Login (Email/Password)

**Function:** `signInWithEmailAndPassword(auth, email, password)`

```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

try {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    "user@example.com",
    "password123"
  );
  const user = userCredential.user;
  console.log("Logged in:", user.email);
} catch (error) {
  console.error("Login error:", error.code);
}
```

**Returns:** `UserCredential` object

---

### Sign In with OAuth

**Function:** `signInWithPopup(auth, provider)`

```javascript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

try {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  console.log("OAuth login:", user.displayName);
} catch (error) {
  console.error("OAuth error:", error.code);
}
```

**Returns:** `UserCredential` object

---

### Sign Out

**Function:** `signOut(auth)`

```javascript
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

try {
  await signOut(auth);
  console.log("User logged out");
} catch (error) {
  console.error("Logout error:", error);
}
```

---

### Listen for Auth State Changes

**Function:** `onAuthStateChanged(auth, callback)`

```javascript
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useEffect } from 'react';

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User logged in:", user.email);
    } else {
      console.log("User logged out");
    }
  });

  // Cleanup subscription
  return () => unsubscribe();
}, []);
```

---

## Firestore API

### Get Collection Reference

**Function:** `collection(db, collectionName)`

```javascript
import { collection } from 'firebase/firestore';
import { db } from '../firebase/config';

const tutorialsRef = collection(db, 'tutorials');
```

---

### Get Document Reference

**Function:** `doc(db, collectionName, documentId)`

```javascript
import { doc } from 'firebase/firestore';
import { db } from '../firebase/config';

const userRef = doc(db, 'users', 'user-uid');
```

---

### Create Document

**Function:** `setDoc(ref, data, options?)`

```javascript
import { setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

try {
  await setDoc(doc(db, 'users', 'user-id'), {
    email: 'user@example.com',
    displayName: 'John Doe',
    createdAt: serverTimestamp()
  });
} catch (error) {
  console.error("Create error:", error);
}
```

---

### Read Document

**Function:** `getDoc(ref)`

```javascript
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

try {
  const docRef = doc(db, 'users', 'user-id');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
} catch (error) {
  console.error("Read error:", error);
}
```

**Returns:** `DocumentSnapshot`

---

### Read Multiple Documents

**Function:** `getDocs(query)`

```javascript
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

try {
  const querySnapshot = await getDocs(collection(db, 'tutorials'));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
} catch (error) {
  console.error("Read error:", error);
}
```

---

### Update Document

**Function:** `updateDoc(ref, data)`

```javascript
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

try {
  await updateDoc(doc(db, 'users', 'user-id'), {
    displayName: 'Jane Doe',
    updatedAt: serverTimestamp()
  });
} catch (error) {
  console.error("Update error:", error);
}
```

---

### Delete Document

**Function:** `deleteDoc(ref)`

```javascript
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

try {
  await deleteDoc(doc(db, 'users', 'user-id'));
} catch (error) {
  console.error("Delete error:", error);
}
```

---

### Query Documents

**Function:** `query(collectionRef, ...constraints)`

```javascript
import { 
  query, 
  collection, 
  where, 
  orderBy,
  limit,
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase/config';

try {
  const q = query(
    collection(db, 'tutorials'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  
  const querySnapshot = await getDocs(q);
  // Process results
} catch (error) {
  console.error("Query error:", error);
}
```

---

### Query Operators

**Equality:**
```javascript
where('field', '==', value)
```

**Comparison:**
```javascript
where('age', '>', 18)
where('age', '>=', 18)
where('age', '<', 65)
where('age', '<=', 65)
where('field', '!=', value)
```

**Arrays:**
```javascript
where('tags', 'array-contains', 'react')
where('tags', 'array-contains-any', ['react', 'vue'])
```

**Range:**
```javascript
where('date', '>=', startDate)
where('date', '<=', endDate)
```

---

### Ordering

**Function:** `orderBy(field, direction?)`

```javascript
import { orderBy } from 'firebase/firestore';

// Ascending (default)
orderBy('createdAt')

// Descending
orderBy('createdAt', 'desc')
```

---

### Limiting Results

**Function:** `limit(n)`

```javascript
import { limit } from 'firebase/firestore';

// Get first 10 documents
limit(10)
```

---

## Helper Functions

Helper functions are in `src/utils/firebaseHelpers.js`

### Update Last Login

**Function:** `updateLastLogin(userId)`

```javascript
import { updateLastLogin } from '../utils/firebaseHelpers';

await updateLastLogin('user-uid');
```

**Updates:** `lastLogin` timestamp in Firestore

---

### Update User Profile

**Function:** `updateUserProfile(userId, data)`

```javascript
import { updateUserProfile } from '../utils/firebaseHelpers';

await updateUserProfile('user-uid', {
  displayName: 'New Name',
  phone: '123-456-7890'
});
```

**Parameters:**
- `userId` - Firebase Auth UID
- `data` - Object with fields to update

---

### Update Profile Picture

**Function:** `updateProfilePicture(userId, photoURL)`

```javascript
import { updateProfilePicture } from '../utils/firebaseHelpers';

await updateProfilePicture('user-uid', 'https://example.com/photo.jpg');
```

---

### Get User Profile

**Function:** `getUserProfile(userId)`

```javascript
import { getUserProfile } from '../utils/firebaseHelpers';

const profile = await getUserProfile('user-uid');
console.log(profile);
```

**Returns:** User object from Firestore

---

### Get All Admin Users

**Function:** `getAllAdminUsers()`

```javascript
import { getAllAdminUsers } from '../utils/firebaseHelpers';

const admins = await getAllAdminUsers();
console.log(admins);
```

**Returns:** Array of admin user objects

---

### Promote User to Admin

**Function:** `promoteUserToAdmin(userId, email, displayName)`

```javascript
import { promoteUserToAdmin } from '../utils/firebaseHelpers';

await promoteUserToAdmin('user-uid', 'user@example.com', 'John Doe');
```

**Effect:** Moves user from `users` to `adminUsers` collection

---

### Demote Admin to User

**Function:** `demoteAdminToUser(userId, email, displayName)`

```javascript
import { demoteAdminToUser } from '../utils/firebaseHelpers';

await demoteAdminToUser('user-uid', 'user@example.com', 'John Doe');
```

**Effect:** Moves user from `adminUsers` to `users` collection

---

## React Hooks

### useAuth Hook

```javascript
import { useAuth } from '../contexts/AuthContext';

const {
  currentUser,      // Current user object
  userRole,         // "admin" or "user"
  isAdmin,          // boolean
  loading,          // boolean
  error,            // string
  login,            // Function
  signup,           // Function
  logout,           // Function
  loginWithGoogle,  // Function
  loginWithGithub   // Function
} = useAuth();
```

---

### useTheme Hook

```javascript
import { useTheme } from '../contexts/ThemeContext';

const {
  theme,            // "light" or "dark"
  toggleTheme,      // Function
  setTheme          // Function
} = useTheme();
```

---

## Common API Patterns

### Safe Async Operation

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleAction = async () => {
  try {
    setError('');
    setLoading(true);
    
    // API call here
    const result = await someApiCall();
    
    return result;
  } catch (err) {
    setError(err.message);
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

### Query with Error Handling

```javascript
const fetchTutorials = async () => {
  try {
    const q = query(
      collection(db, 'tutorials'),
      where('published', '==', true)
    );
    
    const snapshot = await getDocs(q);
    const tutorials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return tutorials;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

---

## Error Handling

### Common Firebase Errors

```javascript
const handleFirebaseError = (error) => {
  const errorCode = error.code;
  const errorMessage = error.message;

  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Email already registered';
    case 'auth/weak-password':
      return 'Password too weak (min 6 chars)';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'permission-denied':
      return 'Access denied';
    default:
      return errorMessage;
  }
};
```

---

## Related Documentation
- [Firestore Guide](../guides/FIRESTORE.md)
- [Helper Functions](./HELPERS.md)
- [Database Schema](../database/SCHEMA.md)

---

**Last Updated:** April 24, 2026
