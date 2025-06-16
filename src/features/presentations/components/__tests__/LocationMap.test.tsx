import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LocationMap } from '../LocationMap';

describe('LocationMap', () => {
  const mockCoords = {
    latitude: 40.7128,
    longitude: -74.0060
  };

  it('renders correctly with provided coordinates', () => {
    render(<LocationMap {...mockCoords} />);

    // Check container
    const container = screen.getByTestId('location-map-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('bg-white');
    expect(container).toHaveClass('p-6');
    expect(container).toHaveClass('rounded-xl');
    expect(container).toHaveClass('shadow-md');
    expect(container).toHaveClass('mb-12');

    // Check title
    const title = screen.getByText('Ubicación');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl');
    expect(title).toHaveClass('font-bold');
    expect(title).toHaveClass('text-gray-900');
    expect(title).toHaveClass('mb-4');

    // Check map container
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
    expect(mapContainer).toHaveClass('h-96');
    expect(mapContainer).toHaveClass('w-full');
    expect(mapContainer).toHaveClass('rounded-lg');
    expect(mapContainer).toHaveClass('overflow-hidden');

    // Check iframe
    const iframe = screen.getByTitle('Ubicación del evento');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('width', '100%');
    expect(iframe).toHaveAttribute('height', '100%');
    expect(iframe).toHaveAttribute(
      'src',
      `https://maps.google.com/maps?q=${mockCoords.latitude},${mockCoords.longitude}&z=15&output=embed`
    );
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<LocationMap {...mockCoords} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('handles different coordinate values', () => {
    const newCoords = {
      latitude: 34.0522,
      longitude: -118.2437
    };
    render(<LocationMap {...newCoords} />);

    const iframe = screen.getByTitle('Ubicación del evento');
    expect(iframe).toHaveAttribute(
      'src',
      `https://maps.google.com/maps?q=${newCoords.latitude},${newCoords.longitude}&z=15&output=embed`
    );
  });

  it('renders with invalid coordinates', () => {
    const invalidCoords = {
      latitude: NaN,
      longitude: NaN
    };
    render(<LocationMap {...invalidCoords} />);

    const iframe = screen.getByTitle('Ubicación del evento');
    expect(iframe).toHaveAttribute(
      'src',
      'https://maps.google.com/maps?q=NaN,NaN&z=15&output=embed'
    );
  });
});