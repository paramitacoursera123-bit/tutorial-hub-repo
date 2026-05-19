import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserSavedTutorials, removeSavedTutorial } from '../utils/firebaseHelpers';
import { ArrowLeft, Bookmark, Trash2, ChevronRight } from 'lucide-react';

function MyLearning() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [savedTutorials, setSavedTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const tutorials = await getUserSavedTutorials(currentUser.uid, userRole);
        setSavedTutorials(tutorials);
      } catch (err) {
        console.error('Error loading saved tutorials:', err);
        setError('Unable to load your saved tutorials right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [currentUser, userRole]);

  const handleRemove = async (tutorialId) => {
    if (!currentUser) return;
    try {
      await removeSavedTutorial(currentUser.uid, tutorialId, userRole);
      setSavedTutorials((prev) => prev.filter((tutorial) => tutorial.id !== tutorialId));
    } catch (err) {
      console.error('Error removing saved tutorial:', err);
      setError('Unable to remove this tutorial from your learning list. Please try again.');
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300 mb-4">Please sign in to view your learning dashboard.</p>
        <button
          onClick={() => navigate('/login')}
          className="btn btn-primary"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Learning</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
            Keep track of your saved tutorials and continue learning from where you left off.
          </p>
        </div>
        <Link
          to="/tutorials"
          className="btn btn-secondary w-full sm:w-auto"
        >
          Browse Tutorials
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Saved Tutorials</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your bookmarked tutorials are stored here so you can return to them later.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-300 text-sm font-medium">
                <Bookmark className="w-5 h-5" />
                {savedTutorials.length} saved
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : savedTutorials.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-300">
                <p className="mb-4">You haven't saved any tutorials yet.</p>
                <Link to="/tutorials" className="btn btn-primary">
                  Save tutorials from the tutorials page
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedTutorials.map((tutorial) => (
                  <div key={tutorial.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-300 mb-2">
                          <Bookmark className="w-4 h-4" />
                          Bookmarked
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {tutorial.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {tutorial.description || 'No description available.'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{tutorial.category || 'General'}</span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{tutorial.isPremium ? 'Premium' : 'Free'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-start sm:items-end">
                        <Link
                          to={`/tutorial/${tutorial.id}`}
                          className="btn btn-primary px-4 py-2"
                        >
                          Continue
                        </Link>
                        <button
                          onClick={() => handleRemove(tutorial.id)}
                          className="btn btn-secondary px-4 py-2 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h2 className="text-xl font-semibold">Learning Dashboard</h2>
            <p className="mt-2 text-sm text-white/85">
              Your saved tutorials appear here so you can quickly jump back into your studies and keep your favorites organized.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tip</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Use the bookmark button inside tutorials or on the tutorial detail page to add content to your learning list.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <ChevronRight className="w-4 h-4" />
              Your learning list is private and available anytime you sign in.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MyLearning;
