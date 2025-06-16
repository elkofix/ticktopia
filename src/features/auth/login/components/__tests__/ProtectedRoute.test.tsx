import React from 'react';
import { render } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

// Mock the hooks
jest.mock('../../../hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockHasAllRoles = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      hasRole: jest.fn(),
      hasAnyRole: jest.fn(),
      hasAllRoles: mockHasAllRoles,
      loginTime: null,
      updateUserProfile: jest.fn(),
      checkSessionExpiration: jest.fn(),
    });
  });

  it('renders children when authenticated and has required roles', () => {
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isAuthenticated: true,
      isLoading: false,
    });
    mockHasAllRoles.mockReturnValue(true);

    const { getByText } = render(
      <ProtectedRoute requiredRoles={['admin']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockReplace).toHaveBeenCalledWith('/auth/login');
  });

  it('redirects to unauthorized when missing required roles', () => {
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isAuthenticated: true,
      isLoading: false,
    });
    mockHasAllRoles.mockReturnValue(false);

    render(
      <ProtectedRoute requiredRoles={['admin']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockReplace).toHaveBeenCalledWith('/unauthorized');
  });

  it('shows loading state while checking auth', () => {
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isAuthenticated: false,
      isLoading: true,
    });

    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Cargando...')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not redirect when loading', () => {
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('checks for all required roles when provided', () => {
    const requiredRoles: Role[] = ['admin', 'event-manager'];
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isAuthenticated: true,
      isLoading: false,
    });
    mockHasAllRoles.mockReturnValue(true);

    render(
      <ProtectedRoute requiredRoles={requiredRoles}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockHasAllRoles).toHaveBeenCalledWith(requiredRoles);
  });

  it('does not check roles when no roles required', () => {
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockHasAllRoles).not.toHaveBeenCalled();
  });
});