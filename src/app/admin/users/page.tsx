import { notFound } from 'next/navigation';
import { getAllUsers } from '@/features/users/users.api';
import { ProtectedRoute } from '@/features/auth/login/components/ProtectedRoute';
import UserList from '@/features/users/components/UserList';

export default async function Page() {
    try {
        const users = await getAllUsers();

        return (
            <ProtectedRoute requiredRoles={['admin']}>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-6">User Management</h1>
                    <UserList users={users} />
                </div>
            </ProtectedRoute>
        );
    } catch (error) {
        console.log(error);
        notFound();
    }
}