import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileView } from '../ProfileView';
// Mock de los componentes hijos para un testing más enfocado
jest.mock('../ProfileField', () => ({
  ProfileField: ({ label, value }: { label: string; value: string }) => (
    <div data-testid={`profile-field-${label.toLowerCase()}`}>
      {label}: {value}
    </div>
  )
}));

jest.mock('../../../../shared/components/Button', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button 
      data-testid={`button-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}));

describe('ProfileView', () => {
  const mockUser = {
    name: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com'
  };

  const mockOnEdit = jest.fn();
  const mockOnOpenModal = jest.fn();

  const defaultProps = {
    user: mockUser,
    onEdit: mockOnEdit,
    onOpenModal: mockOnOpenModal
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all user information correctly', () => {
    render(<ProfileView {...defaultProps} />);
    
    expect(screen.getByTestId('profile-field-nombre')).toHaveTextContent('Nombre: John');
    expect(screen.getByTestId('profile-field-apellido')).toHaveTextContent('Apellido: Doe');
    expect(screen.getByTestId('profile-field-email')).toHaveTextContent('Email: john.doe@example.com');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<ProfileView {...defaultProps} />);
    
    const editButton = screen.getByTestId('button-primary');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenModal when close account button is clicked', () => {
    render(<ProfileView {...defaultProps} />);
    
    const closeAccountButton = screen.getByTestId('button-danger');
    fireEvent.click(closeAccountButton);
    
    expect(mockOnOpenModal).toHaveBeenCalledTimes(1);
  });

  it('renders both action buttons', () => {
    render(<ProfileView {...defaultProps} />);
    
    expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Cuenta')).toBeInTheDocument();
  });

  it('applies correct spacing classes', () => {
    const { container } = render(<ProfileView {...defaultProps} />);
    
    // Verifica las clases de espaciado
    expect(container.firstChild).toHaveClass('space-y-6');
    const buttonsContainer = screen.getByText('Editar Perfil').parentElement;
    expect(buttonsContainer).toHaveClass('flex', 'space-x-4', 'pt-4');
  });

  it('matches snapshot with default props', () => {
    const { asFragment } = render(<ProfileView {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});