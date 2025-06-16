import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert } from '../Alert';

describe('Alert Component', () => {
  test('renders children content', () => {
    const testMessage = 'Test alert message';
    render(<Alert>{testMessage}</Alert>);
    
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('applies error styling by default', () => {
    render(<Alert>Test</Alert>);
    const alertElement = screen.getByText('Test');
    
    expect(alertElement).toHaveClass('bg-red-100');
    expect(alertElement).toHaveClass('text-red-700');
  });

  test('applies success styling when variant is success', () => {
    render(<Alert variant="success">Test</Alert>);
    const alertElement = screen.getByText('Test');
    
    expect(alertElement).toHaveClass('bg-green-100');
    expect(alertElement).toHaveClass('text-green-700');
  });

  test('applies custom className', () => {
    const customClass = 'custom-class';
    render(<Alert className={customClass}>Test</Alert>);
    const alertElement = screen.getByText('Test');
    
    expect(alertElement).toHaveClass(customClass);
  });

  test('has base classes (padding and rounded)', () => {
    render(<Alert>Test</Alert>);
    const alertElement = screen.getByText('Test');
    
    expect(alertElement).toHaveClass('p-3');
    expect(alertElement).toHaveClass('rounded');
  });

  test('combines variant classes with custom classes', () => {
    const customClass = 'mt-4';
    render(
      <Alert variant="success" className={customClass}>
        Test
      </Alert>
    );
    const alertElement = screen.getByText('Test');
    
    expect(alertElement).toHaveClass('bg-green-100');
    expect(alertElement).toHaveClass('text-green-700');
    expect(alertElement).toHaveClass(customClass);
  });
});