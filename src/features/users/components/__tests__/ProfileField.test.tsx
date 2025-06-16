import { render, screen } from '@testing-library/react';
import { ProfileField } from '../ProfileField';

describe('ProfileField', () => {
  it('renders the label and value correctly', () => {
    const testLabel = 'Nombre';
    const testValue = 'John Doe';
    
    render(<ProfileField label={testLabel} value={testValue} />);
    
    // Verifica que el label se renderice correctamente
    const labelElement = screen.getByText(testLabel);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700');
    
    // Verifica que el valor se renderice correctamente
    const valueElement = screen.getByText(testValue);
    expect(valueElement).toBeInTheDocument();
    expect(valueElement).toHaveClass('mt-1', 'text-gray-900');
  });

  it('renders empty value correctly', () => {
    const testLabel = 'Email';
    
    render(<ProfileField label={testLabel} value="" />);
    
    // Verifica que el componente maneje valores vacíos
    const valueElement = screen.getByTestId('profile-field-value');
    expect(valueElement).toBeInTheDocument();
    expect(valueElement).toHaveTextContent('');
  });

  it('renders with correct HTML structure', () => {
    render(<ProfileField label="Test" value="Value" />);
    
    const container = screen.getByTestId('profile-field-container');
    expect(container).toBeInTheDocument();
    expect(container.tagName).toBe('DIV');
    
    // Verifica la jerarquía de elementos
    const label = screen.getByTestId('profile-field-label');
    const value = screen.getByTestId('profile-field-value');
    
    expect(container).toContainElement(label);
    expect(container).toContainElement(value);
    expect(label.nextSibling).toBe(value);
  });

  it('applies correct classes to elements', () => {
    render(<ProfileField label="Test" value="Value" />);
    
    const label = screen.getByTestId('profile-field-label');
    const value = screen.getByTestId('profile-field-value');
    
    expect(label).toHaveClass(
      'block',
      'text-sm',
      'font-medium',
      'text-gray-700'
    );
    
    expect(value).toHaveClass(
      'mt-1',
      'text-gray-900'
    );
  });
});