import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  addDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ========================
// FALLBACK STORAGE (localStorage when Firestore unavailable)
// ========================

/**
 * Initialize localStorage for tutorials
 */
function initializeLocalStorage() {
  if (!localStorage.getItem('tutorials')) {
    localStorage.setItem('tutorials', JSON.stringify([]));
  }
}

/**
 * Get tutorials from localStorage
 */
function getTutorialsFromStorage() {
  initializeLocalStorage();
  try {
    return JSON.parse(localStorage.getItem('tutorials') || '[]');
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save tutorials to localStorage
 */
function saveTutorialsToStorage(tutorials) {
  try {
    localStorage.setItem('tutorials', JSON.stringify(tutorials));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Generate unique ID for local storage
 */
function generateId() {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

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

// ========================
// TUTORIAL FUNCTIONS
// ========================

/**
 * Create a new tutorial (Admin only)
 * Falls back to localStorage if Firestore is unavailable
 * @param {Object} tutorialData - Tutorial data
 * @param {String} tutorialId - Optional: preserve this ID instead of generating a new one
 */
export async function createTutorial(tutorialData, tutorialId = null) {
  console.log('🔵 createTutorial called with ID:', tutorialId, 'Status:', tutorialData?.status);
  
  try {
    const newTutorial = {
      ...tutorialData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: []
    };
    
    if (tutorialId) {
      // If ID is provided, use setDoc to preserve the ID
      const docRef = doc(db, 'tutorials', tutorialId);
      await setDoc(docRef, newTutorial, { merge: true });
      console.log('✅ Tutorial created in Firestore with preserved ID:', tutorialId);
      return tutorialId;
    } else {
      // Otherwise generate new ID
      const docRef = await addDoc(collection(db, 'tutorials'), newTutorial);
      console.log('✅ Tutorial created in Firestore with new ID:', docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.warn('⚠️ Firestore unavailable, using localStorage:', error.message);
    
    // Fallback to localStorage
    const tutorials = getTutorialsFromStorage();
    console.log('📋 Current tutorials in localStorage before create:', tutorials.map(t => ({ id: t.id, status: t.status })));
    
    const newTutorial = {
      id: tutorialId || generateId(),
      ...tutorialData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [],
      views: 0,
      likes: 0
    };
    
    // Check if tutorial already exists
    const existingIndex = tutorials.findIndex(t => t.id === newTutorial.id);
    if (existingIndex !== -1) {
      // Update existing
      tutorials[existingIndex] = newTutorial;
      console.log('🔄 Updated existing tutorial in localStorage:', newTutorial.id);
    } else {
      // Add new
      tutorials.push(newTutorial);
      console.log('➕ Added new tutorial to localStorage:', newTutorial.id);
    }
    
    saveTutorialsToStorage(tutorials);
    console.log('💾 Saved to localStorage. Total tutorials now:', tutorials.length);
    console.log('📋 All tutorials in localStorage:', tutorials.map(t => ({ id: t.id, status: t.status })));
    return newTutorial.id;
  }
}

/**
 * Get all tutorials from Firestore or localStorage
 */
export async function getAllTutorials() {
  console.log('🔵 getAllTutorials called');
  
  try {
    const tutorialsRef = collection(db, 'tutorials');
    const q = query(tutorialsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const firestoreTutorials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('📚 Firestore returned', firestoreTutorials.length, 'tutorials:', 
      firestoreTutorials.map(t => ({ id: t.id, title: t.title, status: t.status })));
    
    // If Firestore returns data, use it
    if (firestoreTutorials.length > 0) {
      return firestoreTutorials;
    }
    
    // Otherwise try localStorage
    const localTutorials = getTutorialsFromStorage().sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    console.log('📋 Using localStorage:', localTutorials.length, 'tutorials:', 
      localTutorials.map(t => ({ id: t.id, title: t.title, status: t.status })));
    
    return localTutorials;
  } catch (error) {
    console.warn('⚠️ Firestore unavailable, using localStorage:', error.message);
    
    // Fallback to localStorage
    const localTutorials = getTutorialsFromStorage().sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    console.log('📋 Fallback - Using localStorage:', localTutorials.length, 'tutorials:', 
      localTutorials.map(t => ({ id: t.id, title: t.title, status: t.status })));
    
    return localTutorials;
  }
}

/**
 * Get a single tutorial by ID (from Firestore or localStorage)
 */
export async function getTutorial(tutorialId) {
  try {
    const docRef = doc(db, 'tutorials', tutorialId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (error) {
    console.warn('Firestore unavailable, checking localStorage:', error.message);
  }
  
  // Fallback to localStorage
  const tutorials = getTutorialsFromStorage();
  const tutorial = tutorials.find(t => t.id === tutorialId);
  return tutorial || null;
}

/**
 * Update a tutorial (Admin only) - Firestore with localStorage fallback
 */
export async function updateTutorial(tutorialId, updates) {
  try {
    const tutorialRef = doc(db, 'tutorials', tutorialId);
    const currentDoc = await getDoc(tutorialRef);
    if (currentDoc.exists()) {
      const currentData = currentDoc.data();
      const previousSnapshot = {
        ...currentData,
        versionedAt: new Date().toISOString()
      };

      const newVersions = Array.isArray(currentData.versions) ? [...currentData.versions, previousSnapshot] : [previousSnapshot];

      const updatedData = {
        ...currentData,
        ...updates,
        versions: newVersions,
        updatedAt: new Date().toISOString()
      };

      // overwrite with merged data
      await setDoc(tutorialRef, updatedData, { merge: true });
      return;
    }
    // If doc doesn't exist, fall back to simple update
    await updateDoc(tutorialRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore unavailable, using localStorage:', error.message);
    
    // Fallback to localStorage
    const tutorials = getTutorialsFromStorage();
    const index = tutorials.findIndex(t => t.id === tutorialId);
    if (index !== -1) {
      const current = tutorials[index];
      const previousSnapshot = { ...current, versionedAt: new Date().toISOString() };
      const newVersions = Array.isArray(current.versions) ? [...current.versions, previousSnapshot] : [previousSnapshot];

      tutorials[index] = {
        ...current,
        ...updates,
        versions: newVersions,
        updatedAt: new Date().toISOString()
      };
      saveTutorialsToStorage(tutorials);
      console.log('✅ Tutorial updated in localStorage:', tutorialId);
    }
  }
}

/**
 * Delete a tutorial (Admin only) - Firestore with localStorage fallback
 */
export async function deleteTutorial(tutorialId) {
  let firestoreDeleted = false;

  try {
    await deleteDoc(doc(db, 'tutorials', tutorialId));
    firestoreDeleted = true;
    console.log('✅ Tutorial delete request sent to Firestore:', tutorialId);
  } catch (error) {
    console.warn('⚠️ Firestore delete failed:', error.message);
  }

  // Always remove the tutorial from localStorage fallback as well,
  // since Firestore may be available but the item still exists only in localStorage.
  try {
    const tutorials = getTutorialsFromStorage();
    console.log('📋 Tutorials in localStorage before delete:', tutorials.map(t => ({ id: t.id, status: t.status })));

    const filtered = tutorials.filter(t => t.id !== tutorialId);
    if (filtered.length < tutorials.length) {
      saveTutorialsToStorage(filtered);
      console.log('✅ Tutorial deleted from localStorage fallback:', tutorialId);
      console.log('📋 Tutorials in localStorage after delete:', filtered.map(t => ({ id: t.id, status: t.status })));
    } else {
      console.log('ℹ️ Tutorial not found in localStorage fallback:', tutorialId);
    }
  } catch (storageError) {
    console.error('❌ Failed to delete tutorial from localStorage fallback:', storageError);
  }

  if (!firestoreDeleted) {
    console.warn('⚠️ Tutorial was removed from localStorage fallback, but Firestore delete did not succeed.');
  }
}

/**
 * Search tutorials by title or category - Firestore with localStorage fallback
 */
export async function searchTutorials(searchTerm = '', category = null) {
  try {
    const tutorialsRef = collection(db, 'tutorials');
    let q;
    
    if (category && category !== 'all') {
      q = query(tutorialsRef, where('category', '==', category), orderBy('createdAt', 'desc'));
    } else {
      q = query(tutorialsRef, orderBy('createdAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // If we got results from Firestore, use them
    if (results.length > 0) {
      // Filter by search term (title or description)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(t => 
          (t.title && t.title.toLowerCase().includes(term)) || 
          (t.description && t.description.toLowerCase().includes(term))
        );
      }
      return results;
    }
  } catch (error) {
    console.warn('Firestore unavailable, using localStorage:', error.message);
  }
  
  // Fallback to localStorage
  let tutorials = getTutorialsFromStorage();
  
  // Filter by category
  if (category && category !== 'all') {
    tutorials = tutorials.filter(t => t.category === category);
  }
  
  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    tutorials = tutorials.filter(t => 
      (t.title && t.title.toLowerCase().includes(term)) || 
      (t.description && t.description.toLowerCase().includes(term))
    );
  }
  
  return tutorials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get tutorials by category - Firestore with localStorage fallback
 */
export async function getTutorialsByCategory(category) {
  try {
    const tutorialsRef = collection(db, 'tutorials');
    const q = query(
      tutorialsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    if (results.length > 0) {
      return results;
    }
  } catch (error) {
    console.warn('Firestore unavailable, using localStorage:', error.message);
  }
  
  // Fallback to localStorage
  return getTutorialsFromStorage()
    .filter(t => t.category === category)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get all unique categories
 */
export async function getAllCategories() {
  try {
    const tutorials = await getAllTutorials();
    const categories = new Set(
      tutorials
        .map(t => t.category)
        .filter(category => category && category.trim() !== '')
    );
    return Array.from(categories).sort();
  } catch (error) {
    console.warn('Error getting categories:', error.message);
    return [];
  }
}


/**
 * Increment tutorial view count
 */
export async function incrementTutorialViews(tutorialId) {
  try {
    const tutorialRef = doc(db, 'tutorials', tutorialId);
    const currentDoc = await getDoc(tutorialRef);
    await updateDoc(tutorialRef, {
      views: (currentDoc.data()?.views || 0) + 1
    });
  } catch (error) {
    console.warn('Firestore unavailable for views, using localStorage:', error.message);
    
    // Fallback to localStorage
    const tutorials = getTutorialsFromStorage();
    const tutorial = tutorials.find(t => t.id === tutorialId);
    if (tutorial) {
      tutorial.views = (tutorial.views || 0) + 1;
      saveTutorialsToStorage(tutorials);
    }
  }
}

/**
 * Get popular tutorials (most viewed)
 */
export async function getPopularTutorials(limit = 5) {
  try {
    const tutorials = await getAllTutorials();
    return tutorials
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  } catch (error) {
    console.warn('Error getting popular tutorials:', error.message);
    return [];
  }
}

/**
 * Get latest tutorials
 */
export async function getLatestTutorials(limit = 5) {
  try {
    const tutorials = await getAllTutorials();
    return tutorials.slice(0, limit);
  } catch (error) {
    console.warn('Error getting latest tutorials:', error.message);
    return [];
  }
}

/**
 * Determine the user document reference for saved tutorial operations.
 */
function getUserDocRef(userId, userRole = 'user') {
  const collectionName = userRole === 'admin' ? 'adminUsers' : 'users';
  return doc(db, collectionName, userId);
}

function getSavedTutorialsStorageKey(userId) {
  return `savedTutorials_${userId || 'guest'}`;
}

function getSavedTutorialIdsFromStorage(userId) {
  try {
    const stored = localStorage.getItem(getSavedTutorialsStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading saved tutorials from localStorage:', error);
    return [];
  }
}

function saveSavedTutorialIdsToStorage(userId, ids) {
  try {
    localStorage.setItem(getSavedTutorialsStorageKey(userId), JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving saved tutorials to localStorage:', error);
  }
}

/**
 * Get user's saved tutorial IDs
 */
export async function getUserSavedTutorialIds(userId, userRole = 'user') {
  if (!userId) {
    return getSavedTutorialIdsFromStorage('guest');
  }

  try {
    const userRef = getUserDocRef(userId, userRole);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data()?.savedTutorials || [];
    }
  } catch (error) {
    console.warn('Error reading saved tutorial ids from Firestore, using localStorage:', error);
  }

  return getSavedTutorialIdsFromStorage(userId);
}

/**
 * Add tutorial to user's saved list
 */
export async function saveTutorialToUser(userId, tutorialId, userRole = 'user') {
  if (!userId) {
    const savedIds = getSavedTutorialIdsFromStorage('guest');
    if (!savedIds.includes(tutorialId)) {
      const nextIds = [...savedIds, tutorialId];
      saveSavedTutorialIdsToStorage('guest', nextIds);
    }
    return;
  }

  try {
    const userRef = getUserDocRef(userId, userRole);
    const userDoc = await getDoc(userRef);
    const savedTutorials = userDoc.data()?.savedTutorials || [];

    if (!savedTutorials.includes(tutorialId)) {
      await updateDoc(userRef, {
        savedTutorials: [...savedTutorials, tutorialId],
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.warn('Error saving tutorial to Firestore, using localStorage:', error);
    const savedIds = getSavedTutorialIdsFromStorage(userId);
    if (!savedIds.includes(tutorialId)) {
      saveSavedTutorialIdsToStorage(userId, [...savedIds, tutorialId]);
    }
  }
}

/**
 * Remove tutorial from user's saved list
 */
export async function removeSavedTutorial(userId, tutorialId, userRole = 'user') {
  if (!userId) {
    const savedIds = getSavedTutorialIdsFromStorage('guest');
    saveSavedTutorialIdsToStorage('guest', savedIds.filter(id => id !== tutorialId));
    return;
  }

  try {
    const userRef = getUserDocRef(userId, userRole);
    const userDoc = await getDoc(userRef);
    const savedTutorials = userDoc.data()?.savedTutorials || [];

    await updateDoc(userRef, {
      savedTutorials: savedTutorials.filter(id => id !== tutorialId),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.warn('Error removing saved tutorial from Firestore, using localStorage:', error);
    const savedIds = getSavedTutorialIdsFromStorage(userId);
    saveSavedTutorialIdsToStorage(userId, savedIds.filter(id => id !== tutorialId));
  }
}

/**
 * Get user's saved tutorials
 */
export async function getUserSavedTutorials(userId, userRole = 'user') {
  try {
    const savedTutorialIds = await getUserSavedTutorialIds(userId, userRole);
    const tutorials = [];
    for (const tutorialId of savedTutorialIds) {
      const tutorial = await getTutorial(tutorialId);
      if (tutorial) {
        tutorials.push(tutorial);
      }
    }
    return tutorials;
  } catch (error) {
    console.error('Error getting saved tutorials:', error);
    return [];
  }
}

function getPurchasedTutorialsStorageKey(userId) {
  return `purchasedTutorials_${userId || 'guest'}`;
}

function getPurchasedTutorialIdsFromStorage(userId) {
  try {
    const stored = localStorage.getItem(getPurchasedTutorialsStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading purchased tutorials from localStorage:', error);
    return [];
  }
}

function savePurchasedTutorialIdsToStorage(userId, ids) {
  try {
    localStorage.setItem(getPurchasedTutorialsStorageKey(userId), JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving purchased tutorials to localStorage:', error);
  }
}

export async function getUserPurchasedTutorialIds(userId, userRole = 'user') {
  if (!userId) {
    return [];
  }

  try {
    const userRef = getUserDocRef(userId, userRole);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data()?.purchasedTutorials || [];
    }
  } catch (error) {
    console.warn('Error reading purchased tutorial ids from Firestore, using localStorage:', error);
  }

  return getPurchasedTutorialIdsFromStorage(userId);
}

export async function savePurchasedTutorial(userId, tutorialId, userRole = 'user') {
  if (!userId) {
    const purchasedIds = getPurchasedTutorialIdsFromStorage('guest');
    if (!purchasedIds.includes(tutorialId)) {
      savePurchasedTutorialIdsToStorage('guest', [...purchasedIds, tutorialId]);
    }
    return;
  }

  try {
    const userRef = getUserDocRef(userId, userRole);
    const userDoc = await getDoc(userRef);
    const purchasedTutorials = userDoc.data()?.purchasedTutorials || [];

    if (!purchasedTutorials.includes(tutorialId)) {
      await updateDoc(userRef, {
        purchasedTutorials: [...purchasedTutorials, tutorialId],
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.warn('Error saving purchased tutorial to Firestore, using localStorage:', error);
    const purchasedIds = getPurchasedTutorialIdsFromStorage(userId);
    if (!purchasedIds.includes(tutorialId)) {
      savePurchasedTutorialIdsToStorage(userId, [...purchasedIds, tutorialId]);
    }
  }
}

export async function userHasPurchasedTutorial(userId, tutorialId, userRole = 'user') {
  if (!userId) {
    return false;
  }

  const purchasedIds = await getUserPurchasedTutorialIds(userId, userRole);
  return purchasedIds.includes(tutorialId);
}

// ========================
// ANALYTICS FUNCTIONS
// ========================

/**
 * Get total platform analytics
 */
export async function getTotalAnalytics() {
  try {
    const tutorials = await getAllTutorials();
    const adminsSnapshot = await getDocs(collection(db, 'adminUsers'));
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    const totalViews = tutorials.reduce((sum, t) => sum + (t.views || 0), 0);
    const totalLikes = tutorials.reduce((sum, t) => sum + (t.likes || 0), 0);
    const totalTutorials = tutorials.length;
    const totalUsers = adminsSnapshot.size + usersSnapshot.size;
    
    return {
      totalTutorials,
      totalUsers,
      totalViews,
      totalLikes,
      averageViewsPerTutorial: totalTutorials > 0 ? Math.round(totalViews / totalTutorials) : 0
    };
  } catch (error) {
    console.error('Error getting total analytics:', error);
    return {
      totalTutorials: 0,
      totalUsers: 0,
      totalViews: 0,
      totalLikes: 0,
      averageViewsPerTutorial: 0
    };
  }
}

/**
 * Get top tutorials by views
 */
export async function getTopTutorialsByViews(limit = 5) {
  try {
    const tutorials = await getAllTutorials();
    return tutorials
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit)
      .map(t => ({
        id: t.id,
        title: t.title,
        views: t.views || 0,
        likes: t.likes || 0,
        category: t.category
      }));
  } catch (error) {
    console.error('Error getting top tutorials by views:', error);
    return [];
  }
}

/**
 * Get top tutorials by rating
 */
export async function getTopTutorialsByRating(limit = 5) {
  try {
    const tutorials = await getAllTutorials();
    return tutorials
      .filter(t => (t.ratingCount || 0) > 0)
      .sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0))
      .slice(0, limit)
      .map(t => ({
        id: t.id,
        title: t.title,
        rating: (t.ratingAverage || 0).toFixed(1),
        ratingCount: t.ratingCount || 0,
        category: t.category
      }));
  } catch (error) {
    console.error('Error getting top tutorials by rating:', error);
    return [];
  }
}

/**
 * Get recent user signups
 */
export async function getRecentUsers(limit = 10) {
  try {
    const adminsSnapshot = await getDocs(collection(db, 'adminUsers'));
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    const allUsers = [
      ...adminsSnapshot.docs.map(doc => ({
        ...doc.data(),
        role: 'admin'
      })),
      ...usersSnapshot.docs.map(doc => ({
        ...doc.data(),
        role: 'user'
      }))
    ];
    
    return allUsers
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date();
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date();
        return dateB - dateA;
      })
      .slice(0, limit)
      .map(u => ({
        email: u.email,
        displayName: u.displayName || 'Unknown',
        role: u.role,
        createdAt: u.createdAt?.toDate?.() || new Date(u.createdAt)
      }));
  } catch (error) {
    console.error('Error getting recent users:', error);
    return [];
  }
}

/**
 * Get category distribution
 */
export async function getCategoryDistribution() {
  try {
    const tutorials = await getAllTutorials();
    const categoryMap = {};
    
    tutorials.forEach(t => {
      const category = t.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    
    return Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error getting category distribution:', error);
    return [];
  }
}
