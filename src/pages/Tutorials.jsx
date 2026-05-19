import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, User, Eye, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllTutorials, getUserSavedTutorialIds, saveTutorialToUser, removeSavedTutorial } from '../utils/firebaseHelpers';

function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [savedTutorialIds, setSavedTutorialIds] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);

  useEffect(() => {
    fetchTutorialsFromFirestore();
  }, [location.pathname]);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!currentUser) {
        setSavedTutorialIds([]);
        return;
      }

      try {
        setSavedLoading(true);
        const ids = await getUserSavedTutorialIds(currentUser.uid, userRole);
        setSavedTutorialIds(ids);
      } catch (error) {
        console.error('Error loading saved tutorials:', error);
      } finally {
        setSavedLoading(false);
      }
    };

    fetchSaved();
  }, [currentUser, userRole]);

  const fetchTutorialsFromFirestore = async () => {
    try {
      setLoading(true);
      const data = await getAllTutorials();
      // Expose only published tutorials to public listing
      const publicTutorials = data.filter(t => (t.status || 'published') !== 'draft');
      setTutorials(publicTutorials);

      // Extract unique categories
      const categorySet = new Set(publicTutorials.map(t => t.category));
      setCategories(['all', ...Array.from(categorySet)]);
    } catch (error) {
      console.error('Error loading tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPriceLabel = (tutorial) => {
    if (tutorial.price !== undefined && tutorial.price !== null) {
      return `$${Number(tutorial.price).toFixed(2)}`;
    }
    return '$9.99';
  };

  const handleTutorialClick = (tutorial) => {
    navigate(`/tutorial/${tutorial.id}`);
  };

  const handleToggleBookmark = async (event, tutorialId) => {
    event.stopPropagation();

    if (!currentUser) {
      navigate('/login', { state: { next: '/learning' } });
      return;
    }

    try {
      if (savedTutorialIds.includes(tutorialId)) {
        await removeSavedTutorial(currentUser.uid, tutorialId, userRole);
        setSavedTutorialIds((prev) => prev.filter((id) => id !== tutorialId));
      } else {
        await saveTutorialToUser(currentUser.uid, tutorialId, userRole);
        setSavedTutorialIds((prev) => [...prev, tutorialId]);
      }
    } catch (error) {
      console.error('Error toggling tutorial bookmark:', error);
    }
  };

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
          {filteredTutorials.map(tutorial => {
            const priceLabel = getPriceLabel(tutorial);
            const isLocked = tutorial.isPremium && !currentUser;
            const cardClass = `card transition-shadow duration-200 ${isLocked ? 'hover:shadow-md cursor-pointer' : 'hover:shadow-lg'}`;

            return (
              <div
                key={tutorial.id}
                role="button"
                tabIndex={0}
                onClick={() => handleTutorialClick(tutorial)}
                className={`${cardClass} relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                <button
                  type="button"
                  onClick={(event) => handleToggleBookmark(event, tutorial.id)}
                  className={`absolute top-4 right-4 z-10 rounded-full p-2 transition ${savedTutorialIds.includes(tutorial.id) ? 'bg-primary-600 text-white shadow-lg' : 'bg-white/90 text-gray-600 dark:bg-gray-900/90 dark:text-gray-200 hover:text-primary-600'}`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
                {tutorial.thumbnail && (
                  <img
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                
                <div className="p-6 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {tutorial.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${tutorial.isPremium ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}>
                      {tutorial.isPremium ? 'Premium' : 'FREE'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {tutorial.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {tutorial.description}
                  </p>

                  {tutorial.isPremium && (
                    <div className="mb-4 rounded-lg bg-yellow-50 dark:bg-yellow-900 p-3 text-sm text-yellow-800 dark:text-yellow-200">
                      <span className="font-semibold">{priceLabel}</span> — Premium content requires purchase.
                    </div>
                  )}

<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    {tutorial.authorName}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {tutorial.readTime} min read
                  </div>
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    {(tutorial.views || 0).toLocaleString()} views
                    </div>
                  </div>

                  {tutorial.isPremium && (
                    <div className="mt-4 text-sm font-medium text-primary-700 dark:text-primary-200">
                      {isLocked
                        ? 'Login to view and purchase premium access.'
                        : 'Click to view purchase options and unlock this tutorial.'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tutorials;