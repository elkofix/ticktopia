import { AuthUser } from '@/shared/types/user';
import authSlice, { loginFailure, loginStart, loginSuccess, logout, updateUser } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { login as loginApi } from '../auth.api';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const updateUserProfile = (userData: AuthUser) => {
    dispatch(updateUser(userData));
  };


  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());

      const response = await loginApi(email, password);

      if (!response) {
        throw new Error('Error en el login');
      }

      const userData: AuthUser = response.user;
      dispatch(loginSuccess(userData));

      return userData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const hasRole = (role: Role): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    return roles.some(role => user?.roles?.includes(role)) || false;
  };

  const hasAllRoles = (roles: Role[]): boolean => {
    return roles.every(role => user?.roles?.includes(role)) || false;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    updateUserProfile
  };
};