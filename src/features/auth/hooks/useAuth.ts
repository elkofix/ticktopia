import { AuthUser } from '@/shared/types/user';
import authSlice, { loginFailure, loginStart, loginSuccess, logout, updateUser } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { login as loginApi } from '../auth.api';

const SESSION_DURATION = 60 * 60 * 1000; // 1 hora
const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutos antes de expirar


export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error, loginTime } = useSelector(
    (state: RootState) => state.auth
  );

  const checkSessionExpiration = (): boolean => {
    if (!loginTime) return false;

    const currentTime = Date.now();
    const elapsedTime = currentTime - loginTime;
    const remainingTime = SESSION_DURATION - elapsedTime;
    
    // Si quedan menos de 5 minutos de sesión
    return remainingTime <= WARNING_THRESHOLD;
  };



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
      if ('user' in response) {
        const userData: AuthUser = response.user;
        dispatch(loginSuccess(userData));
        return userData;

      } else {
        const errorMessage = response.error || 'Error desconocido';
        console.error('Error en el login:', errorMessage);
        dispatch(loginFailure("Inicio de sesión fallido, revisa tus credenciales"));
      }
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
    loginTime,           // <-- exponemos loginTime
    hasAllRoles,
    updateUserProfile,
    checkSessionExpiration
  };
};