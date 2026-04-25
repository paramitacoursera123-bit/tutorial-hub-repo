---
description: 'Use when: working with Firestore database, adding data access, or managing collections'
applyTo: 'src/utils/firebaseHelpers.js'
---

# Firestore Helper Functions

## Overview

This file provides reusable utility functions for common Firestore operations. Import and use these instead of writing raw Firestore code.

## Available Functions

### User Management

#### updateLastLogin(userId)
```javascript
import { updateLastLogin } from '../utils/firebaseHelpers';

// Update user's last login timestamp
await updateLastLogin(userId);
```
- Updates `lastLogin` field on admin user
- Use after successful login to track activity
- Automatically uses serverTimestamp()

#### updateUserProfile(userId, data)
```javascript
await updateUserProfile(userId, {
  displayName: 'New Name',
  bio: 'User bio',
  customField: 'value'
});
```
- Merges data into user profile (doesn't overwrite)
- Use to update admin user information
- Automatically updates `updatedAt` timestamp

#### updateProfilePicture(userId, photoURL)
```javascript
await updateProfilePicture(userId, 'https://...');
```
- Stores profile picture URL
- Use after uploading image to Cloud Storage
- Updates both photoURL and updatedAt

#### getUserProfile(userId)
```javascript
const profile = await getUserProfile(userId);
if (profile) {
  console.log(profile.email, profile.displayName);
}
```
- Fetches complete user profile
- Returns null if user doesn't exist
- Use to load user data on profile page

#### getAllAdminUsers()
```javascript
const admins = await getAllAdminUsers();
admins.forEach(admin => {
  console.log(admin.displayName);
});
```
- Returns array of all admin users
- Includes id field with user uid
- Use for admin list pages

### Role Management

#### promoteUserToAdmin(userId, email, displayName)
```javascript
await promoteUserToAdmin(userId, 'user@example.com', 'User Name');
```
- Moves user from `users` collection to `adminUsers`
- Grants admin privileges
- Sets promotedAt timestamp
- Use in admin user management interface

#### demoteAdminToUser(userId, email, displayName)
```javascript
await demoteAdminToUser(userId, 'user@example.com', 'User Name');
```
- Moves admin from `adminUsers` collection to `users`
- Removes admin privileges
- Sets demotedAt timestamp
- Use in admin user management interface

## Usage Pattern

```javascript
import { 
  updateLastLogin, 
  updateUserProfile, 
  getUserProfile,
  promoteUserToAdmin 
} from '../utils/firebaseHelpers';

// In a component
async function handleProfileUpdate() {
  try {
    const userId = currentUser.uid;
    
    // Update profile
    await updateUserProfile(userId, {
      displayName: newName,
      bio: newBio
    });
    
    // Update last login
    await updateLastLogin(userId);
    
    setSuccess('Profile updated');
  } catch (error) {
    setError('Failed to update profile');
  }
}
```

## Error Handling

All functions throw errors on failure:
```javascript
try {
  await updateUserProfile(userId, data);
} catch (error) {
  console.error('Error updating profile:', error);
  setError('Failed to update profile: ' + error.message);
}
```

## When to Add New Helper Functions

Add a function when:
1. Multiple files need the same Firestore operation
2. Operation involves multiple steps (e.g., transaction)
3. Business logic is complex (validation, calculations)
4. Code is repeated in multiple components

Example: Add a function for creating tutorials
```javascript
export async function createTutorial(adminId, tutorialData) {
  try {
    const docRef = await addDoc(collection(db, 'tutorials'), {
      ...tutorialData,
      createdBy: adminId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating tutorial:', error);
    throw error;
  }
}
```

## Firestore Operations Not in Helpers

For custom operations, import directly from Firebase:
```javascript
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Example: Get tutorials by category
async function getTutorialsByCategory(category) {
  const q = query(
    collection(db, 'tutorials'),
    where('category', '==', category)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

## Best Practices

1. **Use serverTimestamp()** for any timestamps
2. **Always include error handling** - functions throw errors
3. **Don't query unnecessary data** - Only fetch fields you need
4. **Use merge: true** when updating to avoid overwriting
5. **Add to helpers** if reused across components
6. **Include comments** for complex operations

## Related Files

- `src/contexts/AuthContext.jsx` - Uses helpers indirectly
- `src/firebase/config.js` - Exports db instance used by all helpers
- `firestore.rules` - Security rules that control access
- Any page/component that needs data access
