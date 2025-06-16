import { render, screen } from '@testing-library/react';
import { EventInfoCard } from '../EventInfoCard';

describe('EventInfoCard', () => {
    const mockProps = {
        eventName: 'Tech Conference 2023',
        formattedDate: 'June 15, 2023 - 10:00 AM',
        place: 'Convention Center',
        city: 'Barcelona'
    };

    it('renders all event information correctly', () => {
        render(<EventInfoCard {...mockProps} />);

        // Check main container
        expect(screen.getByTestId('event-info-card')).toBeInTheDocument();

        // Check event name
        expect(screen.getByTestId('event-name')).toHaveTextContent(mockProps.eventName);
        expect(screen.getByTestId('event-name')).toHaveClass('text-3xl', 'font-bold');

        // Check date
        expect(screen.getByTestId('event-date')).toHaveTextContent(mockProps.formattedDate);
        expect(screen.getByTestId('event-date')).toHaveClass('text-gray-600');

        // Check divider
        expect(screen.getByTestId('divider')).toBeInTheDocument();

        // Check location info
        expect(screen.getByTestId('event-place')).toHaveTextContent(`Lugar: ${mockProps.place}`);
        expect(screen.getByTestId('event-city')).toHaveTextContent(`Ciudad: ${mockProps.city}`);
    });

    it('applies correct styling classes', () => {
        render(<EventInfoCard {...mockProps} />);

        const card = screen.getByTestId('event-info-card');
        expect(card).toHaveClass('bg-white', 'p-6', 'rounded-xl', 'shadow-md');
    });

    it('renders correctly with empty strings', () => {
        const emptyProps = {
            eventName: '',
            formattedDate: '',
            place: '',
            city: ''
        };
        render(<EventInfoCard {...emptyProps} />);

        expect(screen.getByTestId('event-name')).toHaveTextContent('');
        expect(screen.getByTestId('event-date')).toHaveTextContent('');
    });
});