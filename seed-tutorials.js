import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBfEEgYOErOFobYuNN27OBdXA_O6C6NVBs",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "dynamic-tutorial-website.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "dynamic-tutorial-website",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "dynamic-tutorial-website.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "175702939690",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:175702939690:web:e5f1f52890982347334b53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sample tutorials data
const sampleTutorials = [
  {
    title: "Getting Started with React",
    description: "Learn the fundamentals of React development including components, props, state, and hooks.",
    content: `# Getting Started with React

React is a popular JavaScript library for building user interfaces. This tutorial will guide you through the basics.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components."

## Installation

\`\`\`bash
npm create vite@latest my-react-app --template react
cd my-react-app
npm install
npm run dev
\`\`\`

## Your First Component

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="World" />
    </div>
  );
}
\`\`\`

## Next Steps

- Learn about JSX
- Understand components and props
- Explore state and lifecycle`,
    category: "React",
    readTime: 15,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    thumbnail: "",
    videoUrl: "",
    sections: [],
    tags: ["javascript", "react", "frontend"]
  },
  {
    title: "JavaScript ES6+ Features",
    description: "Master modern JavaScript features including arrow functions, destructuring, promises, and async/await.",
    content: `# JavaScript ES6+ Features

ES6 (ECMAScript 2015) and later versions introduced many powerful features to JavaScript. Let's explore the most important ones.

## Arrow Functions

Arrow functions provide a concise syntax for writing function expressions.

\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Arrow function with body
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
\`\`\`

## Destructuring

Destructuring allows you to unpack values from arrays or properties from objects into distinct variables.

\`\`\`javascript
// Array destructuring
const [first, second] = [1, 2, 3];
console.log(first); // 1
console.log(second); // 2

// Object destructuring
const { name, age } = { name: 'John', age: 30 };
console.log(name); // 'John'
console.log(age); // 30
\`\`\`

## Promises

Promises represent the eventual completion (or failure) of an asynchronous operation and its resulting value.

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done!'), 1000);
});

promise.then(result => console.log(result));
\`\`\``,
    category: "JavaScript",
    readTime: 20,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    thumbnail: "",
    videoUrl: "",
    sections: [],
    tags: ["javascript", "es6", "programming"]
  },
  {
    title: "CSS Grid Layout Complete Guide",
    description: "Learn CSS Grid layout system for creating complex, responsive web layouts with ease.",
    content: `# CSS Grid Layout Complete Guide

CSS Grid provides a powerful way to create two-dimensional layouts on the web.

## What is CSS Grid?

CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay content out in rows and columns.

## Basic Grid Setup

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.item {
  background: lightblue;
  padding: 20px;
}
\`\`\`

## Grid Items

Grid items are the children of a grid container.

\`\`\`html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
\`\`\`

## Advanced Concepts

- Grid template areas
- Grid auto-placement
- Grid alignment
- Responsive grids`,
    category: "CSS",
    readTime: 25,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    thumbnail: "",
    videoUrl: "",
    sections: [],
    tags: ["css", "layout", "frontend"]
  },
  {
    title: "Firebase Firestore Database Guide",
    description: "Comprehensive guide to using Firebase Firestore for real-time database operations and data management.",
    content: `# Firebase Firestore Database Guide

Learn how to use Firebase Firestore for building scalable applications with real-time database capabilities.

## What is Firestore?

Firestore is a cloud-hosted, NoSQL database that allows you to store and sync data between users in real-time.

## Setting Up Firestore

\`\`\`javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
\`\`\`

## CRUD Operations

### Create

\`\`\`javascript
import { collection, addDoc } from 'firebase/firestore';

await addDoc(collection(db, 'users'), {
  name: 'John',
  email: 'john@example.com'
});
\`\`\`

### Read

\`\`\`javascript
import { doc, getDoc } from 'firebase/firestore';

const docSnap = await getDoc(doc(db, 'users', 'userId'));
if (docSnap.exists()) {
  console.log(docSnap.data());
}
\`\`\`

### Update

\`\`\`javascript
import { doc, updateDoc } from 'firebase/firestore';

await updateDoc(doc(db, 'users', 'userId'), {
  name: 'Jane'
});
\`\`\`

### Delete

\`\`\`javascript
import { doc, deleteDoc } from 'firebase/firestore';

await deleteDoc(doc(db, 'users', 'userId'));
\`\`\``,
    category: "Firebase",
    readTime: 30,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    thumbnail: "",
    videoUrl: "",
    sections: [],
    tags: ["firebase", "database", "backend"]
  },
  {
    title: "React Hooks Deep Dive",
    description: "Understand React Hooks including useState, useEffect, useContext, and custom hooks for functional components.",
    content: `# React Hooks Deep Dive

Hooks allow you to use state and other React features in functional components.

## useState Hook

The useState hook lets you add state to functional components.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in functional components.

\`\`\`jsx
import { useEffect } from 'react';

function Example() {
  useEffect(() => {
    // Runs after render
    console.log('Component mounted');

    return () => {
      // Cleanup
      console.log('Component unmounted');
    };
  }, []);

  return <div>Hello</div>;
}
\`\`\`

## useContext Hook

Access context values without wrapping in a Consumer.

\`\`\`jsx
import { useContext } from 'react';
import { MyContext } from './MyContext';

function MyComponent() {
  const value = useContext(MyContext);
  return <div>{value}</div>;
}
\`\`\``,
    category: "React",
    readTime: 22,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    thumbnail: "",
    videoUrl: "",
    sections: [],
    tags: ["react", "hooks", "javascript"]
  },
  {
    title: "Tailwind CSS Essentials",
    description: "Master Tailwind CSS utility-first framework for rapidly building custom designs without leaving your HTML.",
    content: `# Tailwind CSS Essentials

Tailwind is a utility-first CSS framework for rapidly building custom user interfaces.

## Installation

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Using Utilities

\`\`\`html
<div class="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg">
  <h1 class="text-2xl font-bold">Hello</h1>
  <button class="bg-white text-blue-500 px-4 py-2 rounded">Click</button>
</div>
\`\`\`

## Responsive Design

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-blue-500 p-4">Column</div>
</div>
\`\`\`

## Dark Mode

\`\`\`html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Dark mode support
</div>
\`\`\``,
    category: "CSS",
    readTime: 18,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    thumbnail: "",
    videoUrl: "",
    sections: [],
    tags: ["css", "tailwind", "frontend"]
  }
];

async function authenticateAsAdmin() {
  return new Promise((resolve, reject) => {
    // First try to sign in with existing admin account
    const adminEmail = 'admin@tutorial.com';
    const adminPassword = 'Admin@123456';

    // Check if already authenticated
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      unsubscribe();
      
      if (currentUser) {
        console.log('✅ Already authenticated as:', currentUser.email);
        
        // Check if user is admin
        try {
          const adminRef = doc(db, 'adminUsers', currentUser.uid);
          resolve(currentUser);
        } catch (error) {
          console.error('Error checking admin status:', error);
          reject(error);
        }
      } else {
        // Try to sign in
        try {
          console.log('🔐 Attempting to sign in as admin...');
          const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
          const user = userCredential.user;
          console.log('✅ Signed in as:', user.email);
          
          // Ensure user is in adminUsers collection
          const adminRef = doc(db, 'adminUsers', user.uid);
          await setDoc(adminRef, {
            uid: user.uid,
            email: user.email,
            displayName: 'Admin User',
            role: 'admin',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });
          
          console.log('✅ Admin user verified in Firestore');
          resolve(user);
        } catch (signInError) {
          if (signInError.code === 'auth/user-not-found') {
            console.log('📝 Admin account not found, creating one...');
            
            // Create new admin account
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
              const user = userCredential.user;
              console.log('✅ Created admin account:', user.email);
              
              // Add to adminUsers collection
              const adminRef = doc(db, 'adminUsers', user.uid);
              await setDoc(adminRef, {
                uid: user.uid,
                email: user.email,
                displayName: 'Admin User',
                role: 'admin',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
              
              console.log('✅ Admin user added to Firestore');
              resolve(user);
            } catch (createError) {
              console.error('❌ Error creating admin account:', createError.message);
              reject(createError);
            }
          } else {
            console.error('❌ Sign in error:', signInError.message);
            reject(signInError);
          }
        }
      }
    });
  });
}

async function seedTutorials() {
  try {
    console.log('🌱 Starting to seed tutorials into Firestore...\n');
    
    // Step 1: Authenticate as admin
    console.log('Step 1: Authenticating admin user...');
    const adminUser = await authenticateAsAdmin();
    console.log('✅ Authentication successful\n');

    // Step 2: Add tutorials
    console.log('Step 2: Adding tutorials to Firestore...\n');
    const tutorialsRef = collection(db, 'tutorials');
    let successCount = 0;
    let errorCount = 0;

    for (const tutorial of sampleTutorials) {
      try {
        const docRef = await addDoc(tutorialsRef, {
          ...tutorial,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          views: 0,
          likes: 0
        });
        console.log(`✅ Added tutorial: "${tutorial.title}" (ID: ${docRef.id})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error adding tutorial "${tutorial.title}":`, error.message);
        errorCount++;
      }
    }

    console.log(`\n✨ Seeding complete!`);
    console.log(`✅ Successfully added: ${successCount} tutorials`);
    if (errorCount > 0) {
      console.log(`❌ Failed to add: ${errorCount} tutorials`);
    }
    console.log('\n📚 Your tutorials are now available in Firestore!');

  } catch (error) {
    console.error('Fatal error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

seedTutorials();
