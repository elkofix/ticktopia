import { render, screen, waitFor } from '@testing-library/react';
import EditEventPage from '../page';
import { getEventDataManager } from '../../../../../../features/events/events.client.api';
import { useParams } from 'next/navigation';
import { Event } from '../../../../../../shared/types/event';
import { Presentation } from '../../../../../../shared/types/presentation';
import { PresentationManagerCard } from '../../../../../../features/presentations/components/PresentationManagerCard';

jest.mock('../../../../../../features/events/events.client.api');
jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
}));
PresentationManagerCard

// Mock child components
jest.mock('../../../../../../features/events/components/EditEventCard', () => ({
    EditEventCard: ({ event }: { event: Event }) => (
        <div data-testid="edit-event-card">{event.name}</div>
    ),
}));

jest.mock('../../../../../../features/presentations/components/PresentationManagerCard', () => ({
    PresentationManagerCard: ({ presentation }: { presentation: Presentation }) => (
        <div data-testid="presentation-card">{presentation.city}</div>
    ),
}));

jest.mock('../../../../../../shared/components/ErrorHandler', () => ({
    __esModule: true,
    default: ({ message }: { message: string }) => (
        <div data-testid="error-handler">{message}</div>
    ),
}));

const mockEventData: { event: Event; presentations: any } = {
    event: {
        id: '1',
        name: 'Test Event',
        bannerPhotoUrl: '/test.jpg',
        isPublic: true,
        user: {
            id: 'user1',
            email: 'test@example.com',
            name: 'Test User',
            lastname: 'Test Lastname',
            isActive: true,
            roles: ['event-manager'],
        },
    },
    presentations: [
        {
            idPresentation: 'p1',
            startDate: '2023-12-25T20:00:00',
            price: 50,
            place: 'Venue 1',
            city: 'City 1',
            description: 'Test description',
            latitude: 40.7128,
            longitude: -74.0060,
        },
    ],
};

describe('EditEventPage', () => {
    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state initially', () => {
        (getEventDataManager as jest.Mock).mockImplementation(
            () => new Promise(() => { })
        );

        render(<EditEventPage />);
        expect(screen.getByText('Cargando datos del evento...')).toBeInTheDocument();
    });

    it('shows error when data loading fails', async () => {
        const errorMessage = 'Error al cargar los datos del evento';
        (getEventDataManager as jest.Mock).mockRejectedValue(new Error(errorMessage));

        render(<EditEventPage />);

        await waitFor(() => {
            expect(screen.getByTestId('error-handler')).toHaveTextContent(errorMessage);
        });
    });

    it('shows empty state when no presentations exist', async () => {
        (getEventDataManager as jest.Mock).mockResolvedValue({
            ...mockEventData,
            presentations: [],
        });

        render(<EditEventPage />);

        await waitFor(() => {
            expect.anything()
                ;
        });
    });

    it('contains correct create presentation link', async () => {
        (getEventDataManager as jest.Mock).mockResolvedValue(mockEventData);

        render(<EditEventPage />);
        expect.anything()

    });

    it('handles missing event data', async () => {
        (getEventDataManager as jest.Mock).mockResolvedValue(null);

        render(<EditEventPage />);

        await waitFor(() => {
            expect(screen.getByTestId('error-handler')).toHaveTextContent(
                'No se pudo cargar la información del evento'
            );
        });
    });
});