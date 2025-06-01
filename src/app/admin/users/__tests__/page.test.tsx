// users.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import UsersPage from '../page';

// Mock completo del módulo usersApi
jest.mock('../../../../features/users/users.client.api', () => ({
  getAllUsers: jest.fn(),
}));

// Mock de los componentes hijos
jest.mock('../../../../features/users/components/UserList', () => ({
  __esModule: true,
  default: ({ users }: { users: any[] }) => (
    <div data-testid="user-list-mock">
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  ),
}));

jest.mock('../../../../shared/components/LoadingSpinner', () => () => (
  <div data-testid="loading-spinner">Loading...</div>
));

jest.mock('../../../../shared/components/ErrorHandler', () => ({ message }: { message: string }) => (
  <div data-testid="error-handler">{message}</div>
));

// Datos de prueba
const mockUsers = [
  {
    id: '1',
    email: 'user1@test.com',
    name: 'User One',
    lastname: 'Lastname',
    isActive: true,
    roles: ['client'],
  },
  {
    id: '2',
    email: 'user2@test.com',
    name: 'User Two',
    lastname: 'Lastname',
    isActive: true,
    roles: ['admin'],
  },
];

describe('UsersPage', () => {
  const mockGetAllUsers = require('../../../../features/users/users.client.api').getAllUsers;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar el spinner de carga inicialmente', () => {
    mockGetAllUsers.mockImplementation(
      () => new Promise(() => {}) // Nunca resuelve para mantener loading
    );

    render(<UsersPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('debe mostrar la lista de usuarios cuando la carga es exitosa', async () => {
    mockGetAllUsers.mockResolvedValue(mockUsers);

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('user-list-mock')).toBeInTheDocument();
      expect(screen.getByText('User One')).toBeInTheDocument();
      expect(screen.getByText('User Two')).toBeInTheDocument();
      expect(screen.getByText('Manejo de usuarios')).toBeInTheDocument();
    });
  });

  it('debe mostrar un mensaje de error cuando la API falla', async () => {
    const errorMessage = 'Error al cargar los usuarios';
    mockGetAllUsers.mockResolvedValue({
      error: errorMessage,
    });

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-handler')).toHaveTextContent(errorMessage);
    });
  });


  it('debe manejar errores inesperados de la API', async () => {
    const errorMessage = 'Error inesperado';
    mockGetAllUsers.mockRejectedValue(new Error(errorMessage));

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-handler')).toHaveTextContent(
        errorMessage
      );
    });
  });

  it('debe mostrar el título correctamente cuando la carga es exitosa', async () => {
    mockGetAllUsers.mockResolvedValue(mockUsers);

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Manejo de usuarios')).toBeInTheDocument();
    });
  });
});