import { useState, useEffect } from 'react';
import { 
  getTotalAnalytics, 
  getTopTutorialsByViews, 
  getTopTutorialsByRating,
  getRecentUsers,
  getCategoryDistribution 
} from '../utils/firebaseHelpers';
import { BarChart3, TrendingUp, Users, BookOpen, Eye, Heart } from 'lucide-react';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [topTutorials, setTopTutorials] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setError('');
      setLoading(true);

      const [analyticsData, topViews, topRatings, users, categoryDist] = await Promise.all([
        getTotalAnalytics(),
        getTopTutorialsByViews(5),
        getTopTutorialsByRating(5),
        getRecentUsers(10),
        getCategoryDistribution()
      ]);

      setAnalytics(analyticsData);
      setTopTutorials(topViews);
      setTopRated(topRatings);
      setRecentUsers(users);
      setCategories(categoryDist);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics. Check console for details.');
    } finally {
      setLoading(false);
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
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={28} className="text-primary-600" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Platform Analytics
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      {analytics && (
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tutorials</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.totalTutorials}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Eye className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <Heart className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.totalLikes.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Views/Tutorial</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.averageViewsPerTutorial}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Tutorials by Views */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Eye size={20} className="text-purple-600" />
          Top Tutorials by Views
        </h3>
        
        {topTutorials.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No tutorial data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-300 dark:border-gray-600">
                <tr>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Views</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Likes</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Category</th>
                </tr>
              </thead>
              <tbody>
                {topTutorials.map((tutorial, index) => (
                  <tr key={tutorial.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">
                      <span className="text-gray-400 mr-2">#{index + 1}</span>
                      {tutorial.title}
                    </td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{tutorial.views.toLocaleString()}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{tutorial.likes}</td>
                    <td className="py-3 px-2">
                      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                        {tutorial.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Rated Tutorials */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-orange-600" />
          Top Rated Tutorials
        </h3>
        
        {topRated.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No rating data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-300 dark:border-gray-600">
                <tr>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Rating</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Reviews</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Category</th>
                </tr>
              </thead>
              <tbody>
                {topRated.map((tutorial, index) => (
                  <tr key={tutorial.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">
                      <span className="text-gray-400 mr-2">#{index + 1}</span>
                      {tutorial.title}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{tutorial.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{tutorial.ratingCount}</td>
                    <td className="py-3 px-2">
                      <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                        {tutorial.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Distribution */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            Category Distribution
          </h3>
          
          {categories.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No category data yet.</p>
          ) : (
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(cat.count / Math.max(...categories.map(c => c.count), 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-900 dark:text-white font-semibold w-8 text-right">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-green-600" />
            Recent Signups
          </h3>
          
          {recentUsers.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No user signups yet.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${
                      user.role === 'admin'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchAnalytics}
          className="btn btn-primary"
        >
          Refresh Analytics
        </button>
      </div>
    </div>
  );
}

export default Analytics;
