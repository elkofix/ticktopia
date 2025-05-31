import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../Input';

describe('Input Component', () => {
  test('renders correctly with required props', () => {
    render(<Input label="Test Label" id="test-input" />);
    
    // Verifica que el label se renderice correctamente
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-input');
    
    // Verifica que el input se renderice correctamente
    const input = screen.getByLabelText('Test Label');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'test-input');
  });

  test('applies custom className correctly', () => {
    render(
      <Input 
        label="Test Label" 
        id="test-input" 
        className="custom-class" 
      />
    );
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('custom-class');
    // Verifica que las clases base siguen presentes
    expect(input).toHaveClass('mt-1');
    expect(input).toHaveClass('block');
    expect(input).toHaveClass('w-full');
  });

  test('passes additional input props correctly', () => {
    render(
      <Input 
        label="Test Label" 
        id="test-input" 
        type="email"
        placeholder="Enter email"
        required
      />
    );
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toBeRequired();
  });

  test('applies default styling classes', () => {
    render(<Input label="Test Label" id="test-input" />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-gray-300');
    expect(input).toHaveClass('rounded-md');
    expect(input).toHaveClass('shadow-sm');
    expect(input).toHaveClass('py-2');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('focus:ring-indigo-500');
    expect(input).toHaveClass('focus:border-indigo-500');
  });

});