# Tutorial Platform

A fully dynamic, production-ready technical tutorial platform built with React, Vite, Tailwind CSS, and Firebase. Features secure authentication, admin dashboard, progress tracking, and comprehensive content management.

## 🚀 Features

- **Authentication**: Secure login/signup with Firebase Auth (email/password + Google OAuth)
- **Role-based Access**: Admin and user roles with protected routes
- **Admin Dashboard**: Create, edit, and manage tutorials with rich content support
- **Content Types**: Markdown text, syntax-highlighted code, images, and embedded videos
- **Progress Tracking**: Mark tutorials as completed and resume reading
- **Comments & Feedback**: Interactive discussion system
- **Search & Filtering**: Find tutorials by title, description, or category
- **Responsive Design**: Mobile-first design with dark/light mode
- **Ad Integration**: Google AdSense and Bing Ads support
- **Security**: Protected API routes, input validation, and secure file uploads

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Markdown**: React Markdown with syntax highlighting
- **State Management**: React Context API

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- A Firebase account
- A code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### 2. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (or select existing)
3. Enter your project name
4. Enable Google Analytics (optional)
5. Choose your Google Analytics account
6. Click "Create project"

#### Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** and **Google** providers:
   - For Email/Password: Just click enable
   - For Google: Click enable, enter your project name, and copy the client ID (you'll need this later)

#### Set up Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (you can change this later for production)
4. Select a location for your database
5. Click **Done**

#### Set up Storage (for file uploads)

1. Go to **Storage** in the left sidebar
2. Click **Get started**
3. Choose **Start in test mode**
4. Click **Done**

#### Get Your Firebase Config

1. Go to **Project settings** (gear icon in the left sidebar)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Enter an app nickname
5. **Important**: Check "Also set up Firebase Hosting" (you can set this up later)
6. Click **Register app**
7. Copy the config object - you'll need these values for your `.env` file

### 3. Configure Environment Variables

Edit your `.env` file with the values from Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Set up Firebase Security Rules

#### Firestore Rules

Go to **Firestore Database > Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Tutorials are readable by everyone, writable by admins
    match /tutorials/{tutorialId} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Comments can be read by everyone, created by authenticated users
    match /tutorials/{tutorialId}/comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.authorId == request.auth.uid;
    }

    // Progress tracking - users can only modify their own progress
    match /progress/{progressId} {
      allow read, write: if request.auth != null &&
        progressId == request.auth.uid + '_' + resource.data.tutorialId;
    }
  }
}
```

#### Storage Rules

Go to **Storage > Rules** and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Thumbnails can be uploaded by admins, downloaded by everyone
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        firestore.exists(/databases/(default)/documents/users/$(request.auth.uid)) &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5. Create Admin User

After setting up authentication, you'll need to manually create an admin user. You can do this by:

1. Registering a normal user account
2. Going to Firebase Console > Firestore Database
3. Finding your user document in the `users` collection
4. Changing the `role` field from `"user"` to `"admin"`

### 6. Add Sample Data

You can add sample tutorials through the admin dashboard, or manually add them to Firestore:

```javascript
// Example tutorial document
{
  title: "Getting Started with React",
  description: "Learn the basics of React development",
  content: "# Welcome to React\n\nReact is a JavaScript library for building user interfaces...",
  category: "React",
  readTime: 15,
  isPremium: false,
  authorName: "Admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  thumbnail: "https://example.com/thumbnail.jpg", // optional
  videoUrl: "https://www.youtube.com/embed/VIDEO_ID", // optional
  sections: [] // optional - for multi-section tutorials
}
```

## 📱 Usage

### For Users

1. **Browse Tutorials**: Visit the homepage to see featured tutorials
2. **Search & Filter**: Use the search bar and category filters
3. **Read Tutorials**: Click on any tutorial to read the content
4. **Track Progress**: Mark tutorials as completed
5. **Leave Comments**: Share your thoughts and feedback

### For Admins

1. **Access Dashboard**: Log in with an admin account and visit `/admin`
2. **Create Tutorials**: Use the rich editor to create tutorials with:
   - Markdown content
   - Code snippets with syntax highlighting
   - Images and videos
   - Multiple sections
3. **Manage Content**: Edit or delete existing tutorials
4. **Premium Content**: Mark tutorials as premium for future monetization

## 🎨 Customization

### Themes

The app supports light and dark modes. Users can toggle between themes using the button in the navbar.

### Styling

- **Tailwind CSS**: All styling uses Tailwind classes
- **Custom Components**: Reusable button and card components in `src/index.css`
- **Responsive Design**: Mobile-first approach with responsive breakpoints

### Adding New Features

1. **New Pages**: Add routes in `src/App.jsx` and create components in `src/pages/`
2. **New Components**: Add to `src/components/` and import where needed
3. **Firebase Functions**: Add new collections/rules as needed

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize hosting:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

### Other Deployment Options

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag & drop the `dist` folder or connect via Git
- **AWS S3 + CloudFront**: For scalable static hosting

## 🔒 Security Best Practices

- **Environment Variables**: Never commit `.env` files to version control
- **Firebase Rules**: Regularly review and update security rules
- **Input Validation**: All user inputs are validated on both client and server
- **Authentication**: All sensitive operations require authentication
- **File Uploads**: Images are validated and stored securely in Firebase Storage

## 📊 Performance

- **Code Splitting**: Vite automatically splits code for optimal loading
- **Image Optimization**: Use WebP format for thumbnails
- **Lazy Loading**: Components are loaded as needed
- **Caching**: Firebase handles caching automatically

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Check your `.env` variables are correct
   - Ensure Firebase project is properly configured
   - Check browser console for error messages

2. **Authentication Problems**
   - Verify Firebase Auth is enabled
   - Check security rules allow the operations
   - Ensure user roles are set correctly

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Getting Help

- Check Firebase documentation
- Review browser developer tools
- Check the console for error messages
- Ensure all environment variables are set

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, please create an issue in the GitHub repository or contact the maintainers.

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Getting Started](./docs/setup/QUICKSTART.md)** - 5-minute setup guide
- **[Features Overview](./docs/features/FEATURES.md)** - All implemented features
- **[Architecture](./docs/architecture/ARCHITECTURE.md)** - System design and tech stack
- **[Database Schema](./docs/database/SCHEMA.md)** - Firestore collections
- **[API Reference](./docs/api/API_REFERENCE.md)** - Firebase and helper APIs
- **[Components Guide](./docs/components/COMPONENTS.md)** - React components
- **[Development Workflow](./docs/guides/DEVELOPMENT_WORKFLOW.md)** - Dev best practices
- **[Security Guide](./docs/guides/SECURITY.md)** - Security practices
- **[Troubleshooting](./docs/guides/TROUBLESHOOTING.md)** - Common issues and solutions

---

## 🔗 Quick Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

---

**Last Updated:** April 24, 2026
#   d y n a m i c - t u t o r i a l - w e b s i t e 
 
 