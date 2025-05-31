import { render, screen, fireEvent } from '@testing-library/react';
import { LogOut } from 'lucide-react';
import { LogoutButton } from '../LogoutButton';

describe('LogoutButton', () => {
  it('should call onClick when button is clicked', () => {
    const mockOnClick = jest.fn();
    render(<LogoutButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should have the correct styling classes', () => {
    const mockOnClick = jest.fn();
    render(<LogoutButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    
    // Verificar algunas clases clave
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('rounded-lg');
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('hover:bg-gray-100');
  });


});