import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Presentation } from '@/shared/types/presentation';
import EventPresentationsList from '../EventPresentationList';

jest.mock('../../../../features/presentations/components/EmptyPresentationState', () => {
  const EmptyPresentationState = () => (
    <div data-testid="empty-state">Empty State</div>
  );
  EmptyPresentationState.displayName = 'MockEmptyPresentationState';
  return EmptyPresentationState;
});

jest.mock('../../../../features/presentations/components/PresentationCard', () => {
  const PresentationCard = ({ presentation }: any) => (
    <div data-testid="presentation-card">{presentation.idPresentation}</div>
  );
  PresentationCard.displayName = 'MockPresentationCard';
  return PresentationCard;
});

describe('EventPresentationsList', () => {
  const mockPresentations: Presentation[] = [
    {
      idPresentation: '1',
      place: 'Venue 1',
      event: {
        id: 'event1',
        name: 'Event 1',
        bannerPhotoUrl: 'banner1.jpg',
        isPublic: true,
        user: {
          id: 'user1',
          email: 'user@test.com',
          name: 'Test',
          lastname: 'User',
          isActive: true,
          roles: ['admin'],
        },
      },
      capacity: 100,
      price: 50,
      openDate: '2023-01-01',
      startDate: '2023-01-02',
      latitude: 0,
      longitude: 0,
      description: 'Test description',
      ticketAvailabilityDate: '2023-01-01',
      ticketSaleAvailabilityDate: '2023-01-01',
      city: 'Test City',
    },
    {
      idPresentation: '2',
      place: 'Venue 2',
      event: {
        id: 'event1',
        name: 'Event 1',
        bannerPhotoUrl: 'banner1.jpg',
        isPublic: true,
        user: {
          id: 'user1',
          email: 'user@test.com',
          name: 'Test',
          lastname: 'User',
          isActive: true,
          roles: ['admin'],
        },
      },
      capacity: 200,
      price: 75,
      openDate: '2023-02-01',
      startDate: '2023-02-02',
      latitude: 0,
      longitude: 0,
      description: 'Test description 2',
      ticketAvailabilityDate: '2023-02-01',
      ticketSaleAvailabilityDate: '2023-02-01',
      city: 'Test City 2',
    },
  ];

  const mockProps = {
    presentations: mockPresentations,
    bannerPhotoUrl: 'test-banner.jpg',
    name: 'Test Event',
  };

  it('renders the container with correct classes', () => {
    render(<EventPresentationsList {...mockProps} />);
    
    const container = screen.getByTestId('presentations-container');
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8');
    
    const innerContainer = screen.getByTestId('presentations-inner-container');
    expect(innerContainer).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'sm:p-8');
  });

  it('displays the correct header with title and count', () => {
    render(<EventPresentationsList {...mockProps} />);
    
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Presentaciones');
    expect(screen.getByText(`${mockPresentations.length} presentaciones`)).toBeInTheDocument();
  });

  it('shows singular "presentación" when only one presentation exists', () => {
    const singlePresentationProps = {
      ...mockProps,
      presentations: [mockPresentations[0]],
    };
    render(<EventPresentationsList {...singlePresentationProps} />);
    
    expect(screen.getByText('1 presentación')).toBeInTheDocument();
  });

  it('renders PresentationCard for each presentation', () => {
    render(<EventPresentationsList {...mockProps} />);
    
    const cards = screen.getAllByTestId('presentation-card');
    expect(cards).toHaveLength(mockPresentations.length);
    
    mockPresentations.forEach((presentation) => {
      expect(screen.getByText(presentation.idPresentation)).toBeInTheDocument();
    });
  });


  it('passes correct props to PresentationCard', () => {
    render(<EventPresentationsList {...mockProps} />);
    
    // Since we mocked PresentationCard, we can check if it received the right props
    // by verifying the rendered output of our mock
    mockPresentations.forEach((presentation) => {
      expect(screen.getByText(presentation.idPresentation)).toBeInTheDocument();
    });
  });
});