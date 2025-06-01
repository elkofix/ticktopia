import { render, screen } from '@testing-library/react';
import HomePage from '../page';
import { getEvents } from '../../features/events/events.api';
import { Event } from '@/shared/types/event';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import { Provider } from 'react-redux';

// Mock the events API
jest.mock('../../features/events/events.api', () => ({
    getEvents: jest.fn(),
}));

jest.mock('../../features/events/components/EventHeroSection', () => {
    return function MockEventsHeroSection({ events }: { events: Event[] }) {
        return <div data-testid="mock-hero">Mock Hero Section</div>;
    };
});

const mockEvents: Event[] = [
    {
        id: '1',
        name: 'Concert',
        bannerPhotoUrl: '/concert.jpg',
        isPublic: true,
        user: {
            id: 'user1',
            email: 'organizer@example.com',
            name: 'John',
            lastname: 'Doe',
            isActive: true,
            roles: ['event-manager'],
        },
    },
    {
        id: '2',
        name: 'Conference',
        bannerPhotoUrl: '/conference.jpg',
        isPublic: true,
        user: {
            id: 'user2',
            email: 'organizer2@example.com',
            name: 'Jane',
            lastname: 'Smith',
            isActive: true,
            roles: ['admin'],
        },
    },
];

const createTestStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            // Add other reducers if needed
        },
    });
};


describe('HomePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the hero section and event list with fetched events', async () => {
        (getEvents as jest.Mock).mockResolvedValue(mockEvents);

        const Page = await HomePage();
        const store = createTestStore();

        render(
            <Provider store={store}>
                {Page}
            </Provider>
        );

        expect(getEvents).toHaveBeenCalledWith({ limit: 10, offset: 0 });
        expect(screen.getByText('Concert')).toBeInTheDocument();
        expect(screen.getByText('Conference')).toBeInTheDocument();
    });


    it('renders correctly when no events are returned', async () => {
        (getEvents as jest.Mock).mockResolvedValue([]);

        const Page = await HomePage();
        const store = createTestStore();

        render(
            <Provider store={store}>
                {Page}
            </Provider>
        );

        // Add your empty state assertion when implemented
    });

    // Note: Error handling would need to be implemented in your component
    // it('shows error message when API fails', async () => {
    //   (getEvents as jest.Mock).mockRejectedValue(new Error('API Error'));
    //   const Page = await HomePage();
    //   render(Page);
    //   expect(screen.getByText('Failed to load events')).toBeInTheDocument();
    // });
});