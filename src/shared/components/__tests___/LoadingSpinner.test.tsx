import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renderiza correctamente el spinner', () => {
    render(<LoadingSpinner />);
    
    // Verifica que el contenedor principal existe con el rol correcto
    const container = screen.getByRole('status');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex', 'justify-center', 'items-center', 'py-8');
    
    // Verifica que el spinner existe
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-12',
      'w-12',
      'border-t-2',
      'border-b-2',
      'border-blue-500'
    );
  });

  it('tiene las propiedades de accesibilidad adecuadas', () => {
    render(<LoadingSpinner />);
    
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-busy', 'true');
  });
});