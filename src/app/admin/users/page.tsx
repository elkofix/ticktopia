'use client';

import { useEffect, useState } from 'react';
import UserList from '@/features/users/components/UserList';
import ErrorHandler from '@/shared/components/ErrorHandler';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { getAllUsers } from '@/features/users/users.client.api';

export default function UsersPage() {
    const [users, setUsers] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const data = await getAllUsers();
                
                if (data && !('error' in data)) {
                    setUsers(data);
                } else {
                    const errorData = (data as any)?.error;
                    const message = 
                        errorData?.response?.data?.message ||
                        errorData?.message ||
                        "Error al cargar los usuarios";
                    setError(message);
                }
            } catch (err: any) {
                setError(err.message || "No se pudieron obtener los usuarios");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorHandler message={error} />;
    }

    if (!users) {
        return <ErrorHandler message="No se encontraron usuarios" />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Manejo de usuarios</h1>
            <UserList users={users} />
        </div>
    );
}