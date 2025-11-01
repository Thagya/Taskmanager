import React, { useEffect, useState } from 'react';
import { userApi } from '../api/userApi';
import { User, AlertType } from '../types';
import Alert from '../components/Common/Alert';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatDateTime } from '../utils/helpers';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers(searchTerm);
      if (response.data) {
        setUsers(response.data as unknown as User[]);
      }
    } catch (error) {
      showAlert('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: AlertType['type'], message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userApi.deleteUser(id);
      showAlert('success', 'User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      showAlert('error', error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await userApi.updateUser(user.id, { isActive: !user.isActive });
      showAlert('success', `User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error: any) {
      showAlert('error', error.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400 mt-1">Manage system users and permissions</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Users List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400">
              Showing <span className="text-white font-semibold">{users.length}</span> user(s)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Role:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Joined:</span>
                    <span className="text-white text-sm">{formatDateTime(user.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      user.isActive
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block bg-gray-800 p-8 rounded-2xl border border-gray-700">
                <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No users found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Alert */}
      {alert && <Alert alert={alert} onClose={() => setAlert(null)} />}
    </div>
  );
};

export default Users;