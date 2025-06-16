import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from '../Card';

describe('Card Component', () => {
  test('renders children content', () => {
    const testContent = 'Card content';
    render(<Card>{testContent}</Card>);
    
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  test('has base styling classes', () => {
    const { container } = render(<Card>Test</Card>);
    const cardElement = container.firstChild;
    
    expect(cardElement).toHaveClass('bg-white');
    expect(cardElement).toHaveClass('rounded-lg');
    expect(cardElement).toHaveClass('shadow-md');
    expect(cardElement).toHaveClass('p-6');
  });

  test('applies custom className', () => {
    const customClass = 'custom-class';
    const { container } = render(<Card className={customClass}>Test</Card>);
    const cardElement = container.firstChild;
    
    expect(cardElement).toHaveClass(customClass);
  });

  test('combines base classes with custom classes', () => {
    const customClass = 'mt-4';
    const { container } = render(<Card className={customClass}>Test</Card>);
    const cardElement = container.firstChild;
    
    expect(cardElement).toHaveClass('bg-white');
    expect(cardElement).toHaveClass(customClass);
  });

  test('renders correctly with complex children', () => {
    render(
      <Card>
        <div>
          <h2>Title</h2>
          <p>Description</p>
        </div>
      </Card>
    );
    
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});