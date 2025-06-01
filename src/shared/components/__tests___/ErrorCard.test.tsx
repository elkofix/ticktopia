import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlertTriangle } from 'lucide-react';
import ErrorCard from '../ErrorCard';

// Mock del icono de Lucide para simplificar las pruebas
jest.mock('lucide-react', () => ({
  AlertTriangle: () => <svg data-testid="alert-triangle-icon"></svg>,
}));

describe('ErrorCard', () => {


  it('renderiza correctamente con props personalizadas', () => {
    const customTitle = 'Error personalizado';
    const customMessage = 'Este es un mensaje de error específico';
    
    render(<ErrorCard title={customTitle} message={customMessage} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });



});