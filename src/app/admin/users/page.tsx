import { getAllUsers } from '@/features/users/users.api';
import UserList from '@/features/users/components/UserList';
import ErrorHandler from '@/shared/components/ErrorHandler';

export default async function Page() {
    const users = await getAllUsers();
    if (!users || 'error' in users) {
        return <ErrorHandler error={users.error || "No se pudieron obtener los usuarios"} />;
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Manejo de usuarios</h1>
            <UserList users={users} />
        </div>
    );

}