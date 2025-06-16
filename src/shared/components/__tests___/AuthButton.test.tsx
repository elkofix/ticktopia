import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { AuthButtons } from '../AuthButtons';

jest.mock('lucide-react', () => ({
  LogIn: jest.fn(() => <svg data-testid="login-icon" />),
  UserPlus: jest.fn(() => <svg data-testid="register-icon" />),
}));

describe('AuthButtons Component', () => {
  const mockOnLogin = jest.fn();
  const mockOnRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders both buttons', () => {
    render(<AuthButtons onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('renders login button with correct styles and icon', () => {
    render(<AuthButtons onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    expect(loginButton).toHaveClass('border-indigo-600');
    expect(loginButton).toHaveClass('text-indigo-600');
    expect(loginButton).toHaveClass('bg-white');
    expect(screen.getByTestId('login-icon')).toBeInTheDocument();
  });

  test('renders register button with correct styles and icon', () => {
    render(<AuthButtons onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    const registerButton = screen.getByRole('button', { name: /registrarse/i });
    expect(registerButton).toHaveClass('bg-gradient-to-r');
    expect(registerButton).toHaveClass('from-brand');
    expect(registerButton).toHaveClass('to-violet');
    expect(screen.getByTestId('register-icon')).toBeInTheDocument();
  });

  test('calls onLogin when login button is clicked', () => {
    render(<AuthButtons onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(loginButton);
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  test('calls onRegister when register button is clicked', () => {
    render(<AuthButtons onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    const registerButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(registerButton);
    expect(mockOnRegister).toHaveBeenCalledTimes(1);
  });

  test('shows only icons on small screens', () => {
    render(<AuthButtons onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    const loginText = screen.getByText('Iniciar Sesión');
    const registerText = screen.getByText('Registrarse');
    
    expect(loginText).toHaveClass('hidden');
    expect(registerText).toHaveClass('hidden');
  });

  test('has hover effects on buttons', () => {
    render(<AuthButtons onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    const registerButton = screen.getByRole('button', { name: /registrarse/i });
    
    expect(loginButton).toHaveClass('hover:bg-indigo-600');
    expect(loginButton).toHaveClass('hover:text-white');
    expect(registerButton).toHaveClass('hover:from-violet');
    expect(registerButton).toHaveClass('hover:to-brand');
  });

  test('has focus styles', () => {
    render(<AuthButtons onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    const registerButton = screen.getByRole('button', { name: /registrarse/i });
    
    expect(loginButton).toHaveClass('focus:ring-indigo-600');
    expect(registerButton).toHaveClass('focus:ring-brand');
  });
});