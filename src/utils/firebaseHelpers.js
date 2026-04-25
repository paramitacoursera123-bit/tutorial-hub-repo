import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId) {
  try {
    const userRef = doc(db, 'adminUsers', userId);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

/**
 * Add or update user profile with additional data
 */
export async function updateUserProfile(userId, data) {
  try {
    const userRef = doc(db, 'adminUsers', userId);
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Store user profile picture URL
 */
export async function updateProfilePicture(userId, photoURL) {
  try {
    const userRef = doc(db, 'adminUsers', userId);
    await updateDoc(userRef, {
      photoURL,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
}

/**
 * Get user profile data
 */
export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'adminUsers', userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

/**
 * Get all admin users
 */
export async function getAllAdminUsers() {
  try {
    const snapshot = await getDocs(collection(db, 'adminUsers'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting admin users:', error);
    throw error;
  }
}

/**
 * Promote a regular user to admin
 */
export async function promoteUserToAdmin(userId, email, displayName) {
  try {
    const adminUserRef = doc(db, 'adminUsers', userId);
    await setDoc(adminUserRef, {
      uid: userId,
      email,
      displayName,
      promotedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      role: 'admin'
    }, { merge: true });

    // Remove from regular users collection if exists
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    throw error;
  }
}

/**
 * Remove admin privileges from a user
 */
export async function demoteAdminToUser(userId, email, displayName) {
  try {
    // Remove from admin collection
    const adminUserRef = doc(db, 'adminUsers', userId);
    await deleteDoc(adminUserRef);

    // Add to regular users collection
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      email,
      displayName,
      role: 'user',
      demotedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error demoting admin user:', error);
    throw error;
  }
}
