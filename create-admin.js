import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
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