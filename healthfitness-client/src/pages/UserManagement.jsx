import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import adminService from '../services/adminService';
import { toast } from 'react-hot-toast';

export default function UserManagement() {
    const { t } = useLanguage();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers();
            if (response.success || response) {
                const data = response.data || response;
                // Map backend format to UI format
                const mappedUsers = Array.isArray(data) ? data.map(u => ({
                    id: u.id,
                    name: u.name || 'Unknown',
                    email: u.email,
                    role: u.email.includes('admin') ? 'Admin' : 'User', // Simple heuristic for now
                    status: u.isActive ? 'Active' : 'Suspended',
                    isActive: u.isActive,
                    joined: new Date(u.createdAt).toLocaleDateString()
                })) : [];
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const response = await adminService.toggleUserStatus(id);
            if (response.success || response) {
                toast.success('User status updated');
                loadUsers(); // Reload to get fresh state
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="animate-fade-in p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('userManagement')} 👥</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading users...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-700">User</th>
                                <th className="p-4 font-semibold text-gray-700">Role</th>
                                <th className="p-4 font-semibold text-gray-700">Status</th>
                                <th className="p-4 font-semibold text-gray-700">Joined</th>
                                <th className="p-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {user.joined}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleStatus(user.id, user.status)}
                                                className={`text-sm font-semibold ${user.role === 'Admin' ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                                                disabled={user.role === 'Admin'}
                                                title={user.role === 'Admin' ? "Cannot suspend Admin" : ""}
                                            >
                                                {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
