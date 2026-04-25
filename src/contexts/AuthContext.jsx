import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add user to Firestore adminUsers collection (all OAuth users are admins)
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
      
      // Create user profile in Firestore (regular user, not admin)
      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        displayName,
        role: 'user',
        createdAt: new Date(),
      });
      
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
      
      // Add user to adminUsers collection (all OAuth users are admins)
      await addAdminUser(result.user);
      
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

  async function loginWithGithub() {
    try {
      setError(null);
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Add user to adminUsers collection (all OAuth users are admins)
      await addAdminUser(result.user);
      
      return result;
    } catch (err) {
      const errorMessage = err.code === 'auth/popup-closed-by-user' 
        ? 'Sign in was cancelled' 
        : err.code === 'auth/popup-blocked'
        ? 'Sign in popup was blocked. Please allow popups for this site.'
        : err.message;
      setError(errorMessage);
      throw err;
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
          
          // Check if user is an admin
          const isAdmin = await checkAdminStatus(user.uid);
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
    loginWithGithub,
    logout,
    isAdmin: userRole === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}