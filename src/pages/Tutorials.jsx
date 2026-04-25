import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, User } from 'lucide-react';

// Sample tutorials data (fallback when Firestore is not available)
const sampleTutorials = [
  {
    id: '1',
    title: "Getting Started with React",
    description: "Learn the fundamentals of React development including components, props, state, and hooks.",
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

function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    // Use sample data immediately for fast loading
    setTutorials(sampleTutorials);
    const categorySet = new Set(sampleTutorials.map(t => t.category));
    setCategories(['all', ...Array.from(categorySet)]);
    setLoading(false);

    // Try to load admin-created tutorials from localStorage
    const adminTutorials = localStorage.getItem('adminTutorials');
    if (adminTutorials) {
      const parsedAdminTutorials = JSON.parse(adminTutorials);
      setTutorials(parsedAdminTutorials);
      const adminCategorySet = new Set(parsedAdminTutorials.map(t => t.category));
      setCategories(['all', ...Array.from(adminCategorySet)]);
    }

    // Try to fetch from Firestore in the background (optional)
    try {
      // const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
      // const { db } = await import('../firebase/config');

      const tutorialsRef = collection(db, 'tutorials');
      const q = query(tutorialsRef, orderBy('createdAt', 'desc'));

      // Add timeout to Firebase request
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firebase timeout')), 3000)
      );

      const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);

      const tutorialsData = [];
      const firebaseCategorySet = new Set();

      querySnapshot.forEach((doc) => {
        const tutorial = { id: doc.id, ...doc.data() };
        tutorialsData.push(tutorial);
        if (tutorial.category) {
          firebaseCategorySet.add(tutorial.category);
        }
      });

      if (tutorialsData.length > 0) {
        // Replace with real Firebase data
        setTutorials(tutorialsData);
        setCategories(['all', ...Array.from(firebaseCategorySet)]);
      }
    } catch (error) {
      // Keep using local data, Firebase failed
      console.log('Using local data, Firebase not available:', error.message);
    }
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Tutorials
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Discover and learn from our comprehensive collection of tutorials
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tutorials Grid */}
      {filteredTutorials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            No tutorials found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map(tutorial => (
            <Link
              key={tutorial.id}
              to={`/tutorial/${tutorial.id}`}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              {tutorial.thumbnail && (
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    {tutorial.category}
                  </span>
                  {tutorial.isPremium && (
                    <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded">
                      Premium
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {tutorial.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {tutorial.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    {tutorial.authorName}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {tutorial.readTime} min read
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tutorials;