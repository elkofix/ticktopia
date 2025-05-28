import { notFound } from 'next/navigation';
import { getAllUsers } from '@/features/users/users.api';
import UserList from '@/features/users/components/UserList';

export default async function Page() {
    try {
        const users = await getAllUsers();

        return (
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-6">User Management</h1>
                    <UserList users={users} />
                </div>
        );
    } catch (error) {
        console.log(error);
        notFound();
    }
}