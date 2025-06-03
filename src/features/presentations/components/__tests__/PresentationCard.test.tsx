import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PresentationCard from '../PresentationCard';
import { formateDate } from '../../../../shared/utils/dates';
import '@testing-library/jest-dom';
import { Presentation } from '@/shared/types/presentation';

// Mock next/image and next/link
jest.mock('next/image', () => {
  const MockNextImage = (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  };
  MockNextImage.displayName = 'MockNextImage';

  return {
    __esModule: true,
    default: MockNextImage,
  };
});


jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockNextLink';
  return MockLink;
});

// Mock the date formatter
jest.mock('../../../../shared/utils/dates', () => ({
  formateDate: jest.fn((date) => `Formatted: ${date}`),
}));

describe('PresentationCard', () => {
  const mockPresentation: Presentation = {
    idPresentation: 'pres-123',
    place: 'Main Hall',
    event: {
      id: 'event-123',
      name: 'Test Event',
      bannerPhotoUrl: '/event-banner.jpg',
      isPublic: true,
      user: {
        id: 'user-123',
        email: 'organizer@test.com',
        name: 'Organizer',
        lastname: 'Test',
        isActive: true,
        roles: ['event-manager']
      }
    },
    capacity: 100,
    price: 50,
    openDate: '2023-01-01T18:00:00Z',
    startDate: '2023-01-01T20:00:00Z',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'This is a test presentation description that might be long.',
    ticketAvailabilityDate: '2022-12-01T00:00:00Z',
    ticketSaleAvailabilityDate: '2022-11-01T00:00:00Z',
    city: 'New York'
  };

  const mockProps = {
    presentation: mockPresentation,
    bannerPhotoUrl: '/banner.jpg',
    name: 'Test Presentation'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<PresentationCard {...mockProps} />);

    // Check container
    const container = screen.getByTestId('presentation-card');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('group');
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('md:flex-row');

    // Check image
    const image = screen.getByTestId('presentation-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProps.bannerPhotoUrl);
    expect(image).toHaveAttribute('alt', mockProps.name);

    // Check title
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
  });

  it('handles image error', () => {
    render(<PresentationCard {...mockProps} />);
    
    const image = screen.getByTestId('presentation-image');
    fireEvent.error(image);
    
    expect(image).toHaveAttribute('src', '/placeholder-presentation.jpg');
  });

  it('renders without description when not provided', () => {
    const presentationWithoutDesc = {
      ...mockPresentation,
      description: ''
    };
    
    render(<PresentationCard {...mockProps} presentation={presentationWithoutDesc} />);
    
    expect(screen.queryByTestId('presentation-description')).not.toBeInTheDocument();
  });

  it('applies hover styles', () => {
    render(<PresentationCard {...mockProps} />);
    
    const container = screen.getByTestId('presentation-card');
    expect(container).toHaveClass('hover:shadow-md');
    expect(container).toHaveClass('hover:bg-gray-100');
    
    const image = screen.getByTestId('presentation-image');
    expect(image).toHaveClass('group-hover:scale-105');
    
    const title = screen.getByText(mockProps.name);
    expect(title).toHaveClass('group-hover:text-brand');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<PresentationCard {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('has correct responsive classes', () => {
    render(<PresentationCard {...mockProps} />);
    
    const container = screen.getByTestId('presentation-card');
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('md:flex-row');
    
    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toHaveClass('w-full');
    expect(imageContainer).toHaveClass('md:w-48');
    expect(imageContainer).toHaveClass('lg:w-56');
  });
});