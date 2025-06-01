import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginComponent from '../LoginComponent';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

// Mock the hooks
jest.mock('../../../hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('LoginComponent', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
      hasRole: jest.fn(),
      hasAnyRole: jest.fn(),
      hasAllRoles: jest.fn(),
      loginTime: null,
      updateUserProfile: jest.fn(),
      checkSessionExpiration: jest.fn(),
    });

    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('renders correctly', () => {
    render(<LoginComponent />);
    
    expect(screen.getByText('Bienvenido a')).toBeInTheDocument();
    expect(screen.getByText('Ticktopia')).toBeInTheDocument();
    expect(screen.getByText('Inicia sesión en tu cuenta')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Entrar a mi cuenta')).toBeInTheDocument();
    expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
    expect(screen.getByText('Regístrate aquí')).toBeInTheDocument();
  });

  it('updates form fields when typing', () => {
    render(<LoginComponent />);
    
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits the form with credentials', async () => {
    const mockUserData = {
      id: '1',
      name: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      isActive: true,
      roles: ['user'],
    };
    
    mockLogin.mockResolvedValue(mockUserData);
    
    render(<LoginComponent />);
    
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByText('Entrar a mi cuenta');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows loading state during login', async () => {
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isLoading: true,
    });
    
    render(<LoginComponent />);
    
    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays error message when login fails', () => {
    const errorMessage = 'Invalid credentials';
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      error: errorMessage,
    });
    
    render(<LoginComponent />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass('bg-red-50', 'border-red-200', 'text-red-700');
  });

  it('disables form fields during loading', () => {
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isLoading: true,
    });
    
    render(<LoginComponent />);
    
    expect(screen.getByLabelText('Correo electrónico')).toBeDisabled();
    expect(screen.getByLabelText('Contraseña')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles login error', async () => {
    const errorMessage = 'Login failed';
    mockLogin.mockRejectedValue(new Error(errorMessage));
    
    render(<LoginComponent />);
    
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByText('Entrar a mi cuenta'));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});