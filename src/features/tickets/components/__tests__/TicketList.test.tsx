import React, { FC } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QrCode } from 'lucide-react';
import { Ticket } from '@/shared/types/ticket';
import TicketsList from '../TicketList';
import { User } from '@/shared/types/event';

// Mock the external components and icons
jest.mock('qrcode.react', () => {
  const QRCodeSVG = jest.fn(() => <div data-testid="qr-code" />) as unknown as FC;
  QRCodeSVG.displayName = 'MockQRCodeSVG';

  return {
    QRCodeSVG,
  };
});

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
jest.mock('lucide-react', () => {
    const QrCode = jest.fn(() => <svg data-testid="qr-icon" />) as unknown as FC;
    QrCode.displayName = 'MockLucideQrCode';

    return {
        QrCode,
    };
});



describe('TicketsList Component', () => {
    const mockUser: User = {
        id: 'user-1',
        lastname: 'User',
        name: 'Test User',
        email: 'test@example.com',
        isActive: true,
        roles: ['client'],
    };

    const mockTickets: Ticket[] = [
        {
            id: 'ticket-1234567890',
            buyDate: '2023-10-15T12:00:00Z',
            quantity: 2,
            isActive: true,
            isRedeemed: false,
            presentation: {
                idPresentation: 'presentation-1',
                place: 'Main Hall',
                capacity: 1000,
                price: 50,
                openDate: '2023-12-20T18:00:00Z',
                startDate: '2023-12-20T20:00:00Z',
                latitude: 40.4168,
                longitude: -3.7038,
                description: 'Example concert description',
                ticketAvailabilityDate: '2023-12-10T00:00:00Z',
                ticketSaleAvailabilityDate: '2023-10-01T00:00:00Z',
                city: 'Madrid',
                event: {
                    id: 'event-1',
                    name: 'Concierto de Ejemplo',
                    bannerPhotoUrl: '/example-banner.jpg',
                    isPublic: true,
                    user: mockUser,
                },
            },
            user: mockUser,
        },
        {
            user: mockUser,
            id: 'ticket-9876543210',
            buyDate: '2023-09-01T10:30:00Z',
            quantity: 1,
            isActive: false,
            isRedeemed: true,
            presentation: {
                idPresentation: 'presentation-2',
                place: 'City Theater',
                capacity: 500,
                price: 75,
                openDate: '2023-11-15T17:30:00Z',
                startDate: '2023-11-15T19:30:00Z',
                latitude: 41.3851,
                longitude: 2.1734,
                description: 'Classic theater performance',
                ticketAvailabilityDate: '2023-11-05T00:00:00Z',
                ticketSaleAvailabilityDate: '2023-08-01T00:00:00Z',
                city: 'Barcelona',
                event: {
                    id: 'event-2',
                    name: 'Teatro Clásico',
                    bannerPhotoUrl: '/theater-banner.jpg',
                    isPublic: false,
                    user: mockUser,
                },
            },
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with historic tickets', () => {
        render(<TicketsList tickets={mockTickets} historic={true} />);

        expect(screen.getByText('Historial de Tickets')).toBeInTheDocument();
        expect(screen.getByText('Este es tu historial de compras y eventos a los cuales has asistido.')).toBeInTheDocument();

        // Check if tickets are rendered
        expect(screen.getAllByTestId('ticket-item')).toHaveLength(mockTickets.length);

        // Check that QR code button is not shown for historic tickets
        expect(screen.queryByTestId('qr-icon')).not.toBeInTheDocument();
    });

    it('renders correctly with upcoming tickets', () => {
        render(<TicketsList tickets={mockTickets} historic={false} />);

        expect(screen.getByText('Mis Tickets')).toBeInTheDocument();
        expect(screen.getByText('Aquí encontrarás los boletos para tus próximos eventos')).toBeInTheDocument();

        // Check if tickets are rendered
        expect(screen.getAllByTestId('ticket-item')).toHaveLength(mockTickets.length);

        // Check that QR code button is shown for non-historic tickets
        expect(screen.getAllByTestId('qr-icon')).toHaveLength(mockTickets.length);
    });

    it('shows empty state when no tickets are provided', () => {
        render(<TicketsList tickets={[]} historic={false} />);

        expect(screen.getByText('No tienes tickets disponibles')).toBeInTheDocument();
    });

    it('shows empty state for historic when no tickets are provided', () => {
        render(<TicketsList tickets={[]} historic={true} />);

        expect(screen.getByText('No tienes historial de tickets')).toBeInTheDocument();
    });

    it('displays correct ticket information', () => {
        render(<TicketsList tickets={[mockTickets[0]]} historic={false} />);

        const ticket = mockTickets[0];
        const ticketElement = screen.getByTestId('ticket-item');

        expect(within(ticketElement).getByText(getLastSixChars(ticket.id))).toBeInTheDocument();
    });

    it('shows correct status badges', () => {
        render(<TicketsList tickets={mockTickets} historic={false} />);

        // First ticket is active and not redeemed
        expect(screen.getAllByText('Activo')).toHaveLength(1);

        // Second ticket is inactive and redeemed
        expect(screen.getByText('Inactivo')).toBeInTheDocument();
        expect(screen.getByText('Canjeado')).toBeInTheDocument();
    });

    it('toggles QR code modal when clicking the QR button', () => {
        render(<TicketsList tickets={[mockTickets[0]]} historic={false} />);

        // Initially no modal
        expect(screen.queryByTestId('qr-code')).not.toBeInTheDocument();

        // Click QR button
        fireEvent.click(screen.getByText('Ver QR'));

        // Modal should appear
        expect(screen.getByTestId('qr-code')).toBeInTheDocument();
        expect(screen.getByText('Tu código QR')).toBeInTheDocument();
        expect(screen.getByText(`Folio: ${getLastSixChars(mockTickets[0].id)}`)).toBeInTheDocument();

        // Click close button
        fireEvent.click(screen.getByText('Ocultar QR'));

        // Modal should disappear
        expect(screen.queryByTestId('qr-code')).toBeInTheDocument();
    });

    it('shows availability message when ticket is not yet available', () => {
        const futureTicket = {
            ...mockTickets[0],
            presentation: {
                ...mockTickets[0].presentation,
                ticketAvailabilityDate: '2099-12-10T00:00:00Z', // Far future date
            },
        };

        render(<TicketsList tickets={[futureTicket]} historic={false} />);

        expect(screen.getByText(/Los tickets solo serán accesibles/)).toBeInTheDocument();
        expect(screen.queryByText('Ver QR')).not.toBeInTheDocument();
    });

    it('handles image error by showing placeholder', () => {
        render(<TicketsList tickets={[mockTickets[0]]} historic={false} />);

        const image = screen.getByAltText(mockTickets[0].presentation.event.name) as HTMLImageElement;

        // Simulate image error
        fireEvent.error(image);

        expect(image.src).toContain('/placeholder-event.jpg');
    });
});

// Helper function to get last six characters
function getLastSixChars(str: string): string {
    return str.slice(-6);
}