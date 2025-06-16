import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventListEmptyState } from '../EventListEmptyState'; // Adjust the import path as needed

describe('EventListEmptyState', () => {
  it('renders correctly', () => {
    render(<EventListEmptyState />);
    
    // Check the main container
    const container = screen.getByRole('status');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('text-center', 'py-12');
    
    // Check the icon container
    const iconContainer = screen.getByTestId('icon-container');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('w-24', 'h-24', 'bg-gray-100', 'rounded-full', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-4');
    
    // Check the SVG icon
    const svgIcon = screen.getByTestId('calendar-icon');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveClass('w-12', 'h-12', 'text-gray-400');
    
    // Check the heading
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('No hay eventos disponibles');
    expect(heading).toHaveClass('text-lg', 'font-medium', 'text-gray-900', 'mb-2');
    
    // Check the description text
    const description = screen.getByText('Vuelve más tarde para ver nuevos eventos');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-gray-500');
  });

  it('displays the correct icon', () => {
    render(<EventListEmptyState />);
    
    const svgPaths = screen.getByTestId('calendar-icon').querySelectorAll('path');
    expect(svgPaths).toHaveLength(1);
    expect(svgPaths[0]).toHaveAttribute('d', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z');

  });
});