import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileEditForm } from '../ProfileEditForm';

jest.mock('../../../../shared/components/Button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  )
}));

jest.mock('../../../../shared/components/Input', () => ({
  Input: ({ label, id, ...props }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  )
}));

describe('ProfileEditForm', () => {
  const mockFormData = {
    name: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com'
  };

  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn((e) => e.preventDefault());
  const mockOnCancel = jest.fn();

  const defaultProps = {
    formData: mockFormData,
    onChange: mockOnChange,
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields with correct initial values', () => {
    render(<ProfileEditForm {...defaultProps} />);
    
    expect(screen.getByLabelText('Nombre')).toHaveValue('John');
    expect(screen.getByLabelText('Apellido')).toHaveValue('Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john.doe@example.com');
  });

  it('calls onChange when input values change', () => {
    render(<ProfileEditForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('Nombre');
    fireEvent.change(nameInput, { target: { value: 'Jane', name: 'name' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ProfileEditForm {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('disables submit button and shows loading text when isLoading is true', () => {
    render(<ProfileEditForm {...defaultProps} isLoading={true} />);
    
    const submitButton = screen.getByText('Guardando...');
    expect(submitButton).toBeDisabled();
    expect(screen.queryByText('Guardar Cambios')).not.toBeInTheDocument();
  });

  it('enables submit button and shows normal text when isLoading is false', () => {
    render(<ProfileEditForm {...defaultProps} isLoading={false} />);
    
    const submitButton = screen.getByText('Guardar Cambios');
    expect(submitButton).not.toBeDisabled();
    expect(screen.queryByText('Guardando...')).not.toBeInTheDocument();
  });

  it('marks all fields as required', () => {
    render(<ProfileEditForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('Nombre');
    const lastnameInput = screen.getByLabelText('Apellido');
    const emailInput = screen.getByLabelText('Email');
    
    expect(nameInput).toBeRequired();
    expect(lastnameInput).toBeRequired();
    expect(emailInput).toBeRequired();
  });

  it('sets correct input types', () => {
    render(<ProfileEditForm {...defaultProps} />);
    
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
  });
});