import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, User, LogOut, Settings } from 'lucide-react';
import logo from '../assets/logo.svg';

function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Technutia
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/tutorials" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Tutorials
            </Link>

            {currentUser ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                    Admin
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="btn-navbar flex items-center gap-2">
                    <User size={18} />
                    <span className="hidden sm:inline">{currentUser.displayName || currentUser.email}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-t-lg transition-colors">
                      <User size={16} />
                      Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-navbar">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="btn-icon btn-icon-secondary"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;