import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TicketSelector from '../TicketSelector';
import '@testing-library/jest-dom';
import { getTicketsCheckout } from '../../buy.api';

jest.mock('../../buy.api', () => ({
    getTicketsCheckout: jest.fn(),
}));

describe('TicketSelector', () => {
    const mockProps = {
        capacity: 10,
        price: 5000,
        presentationId: 'pres123',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with initial state', () => {
        render(<TicketSelector {...mockProps} />);

        expect(screen.getByText('Seleccionar Boletos')).toBeInTheDocument();
        expect(screen.getByText('General')).toBeInTheDocument();
        expect(screen.getByText(`${mockProps.capacity} boletos disponibles`)).toBeInTheDocument();
        expect(screen.getByText(`$${mockProps.price.toLocaleString()}`)).toBeInTheDocument();
        expect(screen.getByText('por boleto')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.queryByText('Total:')).not.toBeInTheDocument();
    });

    it('increases quantity when plus button is clicked', () => {
        render(<TicketSelector {...mockProps} />);

        const plusButton = screen.getByText('+').closest('button');
        fireEvent.click(plusButton!);

        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('does not increase quantity beyond capacity', () => {
        render(<TicketSelector {...mockProps} capacity={1} />);

        const plusButton = screen.getByText('+').closest('button');
        fireEvent.click(plusButton!);
        fireEvent.click(plusButton!); // Try to exceed capacity

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(plusButton).toBeDisabled();
    });

    it('decreases quantity when minus button is clicked', () => {
        render(<TicketSelector {...mockProps} />);

        const plusButton = screen.getByText('+').closest('button');
        const minusButton = screen.getByText('-').closest('button');

        fireEvent.click(plusButton!);
        fireEvent.click(plusButton!);
        fireEvent.click(minusButton!);

        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('does not decrease quantity below zero', () => {
        render(<TicketSelector {...mockProps} />);

        const minusButton = screen.getByText('-').closest('button');
        fireEvent.click(minusButton!);

        expect(screen.getByText('0')).toBeInTheDocument();
        expect(minusButton).toBeDisabled();
    });
    it('shows total section when quantity is greater than zero', () => {
        render(<TicketSelector {...mockProps} />);

        const plusButton = screen.getByText('+').closest('button');
        fireEvent.click(plusButton!);

        expect(screen.getByText('Total:')).toBeInTheDocument();

        // Get all price elements and verify the blue one (total) exists
        const priceElements = screen.getAllByText(`$${mockProps.price.toLocaleString()}`);
        expect(priceElements).toHaveLength(2); // One green (price per ticket), one blue (total)

        // Verify the total price (blue) is shown
        const totalPrice = screen.getByText(`$${mockProps.price.toLocaleString()}`, {
            selector: '.text-blue-600' // More specific selector for the total price
        });
        expect(totalPrice).toBeInTheDocument();

        expect(screen.getByText('Confirmar Compra')).toBeInTheDocument();
    });

    it('shows error message when checkout fails', async () => {
        const errorMessage = 'Error processing payment';
        (getTicketsCheckout as jest.Mock).mockRejectedValue(new Error(errorMessage));

        // Mock alert
        window.alert = jest.fn();

        render(<TicketSelector {...mockProps} />);

        // Select 1 ticket
        const plusButton = screen.getByText('+').closest('button');
        fireEvent.click(plusButton!);

        const confirmButton = screen.getByText('Confirmar Compra');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(getTicketsCheckout).toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalledWith('Error al procesar la compra. Por favor, inténtalo de nuevo.');
        });
    });

    it('disables buttons during loading', async () => {
        (getTicketsCheckout as jest.Mock).mockImplementation(
            () => new Promise(() => { }) // Never resolving promise
        );

        render(<TicketSelector {...mockProps} />);

        // Select 1 ticket
        const plusButton = screen.getByText('+').closest('button');
        fireEvent.click(plusButton!);

        const confirmButton = screen.getByText('Confirmar Compra');
        fireEvent.click(confirmButton);

        expect(screen.getByText('Procesando...')).toBeInTheDocument();
        expect(plusButton).toBeDisabled();
        expect(screen.getByText('-').closest('button')).toBeDisabled();
        expect(confirmButton).toBeDisabled();
    });
});