import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmptyPresentationsState from '../EmptyPresentationState';

describe('EmptyPresentationsState', () => {
  it('renders the empty state correctly', () => {
    render(<EmptyPresentationsState />);

    // Check main container
    const container = screen.getByTestId('empty-presentations-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('text-center');
    expect(container).toHaveClass('py-12');

    // Check icon container
    const iconContainer = screen.getByTestId('icon-container');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('w-16');
    expect(iconContainer).toHaveClass('h-16');
    expect(iconContainer).toHaveClass('bg-gray-100');
    expect(iconContainer).toHaveClass('rounded-full');
    expect(iconContainer).toHaveClass('flex');
    expect(iconContainer).toHaveClass('items-center');
    expect(iconContainer).toHaveClass('justify-center');
    expect(iconContainer).toHaveClass('mx-auto');
    expect(iconContainer).toHaveClass('mb-4');

    // Check SVG icon
    const svgIcon = screen.getByTestId('calendar-icon');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveClass('w-8');
    expect(svgIcon).toHaveClass('h-8');
    expect(svgIcon).toHaveClass('text-gray-400');

    // Check title
    const title = screen.getByText('No hay presentaciones disponibles');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-lg');
    expect(title).toHaveClass('font-medium');
    expect(title).toHaveClass('text-gray-900');
    expect(title).toHaveClass('mb-2');

    // Check description
    const description = screen.getByText(/Las presentaciones aparecerán aquí/i);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-gray-500');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<EmptyPresentationsState />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('has the correct SVG path', () => {
    render(<EmptyPresentationsState />);
    const pathElement = screen.getByTestId('calendar-icon-path');
    expect(pathElement).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElement).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElement).toHaveAttribute('stroke-width', '2');
    expect(pathElement).toHaveAttribute('d', 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v14a1 1 0 01-1 1H8a1 1 0 01-1-1V4z');
  });
});