"use client"
import { updateRolesToUser } from '@/features/roles/roles.api';
import { User } from '@/shared/types/event';
import { useState, useEffect } from 'react';

interface UserListProps {
  users: User[];
}

const allRoles: Role[] = ['admin', 'client', 'event-manager', 'ticketChecker'];

export default function UserList({ users }: UserListProps) {
  const [localUsers, setLocalUsers] = useState<User[]>(users);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const toggleRole = (userId: string, role: Role) => {
    setLocalUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? {
              ...user,
              roles: user.roles.includes(role)
                ? user.roles.filter(r => r !== role)
                : [...user.roles, role],
            }
          : user
      )
    );
  };

  const startEditing = (userId: string) => {
    setEditingUserId(userId);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setLocalUsers(users);
    setError(null);
  };

  const saveRoles = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const user = localUsers.find(u => u.id === userId);
      if (!user) return;

      await updateRolesToUser(userId, user.roles);
      setEditingUserId(null);
    } catch (err) {
      console.error('Failed to update roles:', err);
      setError('Failed to update roles. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'event-manager':
        return 'bg-blue-100 text-blue-800';
      case 'ticketChecker':
        return 'bg-green-100 text-green-800';
      case 'client':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {localUsers.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.name} {user.lastname}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user.id ? (
                  <div className="flex flex-wrap gap-2">
                    {allRoles.map(role => (
                      <label
                        key={role}
                        className="inline-flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={user.roles.includes(role)}
                          onChange={() => toggleRole(user.id, role)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getRoleColor(
                            role
                          )}`}
                        >
                          {role}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role: Role) => (
                      <span
                        key={role}
                        className={`px-2 py-1 text-xs rounded-full ${getRoleColor(
                          role
                        )}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingUserId === user.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveRoles(user.id)}
                      disabled={isSubmitting}
                      className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing(user.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit Roles
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}