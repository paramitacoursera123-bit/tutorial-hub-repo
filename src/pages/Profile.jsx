import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Edit2, LogOut, ArrowLeft } from 'lucide-react';

function Profile() {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300 mb-4">Please log in to view your profile.</p>
        <button
          onClick={() => navigate('/login')}
          className="btn btn-primary"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      // In a real application, you would update the user profile in Firebase
      // For now, we'll just show a success message
      console.log('Profile update:', { displayName });
      
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError('');
      setLoading(true);
      await logout();
      navigate('/');
    } catch (err) {
      setError('Failed to logout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createdDate = currentUser.metadata?.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';

  const lastSignIn = currentUser.metadata?.lastSignInTime
    ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="card mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser.displayName || 'Anonymous User'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentUser.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="btn btn-secondary flex items-center"
            disabled={loading}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Mail className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Calendar className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Account Created</p>
                <p className="font-medium">{createdDate}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Calendar className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Sign In</p>
                <p className="font-medium">{lastSignIn}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Actions</h3>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full btn btn-danger flex items-center justify-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
}

export default Profile;
