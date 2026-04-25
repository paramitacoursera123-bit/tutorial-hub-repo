import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMbVTP4kooozKDP6MDkeasruMfMO48k_Y",
  authDomain: "ai-augmentdynamic-tutorial-app.firebaseapp.com",
  projectId: "ai-augmentdynamic-tutorial-app",
  storageBucket: "ai-augmentdynamic-tutorial-app.firebasestorage.app",
  messagingSenderId: "842805457729",
  appId: "1:842805457729:web:dfafeffb67b8832f2ba7c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    // Create admin user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@tutorialplatform.com',
      'admin123'
    );

    // Create admin profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: 'admin@tutorialplatform.com',
      displayName: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@tutorialplatform.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();