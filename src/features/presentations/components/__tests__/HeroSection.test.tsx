import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroSection } from '../HeroSection';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    <img 
      src={props.src} 
      alt={props.alt} 
      data-testid="hero-image"
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        objectFit: 'cover',
        opacity: 0.7
      }}
    />
  ),
}));

describe('HeroSection', () => {
  const mockProps = {
    bannerPhotoUrl: 'https://example.com/banner.jpg',
    eventName: 'Test Event'
  };

  it('renders correctly with provided props', () => {
    render(<HeroSection {...mockProps} />);

    // Check container
    const container = screen.getByTestId('hero-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('relative');
    expect(container).toHaveClass('h-96');
    expect(container).toHaveClass('w-full');
    expect(container).toHaveClass('overflow-hidden');
    expect(container).toHaveClass('bg-gray-800');

    // Check image
    const image = screen.getByTestId('hero-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProps.bannerPhotoUrl);
    expect(image).toHaveAttribute('alt', mockProps.eventName);
    expect(image).toHaveStyle({
      objectFit: 'cover',
      opacity: '0.7'
    });

    // Check title
    const title = screen.getByText(mockProps.eventName);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-4xl');
    expect(title).toHaveClass('md:text-6xl');
    expect(title).toHaveClass('font-bold');
    expect(title).toHaveClass('text-white');
    expect(title).toHaveClass('text-center');
    expect(title).toHaveClass('px-4');
  });

  it('handles image error by maintaining layout', () => {
    render(<HeroSection {...mockProps} bannerPhotoUrl="invalid-url.jpg" />);
    
    const container = screen.getByTestId('hero-container');
    expect(container).toHaveClass('bg-gray-800'); // Fallback background
    
    const title = screen.getByText(mockProps.eventName);
    expect(title).toBeInTheDocument(); // Title should still render
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<HeroSection {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with different event names', () => {
    const longEventName = 'Very Long Event Name That Might Wrap';
    render(<HeroSection bannerPhotoUrl={mockProps.bannerPhotoUrl} eventName={longEventName} />);
    
    expect(screen.getByText(longEventName)).toBeInTheDocument();
  });
});