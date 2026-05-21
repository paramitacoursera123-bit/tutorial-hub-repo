import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Admin emails list - hardcoded admins
const ADMIN_EMAILS = [
  'pathikritsan80@gmail.com',
  'paramitacoursera123@gmail.com'
];

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add or update a Firestore admin user profile
  async function addAdminUser(user) {
    try {
      const adminUserRef = doc(db, 'adminUsers', user.uid);
      await setDoc(adminUserRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL || null,
        providerData: user.providerData.map(provider => ({
          provider: provider.providerId,
          uid: provider.uid,
          email: provider.email,
          displayName: provider.displayName,
          photoURL: provider.photoURL
        })),
        role: 'admin',
        createdAt: new Date(),
        lastLogin: new Date()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Error adding admin user:', err);
      setError(`Failed to create admin profile: ${err.message}`);
      return false;
    }
  }

  // Add or update a Firestore regular user profile
  async function addRegularUser(user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        providerData: user.providerData.map(provider => ({
          provider: provider.providerId,
          uid: provider.uid,
          email: provider.email,
          displayName: provider.displayName,
          photoURL: provider.photoURL
        })),
        role: 'user',
        createdAt: new Date(),
        lastLogin: new Date()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Error adding regular user:', err);
      setError(`Failed to create user profile: ${err.message}`);
      return false;
    }
  }

  // Check if user is in adminUsers collection
  async function checkAdminStatus(uid) {
    try {
      const adminUserRef = doc(db, 'adminUsers', uid);
      const docSnap = await getDoc(adminUserRef);
      return docSnap.exists();
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  }

  async function signup(email, password, displayName) {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Check if this email should be an admin
      const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase());
      
      if (isAdminEmail) {
        // Create admin user in adminUsers collection
        await setDoc(doc(db, 'adminUsers', result.user.uid), {
          uid: result.user.uid,
          email,
          displayName,
          photoURL: null,
          role: 'admin',
          createdAt: new Date(),
          lastLogin: new Date()
        }, { merge: true });
      } else {
        // Create regular user in users collection
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email,
          displayName,
          role: 'user',
          createdAt: new Date()
        }, { merge: true });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.code === 'auth/email-already-in-use' 
        ? 'Email already in use' 
        : err.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : err.message;
      setError(errorMessage);
      throw err;
    }
  }

  async function login(email, password) {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const errorMessage = err.code === 'auth/user-not-found' 
        ? 'No account found with this email' 
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : err.code === 'auth/too-many-requests'
        ? 'Too many failed login attempts. Try again later.'
        : err.message;
      setError(errorMessage);
      throw err;
    }
  }

  async function loginWithGoogle() {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      // Request additional scopes for profile data
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      
      // Check if email is in admin list OR if already has admin profile
      const isAdminEmail = ADMIN_EMAILS.includes(result.user.email.toLowerCase());
      const adminExists = await checkAdminStatus(result.user.uid);
      
      if (isAdminEmail || adminExists) {
        await addAdminUser(result.user);
      } else {
        await addRegularUser(result.user);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.code === 'auth/popup-closed-by-user' 
        ? 'Sign in was cancelled' 
        : err.code === 'auth/popup-blocked'
        ? 'Sign in popup was blocked. Please allow popups for this site.'
        : err.code === 'auth/unauthorized-domain'
        ? 'This domain is not authorized. Check Firebase Console configuration.'
        : err.message;
      setError(errorMessage);
      throw err;
    }
  }

  async function refreshUserRole(uid) {
    try {
      const userId = uid || auth.currentUser?.uid;
      if (!userId) return false;

      const adminUserRef = doc(db, 'adminUsers', userId);
      const adminSnap = await getDoc(adminUserRef);
      const isAdmin = adminSnap.exists();
      setUserRole(isAdmin ? 'admin' : 'user');
      return isAdmin;
    } catch (err) {
      console.error('Error refreshing user role:', err);
      return false;
    }
  }

  async function logout() {
    try {
      setError(null);
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
    } catch (err) {
      setError(`Failed to log out: ${err.message}`);
      throw err;
    }
  }

  // Set up authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          
          // Check if user is an admin (OAuth user or email-based admin)
          let isAdmin = false;
          
          // Check if in adminUsers collection
          const adminUserRef = doc(db, 'adminUsers', user.uid);
          const adminSnap = await getDoc(adminUserRef);
          isAdmin = adminSnap.exists();
          setUserRole(isAdmin ? 'admin' : 'user');
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Error in onAuthStateChanged:', err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    refreshUserRole,
    isAdmin: userRole === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}