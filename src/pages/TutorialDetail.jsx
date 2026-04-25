import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
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
  ArrowLeft
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
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    fetchTutorial();
    if (currentUser) {
      checkProgress();
      fetchComments();
    }
  }, [id, currentUser]);

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
      const progressRef = doc(db, 'progress', `${currentUser.uid}_${id}`);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        setCompleted(progressSnap.data().completed);
        setCurrentSection(progressSnap.data().currentSection || 0);
      }
    } catch (error) {
      console.error('Error checking progress:', error);
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
      
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const markAsCompleted = async () => {
    if (!currentUser) return;
    
    try {
      const progressRef = doc(db, 'progress', `${currentUser.uid}_${id}`);
      await updateDoc(progressRef, {
        completed: true,
        completedAt: new Date(),
        currentSection: tutorial.sections?.length - 1 || 0
      });
      setCompleted(true);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const updateProgress = async (sectionIndex) => {
    if (!currentUser) return;
    
    try {
      const progressRef = doc(db, 'progress', `${currentUser.uid}_${id}`);
      await updateDoc(progressRef, {
        currentSection: sectionIndex,
        lastAccessed: new Date()
      });
      setCurrentSection(sectionIndex);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const addComment = async () => {
    if (!currentUser || !newComment.trim()) return;
    
    try {
      await addDoc(collection(db, 'tutorials', id, 'comments'), {
        content: newComment,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        createdAt: new Date(),
        likes: 0
      });
      
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
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
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
            {tutorial.category}
          </span>
          {tutorial.isPremium && (
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded">
              Premium
            </span>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {tutorial.title}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {tutorial.description}
        </p>
        
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

      {/* Content Navigation */}
      {tutorial.sections && tutorial.sections.length > 1 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const newSection = Math.max(0, currentSection - 1);
                setCurrentSection(newSection);
                updateProgress(newSection);
              }}
              disabled={currentSection === 0}
              className="btn btn-secondary flex items-center disabled:opacity-50"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            
            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Section {currentSection + 1} of {tutorial.sections.length}
              </span>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {currentSectionData?.title}
              </h3>
            </div>
            
            <button
              onClick={() => {
                const newSection = Math.min(tutorial.sections.length - 1, currentSection + 1);
                setCurrentSection(newSection);
                updateProgress(newSection);
              }}
              disabled={currentSection === tutorial.sections.length - 1}
              className="btn btn-secondary flex items-center disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
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

      {/* Comments Section */}
      <div className="card">
        <div className="flex items-center mb-6">
          <MessageSquare size={20} className="mr-2 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Comments ({comments.length})
          </h3>
        </div>
        
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
        
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {comment.authorName}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {comment.createdAt?.toDate?.()?.toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
              <button className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                <ThumbsUp size={14} className="mr-1" />
                {comment.likes || 0}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TutorialDetail;