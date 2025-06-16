import { render, screen } from '@testing-library/react';
import EventDetailBanner from '../EventDetailBanner';
import { Event } from '@/shared/types/event';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('EventDetailBanner', () => {
  const mockEvent: Event = {
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
  };

  it('renders the event banner with all information', () => {
    render(<EventDetailBanner event={mockEvent} />);

    // Check banner image
    const bannerImage = screen.getByTestId('event-banner-image');
    expect(bannerImage).toBeInTheDocument();
    expect(bannerImage).toHaveAttribute('src', mockEvent.bannerPhotoUrl);
    expect(bannerImage).toHaveAttribute('alt', mockEvent.name);

    // Check dark overlay
    expect(screen.getByTestId('banner-overlay')).toBeInTheDocument();

    // Check status badge
    const statusBadge = screen.getByTestId('event-status-badge');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Público');
    expect(statusBadge).toHaveClass('bg-green-500');

    // Check event title
    expect(screen.getByTestId('event-title')).toHaveTextContent(mockEvent.name);

    // Check organizer info
    expect(screen.getByTestId('organizer-avatar')).toHaveTextContent('J');
    expect(screen.getByTestId('organizer-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('organizer-label')).toHaveTextContent('Organizador');
  });

  it('shows private badge when event is not public', () => {
    const privateEvent = { ...mockEvent, isPublic: false };
    render(<EventDetailBanner event={privateEvent} />);

    const statusBadge = screen.getByTestId('event-status-badge');
    expect(statusBadge).toHaveTextContent('Privado');
    expect(statusBadge).toHaveClass('bg-gray-500');
  });


  it('renders the first letter of organizer name in uppercase', () => {
    const eventWithLowercaseName = {
      ...mockEvent,
      user: { ...mockEvent.user, name: 'john' }
    };
    render(<EventDetailBanner event={eventWithLowercaseName} />);

    expect(screen.getByTestId('organizer-avatar')).toHaveTextContent('J');
  });
});