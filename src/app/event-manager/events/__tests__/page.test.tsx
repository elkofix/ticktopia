import { render, screen, waitFor } from '@testing-library/react';
import Page from '../page';
import { getEventsByUser } from '../../../../features/events/events.client.api';
import { useAuth } from '../../../../features/auth/hooks/useAuth';
import { notFound } from 'next/navigation';
import { Event } from '@/shared/types/event';
// Mock dependencies
jest.mock('../../../../features/events/events.client.api');
jest.mock('../../../../features/auth/hooks/useAuth');
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock child components
jest.mock('../../../../features/events/components/EventList', () => ({
  EventList: ({ initialEvents }: { initialEvents: any }) => (
    <div data-testid="event-list">
      {initialEvents.map((event: any) => (
        <div key={event.id}>{event.name}</div>
      ))}
    </div>
  ),
}));

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Concert Night',
    bannerPhotoUrl: '/concert.jpg',
    isPublic: true,
    user: {
      id: 'user1',
      email: 'user@example.com',
      name: 'John',
      lastname: 'Doe',
      isActive: true,
      roles: ['event-manager'],
    },
  },
  {
    id: '2',
    name: 'Tech Conference',
    bannerPhotoUrl: '/conference.jpg',
    isPublic: false,
    user: {
      id: 'user1',
      email: 'user@example.com',
      name: 'John',
      lastname: 'Doe',
      isActive: true,
      roles: ['event-manager'],
    },
  },
];

describe('Events Page', () => {
  beforeEach(() => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user1' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (getEventsByUser as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Page />);
    expect(screen.getByText('Cargando eventos...')).toBeInTheDocument();
  });



  it('handles error state', async () => {
    (getEventsByUser as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(<Page />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando eventos...')).not.toBeInTheDocument();
      expect(screen.queryByTestId('event-list')).not.toBeInTheDocument();
    });
  });


  it('does not render when not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    (getEventsByUser as jest.Mock).mockResolvedValue(mockEvents);

    render(<Page />);
    
    await waitFor(() => {
      expect(notFound).not.toHaveBeenCalled();
    });
  });
});