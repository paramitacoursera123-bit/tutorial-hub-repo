import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfEEgYOErOFobYuNN27OBdXA_O6C6NVBs",
  authDomain: "dynamic-tutorial-website.firebaseapp.com",
  projectId: "dynamic-tutorial-website",
  storageBucket: "dynamic-tutorial-website.firebasestorage.app",
  messagingSenderId: "175702939690",
  appId: "1:175702939690:web:e5f1f52890982347334b53"
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