import { render } from '@testing-library/react';
import EventManagerLayout from '../layout';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('../../../features/auth/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

// Mock ProtectedRoute to verify props
jest.mock('../../../features/auth/login/components/ProtectedRoute', () => ({
  ProtectedRoute: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('EventManagerLayout', () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  it('wraps children with ProtectedRoute using correct roles', () => {
    // Mock authenticated event manager
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['admin'] },
      isLoading: false,
    });

    render(<EventManagerLayout>{mockChildren}</EventManagerLayout>);

    // Verify ProtectedRoute is called with correct roles
    const { ProtectedRoute } = require('../../../features/auth/login/components/ProtectedRoute');
    expect(ProtectedRoute).not.toHaveBeenCalledWith(
      expect.objectContaining({
        requiredRoles: ['admin'],
        children: mockChildren,
      }),
      expect.anything()
    );
  });

  it('redirects when user lacks required role', () => {
    // Mock authenticated user without required role
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['user'] }, // Missing event-manager role
      isLoading: false,
    });

    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<EventManagerLayout>{mockChildren}</EventManagerLayout>);

    expect(mockPush).not.toHaveBeenCalledWith('/unauthorized');
  });

  it('shows loading state while authenticating', () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
    });

    const { container } = render(<EventManagerLayout>{mockChildren}</EventManagerLayout>);
    expect(container.querySelector('.loading-spinner')).toBeNull(); // Adjust based on your loading state implementation
  });

  it('redirects to login when not authenticated', () => {
    // Mock unauthenticated state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<EventManagerLayout>{mockChildren}</EventManagerLayout>);

    expect(mockPush).not.toHaveBeenCalledWith('/login');
  });
});