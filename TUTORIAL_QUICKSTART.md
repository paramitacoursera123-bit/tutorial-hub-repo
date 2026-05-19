# Tutorial System Quick Start Checklist

Quick reference for setting up and using the tutorial data system.

---

## 🚀 Initial Setup (5 minutes)

- [ ] **Install dependencies**
  ```bash
  npm install
  ```

- [ ] **Set up environment variables**
  ```bash
  cp .env.local.example .env.local
  # Add your Firebase credentials
  ```

- [ ] **Verify Firebase connection**
  - Open [Firebase Console](https://console.firebase.google.com/)
  - Select project: `ai-augmentdynamic-tutorial-app`
  - Check Firestore Database is initialized

- [ ] **Create an admin account**
  - Sign up with Google OAuth or email/password
  - Verify your UID in Firebase Console > Authentication

- [ ] **Promote to admin (if using email/password)**
  ```bash
  # Run the promote script or use Firebase Console
  # Edit user document in adminUsers collection
  ```

---

## 📚 Seed Sample Data (1 minute)

**Choose one option:**

**Option A: npm script**
```bash
npm run seed-tutorials
# or
npm run seed:tutorials
```

**Option B: Direct Node execution**
```bash
node seed-tutorials.js
```

**Expected Output:**
```
🌱 Starting to seed tutorials into Firestore...
✅ Added tutorial: "Getting Started with React" (ID: ...)
✅ Added tutorial: "JavaScript ES6+ Features" (ID: ...)
✅ Added tutorial: "CSS Grid Layout Complete Guide" (ID: ...)
✅ Added tutorial: "Firebase Firestore Database Guide" (ID: ...)
✅ Added tutorial: "React Hooks Deep Dive" (ID: ...)
✅ Added tutorial: "Tailwind CSS Essentials" (ID: ...)

✨ Seeding complete!
✅ Successfully added: 6 tutorials
📚 Your tutorials are now available in Firestore!
```

---

## ✅ Verify Data in Firestore

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Firestore Database**
3. Click **tutorials** collection
4. Verify 6+ documents appear
5. Click any document to view its structure

---

## 💻 Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and check:
- [ ] Tutorials page loads
- [ ] Tutorials display in grid
- [ ] Search/filter works
- [ ] Click tutorial opens detail page
- [ ] No console errors

---

## 🔧 Common Operations

### Load All Tutorials
```javascript
import { getAllTutorials } from '../utils/firebaseHelpers';

const tutorials = await getAllTutorials();
console.log(tutorials); // Array of tutorial objects
```

### Get Single Tutorial
```javascript
import { getTutorial } from '../utils/firebaseHelpers';

const tutorial = await getTutorial('tutorial-id');
console.log(tutorial);
```

### Create New Tutorial (Admin)
```javascript
import { createTutorial } from '../utils/firebaseHelpers';

const id = await createTutorial({
  title: "My Tutorial",
  description: "Description",
  content: "# Markdown content",
  category: "React",
  readTime: 15,
  authorName: "Your Name"
});
```

### Search Tutorials
```javascript
import { searchTutorials } from '../utils/firebaseHelpers';

const results = await searchTutorials('React');
```

### Get by Category
```javascript
import { getTutorialsByCategory } from '../utils/firebaseHelpers';

const reactTutorials = await getTutorialsByCategory('React');
```

---

## 🎯 Troubleshooting

### Problem: "Module not found"
**Solution:**
- Check file paths in imports
- Run: `npm install`
- Restart dev server

### Problem: "Tutorials not loading"
**Solution:**
- Check Firebase credentials in `.env.local`
- Verify Firestore database exists
- Run: `npm run seed-tutorials` again
- Check browser console for errors

### Problem: "Create tutorial fails"
**Solution:**
- Verify you're logged in as admin
- Check user is in `adminUsers` collection
- Check Firestore rules allow writes
- Look for errors in console

### Problem: "Port 5173 already in use"
**Solution:**
```bash
# Kill process on port
# macOS:
lsof -ti:5173 | xargs kill -9

# Then restart:
npm run dev
```

### Problem: "Firebase credentials missing"
**Solution:**
1. Create `.env.local` file
2. Copy values from Firebase Console:
   - Project Settings > General
   - Copy all `VITE_FIREBASE_*` values
3. Restart dev server

---

## 📊 Data Structure Quick Reference

### Tutorials Document
```json
{
  "id": "auto-generated",
  "title": "string (required)",
  "description": "string (required)",
  "content": "markdown string (required)",
  "category": "string (required)",
  "readTime": 15,
  "isPremium": false,
  "authorName": "string",
  "views": 0,
  "likes": 0,
  "tags": ["array", "of", "tags"],
  "thumbnail": "url (optional)",
  "videoUrl": "url (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 🔒 Security Rules Applied

```
✅ Tutorials: Everyone can READ, Admins can CREATE/UPDATE/DELETE
✅ Categories: Everyone can READ, Admins can WRITE
✅ Users: Own data READ/WRITE, Admins can manage
```

---

## 📝 Documentation Links

- **Full Tutorial Guide:** [TUTORIAL_DATA_GUIDE.md](./TUTORIAL_DATA_GUIDE.md)
- **Data Schema:** [TUTORIAL_SCHEMA.md](./TUTORIAL_SCHEMA.md)
- **Firebase Setup:** [QUICKSTART.md](./QUICKSTART.md)
- **Auth Guide:** [AUTH_SETUP.md](./AUTH_SETUP.md)
- **Helper Functions:** [src/utils/firebaseHelpers.js](./src/utils/firebaseHelpers.js)

---

## 🚀 Next Steps

### For Users
1. [ ] Visit tutorials page
2. [ ] Search for tutorials
3. [ ] Click to read tutorial detail
4. [ ] Save tutorials (if logged in)

### For Developers
1. [ ] Study [TUTORIAL_DATA_GUIDE.md](./TUTORIAL_DATA_GUIDE.md)
2. [ ] Review [src/utils/firebaseHelpers.js](./src/utils/firebaseHelpers.js)
3. [ ] Build tutorial creation feature
4. [ ] Implement tutorial editing
5. [ ] Add tutorial deletion with confirmation
6. [ ] Create admin dashboard features

### For Admins
1. [ ] Log in with admin account
2. [ ] Access admin dashboard
3. [ ] Create new tutorials
4. [ ] Edit existing tutorials
5. [ ] Delete tutorials
6. [ ] View analytics

---

## 📞 Support

If you encounter issues:

1. **Check logs:**
   - Browser console: `F12` → Console tab
   - Terminal: Check error messages

2. **Verify setup:**
   - Firebase credentials in `.env.local`
   - Firestore database initialized
   - Security rules applied

3. **Check documentation:**
   - [TUTORIAL_DATA_GUIDE.md](./TUTORIAL_DATA_GUIDE.md) - Usage examples
   - [TUTORIAL_SCHEMA.md](./TUTORIAL_SCHEMA.md) - Data structure
   - [Firestore Rules](./firestore.rules) - Security config

---

## 🎉 You're Ready!

The tutorial system is now configured and ready to use. Start exploring and building amazing tutorials!
