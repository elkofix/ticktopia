import React from 'react';
import { render, screen } from '@testing-library/react';
import EventSidebar from '../EventSidebar';
import '@testing-library/jest-dom';

// Mock next/image since it's not compatible with Jest by default
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('EventSidebar', () => {
  const mockProps = {
    event: {
      name: 'Test Event',
      bannerPhotoUrl: '/test-banner.jpg',
    },
    place: 'Test Venue',
    city: 'Test City',
    startDate: '2023-12-31T20:00:00',
  };

  it('renders correctly with all props', () => {
    render(<EventSidebar {...mockProps} />);
    
    // Check sticky positioning
    const container = screen.getByTestId('event-sidebar');
    expect(container).toHaveClass('sticky', 'top-8');
    
    // Check image rendering
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProps.event.bannerPhotoUrl);
    expect(image).toHaveAttribute('alt', mockProps.event.name);
    
    // Check event name
    expect(screen.getByText(mockProps.event.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.event.name)).toHaveClass('text-xl', 'font-bold');
    
    // Check place
    expect(screen.getByText('Lugar')).toBeInTheDocument();
    expect(screen.getByText(mockProps.place)).toBeInTheDocument();
    
    // Check city
    expect(screen.getByText('Ciudad')).toBeInTheDocument();
    expect(screen.getByText(mockProps.city)).toBeInTheDocument();
    
    // Check date
    expect(screen.getByText('Fecha y Hora')).toBeInTheDocument();
    expect(screen.getByText(mockProps.startDate)).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<EventSidebar {...mockProps} />);
    
    const card = screen.getByTestId('event-card');
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg', 'border-4', 'border-white');
    
    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toHaveClass('relative', 'w-full', 'h-48');
    
    const contentSection = screen.getByTestId('content-section');
    expect(contentSection).toHaveClass('p-6');
  });

  it('applies the negative margin to the card', () => {
    render(<EventSidebar {...mockProps} />);
    
    const card = screen.getByTestId('event-card');
    expect(card).toHaveStyle('marginTop: -2rem');
  });
});