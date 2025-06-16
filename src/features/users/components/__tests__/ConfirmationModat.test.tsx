import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationModal } from '../ConfirmationModal';

describe('ConfirmationModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when isOpen is true', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    expect(screen.getByText('¿Estás seguro de que quieres cerrar tu cuenta?')).toBeInTheDocument();
    expect(screen.getByText('Esta acción es irreversible. Todos tus datos serán eliminados permanentemente y no podrás recuperarlos.')).toBeInTheDocument();
    expect(screen.getByText('Sí, cerrar mi cuenta')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('¿Estás seguro de que quieres cerrar tu cuenta?')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking the cancel button', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when clicking the confirm button', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Sí, cerrar mi cuenta'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables the confirm button when isLoading is true', () => {
    render(<ConfirmationModal {...defaultProps} isLoading={true} />);
    
    const confirmButton = screen.getByText('Procesando...');
    expect(confirmButton).toBeDisabled();
  });

  it('shows loading text when isLoading is true', () => {
    render(<ConfirmationModal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Procesando...')).toBeInTheDocument();
    expect(screen.queryByText('Sí, cerrar mi cuenta')).not.toBeInTheDocument();
  });

});