import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';
import '@testing-library/jest-dom';
import { PaymentMethods } from '../PaymentMethod';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  CreditCard: jest.fn(() => <svg data-testid="credit-card-icon" />),
  Shield: jest.fn(() => <svg data-testid="shield-icon" />),
  CheckCircle: jest.fn(() => <svg data-testid="check-circle-icon" />),
  Lock: jest.fn(() => <svg data-testid="lock-icon" />),
}));

describe('PaymentMethods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main container correctly', () => {
    render(<PaymentMethods />);
    
    const container = screen.getByTestId('payment-methods-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('bg-white');
    expect(container).toHaveClass('p-8');
    expect(container).toHaveClass('rounded-2xl');
    expect(container).toHaveClass('shadow-lg');
    expect(container).toHaveClass('mb-12');
    expect(container).toHaveClass('border');
    expect(container).toHaveClass('border-gray-100');
  });

  it('displays the correct heading with icon', () => {
    render(<PaymentMethods />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Métodos de Pago');
    expect(heading).toHaveClass('text-3xl');
    expect(heading).toHaveClass('font-bold');
    expect(heading).toHaveClass('text-gray-900');
    
    expect(screen.getByTestId('credit-card-icon')).toBeInTheDocument();
  });

  it('shows the security notice with shield icon', () => {
    render(<PaymentMethods />);
    
    const noticeBox = screen.getByTestId('security-notice');
    expect(noticeBox).toBeInTheDocument();
    expect(noticeBox).toHaveClass('bg-blue-50');
    expect(noticeBox).toHaveClass('border');
    expect(noticeBox).toHaveClass('border-blue-200');
    
    const noticeText = screen.getByText(/Aceptamos únicamente tarjetas de crédito/i);
    expect(noticeText).toBeInTheDocument();
    expect(noticeText).toHaveClass('text-blue-800');
    expect(noticeText).toHaveClass('font-medium');
    
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
  });

  it('renders all credit card options', () => {
    render(<PaymentMethods />);
    
    const cards = screen.getAllByTestId('credit-card');
    expect(cards).toHaveLength(2);
    
    // Visa card
    expect(screen.getByText('Visa')).toBeInTheDocument();

  });


  it('matches snapshot', () => {
    const { asFragment } = render(<PaymentMethods />);
    expect(asFragment()).toMatchSnapshot();
  });
});