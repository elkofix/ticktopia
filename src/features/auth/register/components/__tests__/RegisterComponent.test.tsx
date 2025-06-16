import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterComponent from '../RegisterComponent';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { register } from '../../../auth.api';

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../auth.api', () => ({
  register: jest.fn(),
}));

describe('RegisterComponent', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  it('renders the registration form correctly', () => {
    render(<RegisterComponent />);

    expect(screen.getByText('Únete a')).toBeInTheDocument();
    expect(screen.getByText('Ticktopia')).toBeInTheDocument();
    expect(screen.getByText('Crea tu cuenta nueva')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellido')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear mi cuenta' })).toBeInTheDocument();
    expect(screen.getByText('¿Ya tienes cuenta?')).toBeInTheDocument();
  });

  it('updates form fields when user types', () => {
    render(<RegisterComponent />);

    const nameInput = screen.getByLabelText('Nombre');
    const lastnameInput = screen.getByLabelText('Apellido');
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'John' } });
    fireEvent.change(lastnameInput, { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(emailInput, { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });

    expect(nameInput).toHaveValue('John');
    expect(lastnameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits the form with correct data', async () => {
    // Mock successful registration and login
    (register as jest.Mock).mockResolvedValue({});
    mockLogin.mockResolvedValue({});

    render(<RegisterComponent />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { name: 'name', value: 'John' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { name: 'password', value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }));

    // Wait for async operations to complete
    await waitFor(() => {
      expect(register).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        'John',
        'Doe'
      );
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('john@example.com', 'password123');
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows loading state during registration', async () => {
    // Mock a slow registration
    (register as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 1000))
    );

    render(<RegisterComponent />);

    // Fill out and submit the form
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { name: 'name', value: 'John' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }));

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText('Creando cuenta...')).toBeInTheDocument();
    });
  });

  it('displays registration error when registration fails', async () => {
    const errorMessage = 'Email already in use';
    (register as jest.Mock).mockResolvedValue({ error: errorMessage });

    render(<RegisterComponent />);

    // Fill out and submit the form
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { name: 'name', value: 'John' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }));

    // Check error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays login error when login after registration fails', async () => {
    const errorMessage = 'Invalid credentials';
    (register as jest.Mock).mockResolvedValue({});
    mockLogin.mockRejectedValue(new Error(errorMessage));

    render(<RegisterComponent />);

    // Fill out and submit the form
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { name: 'name', value: 'John' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }));

    // Check error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('disables form fields and button during submission', async () => {
    // Mock a slow registration
    (register as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 1000))
    );

    render(<RegisterComponent />);

    // Fill out and submit the form
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { name: 'name', value: 'John' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }));

    // Check all fields are disabled during submission
    await waitFor(() => {
      expect(screen.getByLabelText('Nombre')).toBeDisabled();
      expect(screen.getByLabelText('Apellido')).toBeDisabled();
      expect(screen.getByLabelText('Correo electrónico')).toBeDisabled();
      expect(screen.getByLabelText('Contraseña')).toBeDisabled();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});