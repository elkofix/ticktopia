import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { getAllMyTickets } from '../../../../features/tickets/ticket.api';
import { Ticket } from '@/shared/types/ticket';
import MyTicketsPage from '../page';

jest.mock('../../../../features/tickets/ticket.api', () => ({
  getAllMyTickets: jest.fn(),
}));

// Mock the child components (same as in HistoricTicketsPage tests)
jest.mock('../../../../features/tickets/components/TicketList', () => {
  return function MockTicketList({ tickets, historic }: { tickets: Ticket[], historic: boolean }) {
    return <div data-testid="ticket-list">{tickets.length} tickets, historic: {historic.toString()}</div>;
  };
});

jest.mock('../../../../shared/components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

jest.mock('../../../../shared/components/ErrorHandler', () => {
  return function MockErrorHandler({ message }: { message: string }) {
    return <div data-testid="error-handler">{message}</div>;
  };
});

describe('MyTicketsPage', () => {
  const mockTickets: Ticket[] = [
    {
      id: '1',
      buyDate: '2023-01-01',
      isRedeemed: false,
      isActive: true,
      quantity: 2,
      user: {
        id: 'user1',
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        isActive: true,
        roles: ['client'],
      },
      presentation: {
        idPresentation: 'p1',
        place: 'Venue 1',
        event: {
          id: 'e1',
          name: 'Event 1',
          bannerPhotoUrl: 'http://example.com/event1.jpg',
          isPublic: true,
          user: {
            id: 'user2',
            email: 'organizer@example.com',
            name: 'Organizer',
            lastname: 'User',
            isActive: true,
            roles: ['event-manager'],
          },
        },
        capacity: 100,
        price: 50,
        openDate: '2023-01-01',
        startDate: '2023-01-02',
        latitude: 0,
        longitude: 0,
        description: 'Event description',
        ticketAvailabilityDate: '2023-01-01',
        ticketSaleAvailabilityDate: '2023-01-01',
        city: 'New York',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading spinner while fetching data', () => {
    (getAllMyTickets as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<MyTicketsPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display tickets after successful fetch', async () => {
    (getAllMyTickets as jest.Mock).mockResolvedValue(mockTickets);

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('ticket-list')).toBeInTheDocument();
      expect(screen.getByTestId('ticket-list')).toHaveTextContent('1 tickets, historic: false');
    });
  });

  it('should display error message from response when fetch fails', async () => {
    const errorMessage = 'Failed to fetch tickets';
    (getAllMyTickets as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-handler')).toBeInTheDocument();
      expect(screen.getByTestId('error-handler')).toHaveTextContent(errorMessage);
    });
  });

  it('should display error message from error object when response is not available', async () => {
    const errorMessage = 'Network error';
    (getAllMyTickets as jest.Mock).mockRejectedValue({
      message: errorMessage
    });

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-handler')).toBeInTheDocument();
      expect(screen.getByTestId('error-handler')).toHaveTextContent(errorMessage);
    });
  });

  it('should display default error message when error structure is unexpected', async () => {
    (getAllMyTickets as jest.Mock).mockRejectedValue({});

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-handler')).toBeInTheDocument();
      expect(screen.getByTestId('error-handler')).toHaveTextContent(
        'Error al cargar tus tickets'
      );
    });
  });

  it('should pass historic prop as false to TicketsList', async () => {
    (getAllMyTickets as jest.Mock).mockResolvedValue(mockTickets);

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('ticket-list')).toHaveTextContent('historic: false');
    });
  });
});