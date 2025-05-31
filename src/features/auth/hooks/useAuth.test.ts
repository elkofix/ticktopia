
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
  require('react-redux').useDispatch.mockReturnValue(mockDispatch);
  require('react-redux').useSelector.mockImplementation(mockUseSelector);
});

describe('useAuth', () => {
  const mockUser: AuthUser = {
    id: '123',
    name: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    isActive: true,
    roles: ['admin'],
  };


  describe('logout', () => {
    it('should dispatch logout and clear cookie', async () => {
      mockUseSelector.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Mock de document.cookie
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'token=abc123',
      });

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.logout();
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth/logout',
        })
      );
      expect(document.cookie).toContain('token=; expires=Thu, 01 Jan 1970 00:00:00 UTC');
    });
  });

  describe('role checks', () => {
    beforeEach(() => {
      mockUseSelector.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    });

    it('should return true for hasRole when user has the role', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasRole('admin')).toBe(true);
    });

    it('should return false for hasRole when user does not have the role', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasRole('client')).toBe(false);
    });

    it('should return true for hasAnyRole when user has at least one role', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAnyRole(['admin', 'client'])).toBe(true);
    });

    it('should return false for hasAnyRole when user has none of the roles', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAnyRole(['client', 'event-manager'])).toBe(false);
    });

    it('should return true for hasAllRoles when user has all roles', () => {
      mockUseSelector.mockReturnValue({
        user: { ...mockUser, roles: ['admin', 'event-manager'] },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAllRoles(['admin', 'event-manager'])).toBe(true);
    });

    it('should return false for hasAllRoles when user is missing any role', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAllRoles(['admin', 'client'])).toBe(false);
    });
  });

  describe('updateUserProfile', () => {
    it('should dispatch updateUser with new user data', () => {
      mockUseSelector.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());
      const updatedUser = { ...mockUser, name: 'Jane' };

      act(() => {
        result.current.updateUserProfile(updatedUser);
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth/updateUser',
          payload: updatedUser,
        })
      );
    });
  });
});