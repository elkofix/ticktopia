import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventListLoading } from '../EventListLoading'; // Adjust the import path as needed

describe('EventListLoading', () => {
  it('renders correctly', () => {
    render(<EventListLoading />);
    
    // Check the main container
    const container = screen.getByRole('status');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex', 'justify-center', 'mb-8');
    
    // Check the spinner element
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-8',
      'w-8',
      'border-b-2',
      'border-brand'
    );
  });

  it('has the correct spinner attributes', () => {
    render(<EventListLoading />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    expect(spinner).toHaveAttribute('aria-busy', 'true');
  });
});