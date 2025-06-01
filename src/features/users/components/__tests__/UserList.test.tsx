import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { updateRolesToUser } from '../../../../features/roles/roles.api';
import UserList from '../UserList';
import { User } from '../../../../shared/types/event';

jest.mock('../../../../features/roles/roles.api', () => ({
  updateRolesToUser: jest.fn(),
}));

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    isActive: true,
    roles: ['client'],
  },
  {
    id: '2',
    name: 'Jane',
    lastname: 'Smith',
    email: 'jane@example.com',
    isActive: true,
    roles: ['admin', 'event-manager'],
  },
];

describe('UserList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the user table with correct data', () => {
    render(<UserList users={mockUsers} />);
    
    // Verificar que los usuarios se rendericen correctamente
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    
    // Verificar los estados
    expect(screen.getAllByText('Active')).toHaveLength(2);
    
    // Verificar los roles
    expect(screen.getByText('client')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('event-manager')).toBeInTheDocument();
  });

  it('allows editing roles when Edit button is clicked', () => {
    render(<UserList users={mockUsers} />);
    
    // Click en el botón de edición del primer usuario
    fireEvent.click(screen.getAllByText('Edit Roles')[0]);
    
    // Verificar que aparezcan los checkboxes para todos los roles
    expect(screen.getByLabelText('admin')).toBeInTheDocument();
    expect(screen.getByLabelText('client')).toBeInTheDocument();
    expect(screen.getByLabelText('event-manager')).toBeInTheDocument();
    expect(screen.getByLabelText('ticketChecker')).toBeInTheDocument();
  });

  it('toggles roles correctly during editing', () => {
    render(<UserList users={mockUsers} />);
    
    // Iniciar edición
    fireEvent.click(screen.getAllByText('Edit Roles')[0]);
    
    // Toggle del rol admin
    const adminCheckbox = screen.getByLabelText('admin');
    fireEvent.click(adminCheckbox);
    
    // Verificar que el rol se agregó
    expect(adminCheckbox).toBeChecked();
    
    // Toggle de nuevo para quitarlo
    fireEvent.click(adminCheckbox);
    expect(adminCheckbox).not.toBeChecked();
  });

  it('cancels editing correctly', () => {
    render(<UserList users={mockUsers} />);
    
    // Iniciar edición
    fireEvent.click(screen.getAllByText('Edit Roles')[0]);
    
    // Hacer cambios
    fireEvent.click(screen.getByLabelText('admin'));
    
    // Cancelar edición
    fireEvent.click(screen.getByText('Cancel'));
    
    // Verificar que los cambios no se mantuvieron
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(screen.getAllByText('Edit Roles')).toHaveLength(2);
  });

  it('shows error message when saving fails', async () => {
    (updateRolesToUser as jest.Mock).mockRejectedValueOnce(new Error('Failed'));
    
    render(<UserList users={mockUsers} />);
    
    // Iniciar edición
    fireEvent.click(screen.getAllByText('Edit Roles')[0]);
    
    // Guardar cambios
    fireEvent.click(screen.getByText('Save'));
    
    // Esperar a que aparezca el error
    await waitFor(() => {
      expect(screen.getByText('Failed to update roles. Please try again.')).toBeInTheDocument();
    });
  });

  it('applies correct colors to roles', () => {
    render(<UserList users={mockUsers} />);
    
    // Verificar colores de los roles
    const adminRole = screen.getByText('admin');
    expect(adminRole).toHaveClass('bg-red-100', 'text-red-800');
    
    const clientRole = screen.getByText('client');
    expect(clientRole).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('disables save button during submission', async () => {
    (updateRolesToUser as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    render(<UserList users={mockUsers} />);
    
    // Iniciar edición
    fireEvent.click(screen.getAllByText('Edit Roles')[0]);
    
    // Guardar cambios
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Verificar que el botón está deshabilitado
    expect(saveButton).toBeDisabled();
    
    // Limpiar el mock para que no afecte a otras pruebas
    await waitFor(() => {
      expect(updateRolesToUser).toHaveBeenCalled();
    });
  });
});