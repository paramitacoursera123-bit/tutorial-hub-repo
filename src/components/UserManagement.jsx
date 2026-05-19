import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { promoteUserToAdmin, demoteAdminToUser } from '../utils/firebaseHelpers';
import { useAuth } from '../contexts/AuthContext';
import { Users, Shield, User, Trash2, Save } from 'lucide-react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRole, setEditingRole] = useState('');
  const [saving, setSaving] = useState(false);
  const { currentUser, refreshUserRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setError('');
      setLoading(true);

      // Fetch regular users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'user'
      }));

      // Fetch admin users
      const adminsSnapshot = await getDocs(collection(db, 'adminUsers'));
      const adminsList = adminsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'admin'
      }));

      setUsers(usersList);
      setAdminUsers(adminsList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user) => {
    setEditingUserId(user.id);
    setEditingRole(user.type === 'admin' ? 'admin' : 'user');
  };

  const handleSaveRole = async (userId, userType) => {
    try {
      setSaving(true);
      setError('');
      const newRole = editingRole;
      let roleChanged = false;

      if (userType === 'user' && newRole === 'admin') {
        roleChanged = true;
        const userDoc = users.find(u => u.id === userId);
        await promoteUserToAdmin(userId, userDoc.email, userDoc.displayName);
      } else if (userType === 'admin' && newRole === 'user') {
        roleChanged = true;
        const adminDoc = adminUsers.find(a => a.id === userId);
        await demoteAdminToUser(userId, adminDoc.email, adminDoc.displayName);
      }

      setEditingUserId(null);
      setEditingRole('');

      if (roleChanged && currentUser?.uid === userId) {
        await refreshUserRole();
        navigate('/tutorials');
      }

      await fetchAllUsers();
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update user role. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditingRole('');
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
        <Users size={28} className="text-primary-600" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Management
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <Shield className="text-blue-500" size={32} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminUsers.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <User className="text-green-500" size={32} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Regular Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-blue-500" />
          Admin Users ({adminUsers.length})
        </h3>
        
        {adminUsers.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No admin users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-300 dark:border-gray-600">
                <tr>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Email</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Display Name</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Created</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Role</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-2 text-gray-900 dark:text-white">{admin.email}</td>
                    <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{admin.displayName || '-'}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                      {admin.createdAt ? new Date(admin.createdAt.toDate?.() || admin.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-2">
                      {editingUserId === admin.id ? (
                        <select
                          value={editingRole}
                          onChange={(e) => setEditingRole(e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      ) : (
                        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded text-xs font-semibold">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {editingUserId === admin.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveRole(admin.id, 'admin')}
                            disabled={saving}
                            className="btn btn-primary text-xs px-2 py-1 flex items-center gap-1 disabled:opacity-50"
                          >
                            <Save size={14} />
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="btn btn-secondary text-xs px-2 py-1 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditRole(admin)}
                          className="btn btn-secondary text-xs px-2 py-1"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Regular Users Table */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User size={20} className="text-green-500" />
          Regular Users ({users.length})
        </h3>
        
        {users.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No regular users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-300 dark:border-gray-600">
                <tr>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Email</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Display Name</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Created</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Role</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-2 text-gray-900 dark:text-white">{user.email}</td>
                    <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{user.displayName || '-'}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                      {user.createdAt ? new Date(user.createdAt.toDate?.() || user.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-2">
                      {editingUserId === user.id ? (
                        <select
                          value={editingRole}
                          onChange={(e) => setEditingRole(e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded text-xs font-semibold">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {editingUserId === user.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveRole(user.id, 'user')}
                            disabled={saving}
                            className="btn btn-primary text-xs px-2 py-1 flex items-center gap-1 disabled:opacity-50"
                          >
                            <Save size={14} />
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="btn btn-secondary text-xs px-2 py-1 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditRole(user)}
                          className="btn btn-secondary text-xs px-2 py-1"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
