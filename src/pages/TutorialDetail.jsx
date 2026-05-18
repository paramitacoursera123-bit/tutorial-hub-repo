import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Clock, 
  User, 
  CheckCircle, 
  Copy, 
  MessageSquare, 
  ThumbsUp, 
  Play, 
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Reply,
  Trash2,
  Send
} from 'lucide-react';

// Sample tutorials data (fallback when Firestore is not available)
const sampleTutorials = [
  {
    id: '1',
    title: "Getting Started with React",
    description: "Learn the fundamentals of React development including components, props, state, and hooks.",
    content: `# Getting Started with React\n\nReact is a popular JavaScript library for building user interfaces. This tutorial will guide you through the basics.`,
    category: "React",
    readTime: 15,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    createdAt: new Date(),
    thumbnail: "",
    videoUrl: "",
    sections: []
  },
  {
    id: '2',
    title: "JavaScript ES6+ Features",
    description: "Master modern JavaScript features including arrow functions, destructuring, promises, and async/await.",
    content: `# JavaScript ES6+ Features\n\nES6 introduced many powerful features to JavaScript.`,
    category: "JavaScript",
    readTime: 20,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    createdAt: new Date(),
    thumbnail: "",
    videoUrl: "",
    sections: []
  },
  {
    id: '3',
    title: "CSS Grid Layout Complete Guide",
    description: "Learn CSS Grid layout system for creating complex, responsive web layouts with ease.",
    content: `# CSS Grid Layout\n\nCSS Grid provides a powerful way to create layouts.`,
    category: "CSS",
    readTime: 25,
    isPremium: false,
    authorName: "Tutorial Platform Team",
    createdAt: new Date(),
    thumbnail: "",
    videoUrl: "",
    sections: []
  }
];

function TutorialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { darkMode } = useTheme();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loadingReply, setLoadingReply] = useState(null);
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');
  const [showFreeSignupPrompt, setShowFreeSignupPrompt] = useState(false);

  useEffect(() => {
    fetchTutorial();
  }, [id]);

  useEffect(() => {
    if (!tutorial) return;

    checkProgress();
    if (currentUser) {
      fetchComments();
    }
  }, [tutorial, currentUser]);

  // Auto-clear success message
  useEffect(() => {
    if (commentSuccess) {
      const timer = setTimeout(() => setCommentSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [commentSuccess]);

  // Auto-clear error message
  useEffect(() => {
    if (commentError) {
      const timer = setTimeout(() => setCommentError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [commentError]);

  const isPremiumLocked = tutorial?.isPremium && !currentUser;
  const freeSectionLimitIndex = tutorial?.sections
    ? Math.max(0, Math.ceil(tutorial.sections.length * 0.35) - 1)
    : 0;
  const canAccessFreeSection = (sectionIndex) => {
    if (currentUser) return true;
    if (tutorial?.isPremium) return false;
    return sectionIndex <= freeSectionLimitIndex;
  };

  const fetchTutorial = async () => {
    try {
      // Check if it's a sample tutorial first
      const sampleTutorial = sampleTutorials.find(t => t.id === id);
      if (sampleTutorial) {
        setTutorial(sampleTutorial);
        setLoading(false);
        return;
      }

      // Check for admin-created tutorials in localStorage
      const adminTutorials = localStorage.getItem('adminTutorials');
      if (adminTutorials) {
        const parsedAdminTutorials = JSON.parse(adminTutorials);
        const adminTutorial = parsedAdminTutorials.find(t => t.id === id);
        if (adminTutorial) {
          setTutorial(adminTutorial);
          setLoading(false);
          return;
        }
      }

      // Fetch from Firestore
      const docRef = doc(db, 'tutorials', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTutorial({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate('/tutorials');
      }
    } catch (error) {
      console.error('Error fetching tutorial:', error);
      navigate('/tutorials');
    } finally {
      setLoading(false);
    }
  };

  const checkProgress = async () => {
    try {
      if (currentUser) {
        // Try Firestore first
        const progressRef = doc(db, 'progress', `${currentUser.uid}_${id}`);
        const progressSnap = await getDoc(progressRef);
        
        if (progressSnap.exists()) {
          const data = progressSnap.data();
          setCompleted(data.completed || false);
          setCurrentSection(data.currentSection || 0);
          setCompletedSections(data.completedSections || []);
          
          // Sync to localStorage
          saveProgressToStorage(data);
          console.log('✅ Progress loaded from Firestore');
          
          // Calculate percentage
          const totalSections = tutorial?.sections?.length || 1;
          const percentage = calculateProgressPercentage((data.completedSections || []).length, totalSections);
          setProgressPercentage(percentage);
          return;
        }
      }
    } catch (error) {
      console.warn('⚠️ Firestore unavailable, using localStorage:', error.message);
    }

    // Fallback to localStorage or guest progress
    const storageProgress = getProgressFromStorage();
    if (storageProgress) {
      setCompleted(storageProgress.completed || false);
      setCurrentSection(storageProgress.currentSection || 0);
      setCompletedSections(storageProgress.completedSections || []);
      
      const totalSections = tutorial?.sections?.length || 1;
      const percentage = calculateProgressPercentage((storageProgress.completedSections || []).length, totalSections);
      setProgressPercentage(percentage);
      console.log('✅ Progress loaded from localStorage');
    }
  };

  const fetchComments = async () => {
    try {
      const commentsRef = collection(db, 'tutorials', id, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      
      // If we got Firestore results, sync to localStorage
      if (commentsData.length > 0) {
        saveCommentsToStorage(commentsData);
      }
      
      setComments(commentsData);
      console.log('✅ Comments fetched from Firestore:', commentsData.length);
    } catch (error) {
      console.warn('⚠️ Firestore unavailable, using localStorage:', error.message);
      
      // Fallback to localStorage
      const storageComments = getCommentsFromStorage();
      setComments(storageComments);
      console.log('✅ Comments loaded from localStorage:', storageComments.length);
    }
  };

  const markSectionAsCompleted = async (sectionIndex) => {
    if (tutorial?.isPremium && !currentUser) return;
    
    try {
      // Update state immediately
      const newCompletedSections = [...completedSections];
      if (!newCompletedSections.includes(sectionIndex)) {
        newCompletedSections.push(sectionIndex);
      }
      setCompletedSections(newCompletedSections);

      const totalSections = tutorial?.sections?.length || 1;
      const percentage = calculateProgressPercentage(newCompletedSections.length, totalSections);
      setProgressPercentage(percentage);

      const progressData = {
        tutorialId: id,
        userId: currentUser?.uid || 'guest',
        currentSection: currentSection,
        completedSections: newCompletedSections,
        completed: percentage === 100,
        completedAt: percentage === 100 ? new Date().toISOString() : null,
        lastAccessed: new Date().toISOString()
      };

      // Try Firestore first
      if (currentUser) {
        try {
          const progressRef = doc(db, 'progress', `${currentUser.uid}_${id}`);
          await updateDoc(progressRef, progressData);
          console.log('✅ Section completion saved to Firestore');
        } catch (firestoreError) {
          console.warn('⚠️ Firestore unavailable, using localStorage:', firestoreError.message);
        }
      }

      // Always save to localStorage
      saveProgressToStorage(progressData);
      console.log('✅ Section completion saved to localStorage');
    } catch (error) {
      console.error('Error marking section as completed:', error);
    }
  };

  const markAsCompleted = async () => {
    if (!currentUser) return;
    
    try {
      const totalSections = tutorial?.sections?.length || 1;
      const allSections = Array.from({ length: totalSections }, (_, i) => i);
      
      const progressData = {
        tutorialId: id,
        userId: currentUser.uid,
        currentSection: totalSections - 1,
        completedSections: allSections,
        completed: true,
        completedAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };

      // Try Firestore first
      try {
        const progressRef = doc(db, 'progress', `${currentUser.uid}_${id}`);
        await updateDoc(progressRef, progressData);
        console.log('✅ Tutorial marked as completed in Firestore');
      } catch (firestoreError) {
        console.warn('⚠️ Firestore unavailable, using localStorage:', firestoreError.message);
      }

      // Always save to localStorage
      saveProgressToStorage(progressData);
      
      setCompleted(true);
      setCompletedSections(allSections);
      setProgressPercentage(100);
      console.log('✅ Tutorial marked as completed in localStorage');
    } catch (error) {
      console.error('Error marking tutorial as completed:', error);
    }
  };

  const updateProgress = async (sectionIndex) => {
    if (tutorial?.isPremium && !currentUser) {
      return;
    }
    
    if (!canAccessFreeSection(sectionIndex)) {
      setShowFreeSignupPrompt(true);
      return;
    }

    try {
      setCurrentSection(sectionIndex);
      
      const progressData = {
        tutorialId: id,
        userId: currentUser?.uid || 'guest',
        currentSection: sectionIndex,
        completedSections: completedSections,
        completed: false,
        lastAccessed: new Date().toISOString()
      };

      // Try Firestore first
      if (currentUser) {
        try {
          const progressRef = doc(db, 'progress', `${currentUser.uid}_${id}`);
          await updateDoc(progressRef, progressData);
        } catch (firestoreError) {
          console.warn('⚠️ Firestore unavailable for section update, using localStorage');
        }
      }

      // Always save to localStorage
      saveProgressToStorage(progressData);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleSectionChange = (sectionIndex) => {
    if (tutorial?.isPremium && !currentUser) {
      return;
    }

    if (!canAccessFreeSection(sectionIndex)) {
      setShowFreeSignupPrompt(true);
      return;
    }

    updateProgress(sectionIndex);
  };

  const addComment = async () => {
    if (!currentUser || !newComment.trim()) {
      setCommentError('Please write a comment');
      return;
    }
    
    try {
      setCommentError('');
      const newCommentData = {
        id: Date.now().toString(),
        content: newComment,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        authorPhoto: currentUser.photoURL,
        createdAt: new Date(),
        likes: 0,
        replies: []
      };

      // Try Firestore first
      let savedToFirestore = false;
      try {
        await addDoc(collection(db, 'tutorials', id, 'comments'), newCommentData);
        savedToFirestore = true;
        console.log('✅ Comment saved to Firestore');
      } catch (firestoreError) {
        console.warn('⚠️ Firestore unavailable, saving to localStorage:', firestoreError.message);
      }

      // Always save to localStorage fallback
      const existingComments = getCommentsFromStorage();
      const updatedComments = [newCommentData, ...existingComments];
      saveCommentsToStorage(updatedComments);
      console.log('✅ Comment saved to localStorage');

      setNewComment('');
      setCommentSuccess('Comment posted successfully!');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError('Failed to post comment. Please try again.');
    }
  };

  const addReply = async (commentId) => {
    if (!currentUser || !replyText.trim()) {
      setCommentError('Please write a reply');
      return;
    }

    try {
      setLoadingReply(commentId);
      setCommentError('');

      const newReply = {
        id: Date.now().toString(),
        content: replyText,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        authorPhoto: currentUser.photoURL,
        isAdmin: isAdmin,
        createdAt: new Date().toISOString()
      };

      // Try Firestore first
      try {
        const commentRef = doc(db, 'tutorials', id, 'comments', commentId);
        const commentSnap = await getDoc(commentRef);
        
        if (commentSnap.exists()) {
          const existingReplies = commentSnap.data().replies || [];
          await updateDoc(commentRef, {
            replies: [...existingReplies, newReply]
          });
          console.log('✅ Reply saved to Firestore');
        }
      } catch (firestoreError) {
        console.warn('⚠️ Firestore unavailable for reply, using localStorage:', firestoreError.message);
      }

      // Update localStorage
      const storageComments = getCommentsFromStorage();
      const commentIndex = storageComments.findIndex(c => c.id === commentId);
      
      if (commentIndex !== -1) {
        storageComments[commentIndex].replies = storageComments[commentIndex].replies || [];
        storageComments[commentIndex].replies.push(newReply);
        saveCommentsToStorage(storageComments);
        console.log('✅ Reply saved to localStorage');
      }

      setReplyText('');
      setReplyingTo(null);
      setCommentSuccess('Reply posted successfully!');
      fetchComments();
    } catch (error) {
      console.error('Error adding reply:', error);
      setCommentError('Failed to post reply. Please try again.');
    } finally {
      setLoadingReply(null);
    }
  };

  const deleteReply = async (commentId, replyId) => {
    if (!currentUser) return;
    
    try {
      // Try Firestore first
      try {
        const commentRef = doc(db, 'tutorials', id, 'comments', commentId);
        const commentSnap = await getDoc(commentRef);
        
        if (commentSnap.exists()) {
          const replies = commentSnap.data().replies || [];
          const reply = replies.find(r => r.id === replyId);
          
          // Only allow deletion by the reply author or admin
          if (reply && (reply.authorId === currentUser.uid || isAdmin)) {
            const updatedReplies = replies.filter(r => r.id !== replyId);
            await updateDoc(commentRef, {
              replies: updatedReplies
            });
            console.log('✅ Reply deleted from Firestore');
          }
        }
      } catch (firestoreError) {
        console.warn('⚠️ Firestore unavailable for delete, using localStorage:', firestoreError.message);
      }

      // Update localStorage
      const storageComments = getCommentsFromStorage();
      const commentIndex = storageComments.findIndex(c => c.id === commentId);
      
      if (commentIndex !== -1) {
        const replies = storageComments[commentIndex].replies || [];
        const reply = replies.find(r => r.id === replyId);
        
        if (reply && (reply.authorId === currentUser.uid || isAdmin)) {
          storageComments[commentIndex].replies = replies.filter(r => r.id !== replyId);
          saveCommentsToStorage(storageComments);
          console.log('✅ Reply deleted from localStorage');
        }
      }

      fetchComments();
    } catch (error) {
      console.error('Error deleting reply:', error);
      setCommentError('Failed to delete reply');
    }
  };

  const deleteComment = async (commentId) => {
    if (!currentUser) return;
    
    try {
      // Try Firestore first
      try {
        const commentRef = doc(db, 'tutorials', id, 'comments', commentId);
        const commentSnap = await getDoc(commentRef);
        
        if (commentSnap.exists()) {
          const comment = commentSnap.data();
          // Only allow deletion by the comment author or admin
          if (comment.authorId === currentUser.uid || isAdmin) {
            await deleteDoc(commentRef);
            console.log('✅ Comment deleted from Firestore');
          }
        }
      } catch (firestoreError) {
        console.warn('⚠️ Firestore unavailable for delete, using localStorage:', firestoreError.message);
      }

      // Update localStorage
      const storageComments = getCommentsFromStorage();
      const comment = storageComments.find(c => c.id === commentId);
      
      if (comment && (comment.authorId === currentUser.uid || isAdmin)) {
        const updatedComments = storageComments.filter(c => c.id !== commentId);
        saveCommentsToStorage(updatedComments);
        console.log('✅ Comment deleted from localStorage');
      }

      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setCommentError('Failed to delete comment');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Helper functions for comment storage with localStorage fallback
  const getCommentsFromStorage = () => {
    try {
      const stored = localStorage.getItem(`comments_${id}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading comments from localStorage:', error);
      return [];
    }
  };

  const saveCommentsToStorage = (commentsList) => {
    try {
      localStorage.setItem(`comments_${id}`, JSON.stringify(commentsList));
    } catch (error) {
      console.error('Error saving comments to localStorage:', error);
    }
  };

  // Helper functions for progress storage with localStorage fallback
  const getProgressStorageKey = () => {
    if (currentUser) {
      return `progress_${currentUser.uid}_${id}`;
    }
    return `progress_guest_${id}`;
  };

  const getProgressFromStorage = () => {
    try {
      const stored = localStorage.getItem(getProgressStorageKey());
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading progress from localStorage:', error);
      return null;
    }
  };

  const saveProgressToStorage = (progressData) => {
    try {
      localStorage.setItem(getProgressStorageKey(), JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  };

  // Calculate progress percentage
  const calculateProgressPercentage = (completedCount, totalSections) => {
    if (totalSections === 0) return 0;
    return Math.round((completedCount / totalSections) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!tutorial) {
    return <div>Tutorial not found</div>;
  }

  const currentSectionData = tutorial.sections?.[currentSection];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/tutorials')}
        className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Tutorials
      </button>

      {/* Header */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
            {tutorial.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${tutorial.isPremium ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}>
            {tutorial.isPremium ? 'Premium' : 'FREE'}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {tutorial.title}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {tutorial.description}
        </p>

        {!currentUser && !tutorial.isPremium && (
          <div className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-sm text-blue-700 dark:text-blue-200">
            Login to track your progress and resume this free tutorial later.
          </div>
        )}
        
        {/* Progress Bar */}
        {currentUser && !isPremiumLocked && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {completedSections.length} of {tutorial.sections?.length || 1} sections completed
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              {tutorial.authorName}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {tutorial.readTime} min read
            </div>
          </div>
          
          {currentUser && (
            <button
              onClick={markAsCompleted}
              disabled={completed}
              className={`btn ${completed ? 'btn-secondary' : 'btn-primary'} flex items-center`}
            >
              <CheckCircle size={16} className="mr-2" />
              {completed ? 'Completed' : 'Mark as Completed'}
            </button>
          )}
        </div>
      </div>

      {/* Premium login prompt */}
      {isPremiumLocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10">
          <div className="max-w-lg w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 text-center">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-semibold">
                <MessageSquare size={16} /> Premium access required
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Login to buy and access this tutorial
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This premium tutorial requires a logged-in account. Sign in to unlock the course and continue learning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary px-6 py-3 w-full sm:w-auto"
              >
                Login / Buy Course
              </button>
              <button
                onClick={() => navigate('/tutorials')}
                className="btn btn-secondary px-6 py-3 w-full sm:w-auto"
              >
                Back to Tutorials
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="card sticky top-24">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tutorial Sections
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Navigate through the tutorial and track your completed sections.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            {!currentUser && !tutorial.isPremium && (
              <div className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-sm text-blue-700 dark:text-blue-200">
                Free users can preview up to {freeSectionLimitIndex + 1} sections before login is required.
              </div>
            )}

            <div className="space-y-2">
              {tutorial.sections?.map((section, index) => {
                const locked = !canAccessFreeSection(index);
                return (
                  <button
                    key={index}
                    onClick={() => handleSectionChange(index)}
                    disabled={locked || (tutorial.isPremium && !currentUser)}
                    className={`w-full text-left p-3 rounded-lg transition-all border ${
                      index === currentSection
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:border-primary-300'
                    } ${locked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold truncate">{section.title || `Section ${index + 1}`}</span>
                      {completedSections.includes(index) && (
                        <span className="text-xs text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {locked ? 'Login to continue' : `Section ${index + 1}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between gap-3 mb-4">
              <button
                onClick={() => handleSectionChange(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Section {currentSection + 1} of {tutorial.sections?.length || 0}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {currentSectionData?.title}
                </h3>
              </div>
              <button
                onClick={() => handleSectionChange(Math.min((tutorial.sections?.length || 1) - 1, currentSection + 1))}
                disabled={currentSection === (tutorial.sections?.length || 1) - 1}
                className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            {currentUser && (
              <div className="flex justify-center">
                <button
                  onClick={() => markSectionAsCompleted(currentSection)}
                  disabled={completedSections.includes(currentSection)}
                  className={`btn text-sm ${completedSections.includes(currentSection) ? 'btn-secondary opacity-50' : 'btn-success'} flex items-center gap-2`}
                >
                  <CheckCircle size={16} />
                  {completedSections.includes(currentSection) ? 'Section Completed' : 'Mark Section as Complete'}
                </button>
              </div>
            )}
          </div>

          <div className="card">
            {currentSectionData ? (
              <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="relative">
                          <button
                            onClick={() => copyToClipboard(String(children))}
                            className="absolute top-2 right-2 p-1 rounded bg-gray-700 text-white hover:bg-gray-600"
                          >
                            <Copy size={14} />
                          </button>
                          <SyntaxHighlighter
                            style={darkMode ? oneDark : oneLight}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={`${className} bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-1 py-0.5 rounded text-sm`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    img({ src, alt }) {
                      return (
                        <img 
                          src={src} 
                          alt={alt} 
                          className="max-w-full h-auto rounded-lg shadow-md" 
                        />
                      );
                    }
                  }}
                >
                  {currentSectionData.content}
                </ReactMarkdown>

                {currentSectionData.videoUrl && (
                  <div className="mt-6">
                    <div className="flex items-center mb-2">
                      <Play size={16} className="mr-2 text-primary-600" />
                      <span className="font-medium">Video Content</span>
                    </div>
                    <div className="aspect-video">
                      <iframe
                        src={currentSectionData.videoUrl}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="relative">
                          <button
                            onClick={() => copyToClipboard(String(children))}
                            className="absolute top-2 right-2 p-1 rounded bg-gray-700 text-white hover:bg-gray-600"
                          >
                            <Copy size={14} />
                          </button>
                          <SyntaxHighlighter
                            style={darkMode ? oneDark : oneLight}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={`${className} bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-1 py-0.5 rounded text-sm`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    img({ src, alt }) {
                      return (
                        <img 
                          src={src} 
                          alt={alt} 
                          className="max-w-full h-auto rounded-lg shadow-md" 
                        />
                      );
                    }
                  }}
                >
                  {tutorial.content}
                </ReactMarkdown>

                {tutorial.videoUrl && (
                  <div className="mt-6">
                    <div className="flex items-center mb-2">
                      <Play size={16} className="mr-2 text-primary-600" />
                      <span className="font-medium">Video Content</span>
                    </div>
                    <div className="aspect-video">
                      <iframe
                        src={tutorial.videoUrl}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {showFreeSignupPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="max-w-xl w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 text-center">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold">
                <MessageSquare size={16} /> Continue learning
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              You’ve reached the free preview limit
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign in or create an account to keep reading the rest of this tutorial and save your progress.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setShowFreeSignupPrompt(false);
                  navigate('/login');
                }}
                className="btn btn-primary px-6 py-3 w-full sm:w-auto"
              >
                Login / Sign Up
              </button>
              <button
                onClick={() => setShowFreeSignupPrompt(false)}
                className="btn btn-secondary px-6 py-3 w-full sm:w-auto"
              >
                Continue Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="card">
        <div className="flex items-center mb-6">
          <MessageSquare size={20} className="mr-2 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Comments ({comments.length})
          </h3>
        </div>

        {/* Error Message */}
        {commentError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
            {commentError}
          </div>
        )}

        {/* Success Message */}
        {commentSuccess && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
            {commentSuccess}
          </div>
        )}
        
        {currentUser ? (
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={3}
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="btn btn-primary mt-2 disabled:opacity-50"
            >
              Post Comment
            </button>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              Sign in
            </Link> to join the discussion.
          </p>
        )}
        
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {/* Main Comment */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {comment.authorPhoto && (
                      <img 
                        src={comment.authorPhoto} 
                        alt={comment.authorName}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.authorName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.createdAt?.toDate?.()?.toLocaleDateString() || new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {currentUser && (comment.authorId === currentUser.uid || isAdmin) && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete comment"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <ThumbsUp size={14} className="mr-1" />
                    {comment.likes || 0}
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <Reply size={14} className="mr-1" />
                    Reply
                  </button>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 space-y-3 mb-4 border-l-2 border-gray-300 dark:border-gray-600 pl-4">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {reply.authorPhoto && (
                            <img 
                              src={reply.authorPhoto} 
                              alt={reply.authorName}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="font-medium text-sm text-gray-900 dark:text-white">
                            {reply.authorName}
                          </span>
                          {reply.isAdmin && (
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                          {currentUser && (reply.authorId === currentUser.uid || isAdmin) && (
                            <button
                              onClick={() => deleteReply(comment.id, reply.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete reply"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {replyingTo === comment.id && currentUser && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => addReply(comment.id)}
                      disabled={!replyText.trim() || loadingReply === comment.id}
                      className="btn btn-primary btn-sm flex items-center gap-1 disabled:opacity-50"
                    >
                      <Send size={14} />
                      {loadingReply === comment.id ? 'Sending...' : 'Send'}
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TutorialDetail;