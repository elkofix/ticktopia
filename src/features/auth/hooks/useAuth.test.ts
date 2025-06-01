import { act, renderHook } from '@testing-library/react';
import { login as loginApi } from '../auth.api';
import { AuthUser } from '@/shared/types/user';
import { useAuth } from './useAuth';

// Mock de las dependencias
jest.mock('../auth.api');
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  require('react-redux').useDispatch.mockReturnValue(mockDispatch);
  require('react-redux').useSelector.mockImplementation(mockUseSelector);
});

afterEach(() => {
  jest.useRealTimers();
});



describe('useAuth - additional tests', () => {
  const mockUser: AuthUser = {
    id: '123',
    name: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    isActive: true,
    roles: ['admin'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    require('react-redux').useDispatch.mockReturnValue(mockDispatch);
    require('react-redux').useSelector.mockImplementation(mockUseSelector);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('login - edge cases', () => {
    it('should handle API response without user data', async () => {
      (loginApi as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });
      mockUseSelector.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('john.doe@example.com', 'wrong');
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth/loginFailure',
          payload: "Inicio de sesión fallido, revisa tus credenciales",
        })
      );
    });

    it('should handle empty API response', async () => {
      (loginApi as jest.Mock).mockResolvedValue({});
      mockUseSelector.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('john.doe@example.com', 'password');
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth/loginFailure',
          payload: "Inicio de sesión fallido, revisa tus credenciales",
        })
      );
    });
  });

  describe('session management - additional cases', () => {

    it('should return true for checkSessionExpiration when session is about to expire', () => {
      const loginTime = Date.now() - (55 * 60 * 1000); // 55 minutes ago
      mockUseSelector.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginTime,
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.checkSessionExpiration()).toBe(true);
    });
    
    describe('role checks - edge cases', () => {
      it('should handle undefined roles in hasRole', () => {
        mockUseSelector.mockReturnValue({
          user: { ...mockUser, roles: undefined },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        const { result } = renderHook(() => useAuth());
        expect(result.current.hasRole('admin')).toBe(false);
      });

      it('should handle empty roles array in hasAnyRole', () => {
        mockUseSelector.mockReturnValue({
          user: { ...mockUser, roles: [] },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        const { result } = renderHook(() => useAuth());
        expect(result.current.hasAnyRole(['admin'])).toBe(false);
      });

      it('should handle empty roles array in hasAllRoles', () => {
        mockUseSelector.mockReturnValue({
          user: { ...mockUser, roles: [] },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        const { result } = renderHook(() => useAuth());
        expect(result.current.hasAllRoles(['admin'])).toBe(false);
      });
    });

    describe('cookie management', () => {
      it('should properly clear cookie on logout with all attributes', () => {
        mockUseSelector.mockReturnValue({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Mock document.cookie
        Object.defineProperty(document, 'cookie', {
          writable: true,
          value: 'token=abc123; Path=/; Secure; SameSite=Strict',
        });

        const { result } = renderHook(() => useAuth());
        act(() => {
          result.current.logout();
        });

        expect(document.cookie).toContain('token=; expires=Thu, 01 Jan 1970 00:00:00 UTC');
      });
    });

    describe('error handling', () => {
      it('should handle non-Error exceptions in login', async () => {
        (loginApi as jest.Mock).mockRejectedValue('Some string error');
        mockUseSelector.mockReturnValue({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        const { result } = renderHook(() => useAuth());

        await act(async () => {
          await expect(result.current.login('john.doe@example.com', 'password')).rejects.toEqual('Some string error');
        });

        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'auth/loginFailure',
            payload: 'Error desconocido',
          })
        );
      });
    });
  });
});