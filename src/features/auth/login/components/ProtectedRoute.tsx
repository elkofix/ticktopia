'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Role[];
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, hasAllRoles, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else if (requiredRoles && !hasAllRoles(requiredRoles)) {
        router.replace('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, router, requiredRoles, hasAllRoles]);

  if (isLoading || !isAuthenticated) {
    return <div>Cargando...</div>; // o un spinner
  }

  return <>{children}</>;
};
