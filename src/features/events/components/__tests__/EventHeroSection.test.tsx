import { render, screen, fireEvent, act } from '@testing-library/react';
import { Event } from '@/shared/types/event';
import { useRouter } from 'next/navigation';
import EventsHeroSection from '../EventHeroSection';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('EventsHeroSection', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      name: 'Tech Conference 2023',
      bannerPhotoUrl: '/tech-conf.jpg',
      isPublic: true,
      user: {
        id: 'user1',
        email: 'john@example.com',
        name: 'John',
        lastname: 'Doe',
        isActive: true,
        roles: ['event-manager'],
      },
    },
    {
      id: '2',
      name: 'Music Festival 2023',
      bannerPhotoUrl: '/music-fest.jpg',
      isPublic: true,
      user: {
        id: 'user2',
        email: 'jane@example.com',
        name: 'Jane',
        lastname: 'Smith',
        isActive: true,
        roles: ['event-manager'],
      },
    },
  ];

  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders nothing when no events are provided', () => {
    const { container } = render(<EventsHeroSection events={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('displays the first event by default', () => {
    render(<EventsHeroSection events={mockEvents} />);
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('event-title')).toHaveTextContent('Tech Conference 2023');
    expect(screen.getByTestId('event-organizer')).toHaveTextContent('Organizado por John');
    expect(screen.getByTestId('view-event-button')).toBeInTheDocument();
  });

  it('changes event after interval', () => {
    jest.useFakeTimers();
    render(<EventsHeroSection events={mockEvents} />);
    
    // First event should be visible initially
    expect(screen.getByTestId('event-title')).toHaveTextContent('Tech Conference 2023');
    
    // Advance timers by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Second event should be visible
    expect(screen.getByTestId('event-title')).toHaveTextContent('Music Festival 2023');
  });

  it('navigates to event page when button is clicked', () => {
    render(<EventsHeroSection events={mockEvents} />);
    
    const button = screen.getByTestId('view-event-button');
    fireEvent.click(button);
    
    expect(mockPush).toHaveBeenCalledWith('/event/1');
  });

  it('displays fallback organizer name when not provided', () => {
    const eventsWithMissingName = [
      {
        ...mockEvents[0],
        user: { ...mockEvents[0].user, name: '' }
      }
    ];
    render(<EventsHeroSection events={eventsWithMissingName} />);
    
    expect(screen.getByTestId('event-organizer')).toHaveTextContent('Organizado por Usuario');
  });

  it('applies correct background image', () => {
    render(<EventsHeroSection events={mockEvents} />);
    
    const banner = screen.getByTestId('event-banner');
    expect(banner).toHaveStyle(`backgroundImage: url(${mockEvents[0].bannerPhotoUrl})`);
  });
});