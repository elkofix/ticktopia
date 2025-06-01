import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentConfirmationPage from '../page';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('PaymentConfirmationPage', () => {
  beforeEach(() => {
    render(<PaymentConfirmationPage />);
  });

  it('should render the main confirmation container', () => {
    const container = screen.getByTestId('payment-confirmation-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('min-h-screen');
    expect(container).toHaveClass('bg-gradient-to-br');
  });

  it('should display the success check icon', () => {
    const checkIcon = screen.getByTestId('check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  it('should display the congratulations title', () => {
    const title = screen.getByText('¡Felicidades!');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl');
    expect(title).toHaveClass('font-bold');
  });

  it('should display the payment confirmation message', () => {
    const confirmationText = screen.getByText('Tu pago ha sido confirmado');
    expect(confirmationText).toBeInTheDocument();
    expect(confirmationText).toHaveClass('text-green-600');
    expect(confirmationText).toHaveClass('font-semibold');
  });

  it('should display the additional information about tickets', () => {
    const infoText = screen.getByText(/Cuando sea aceptado por tu entidad podrás ver tu\(s\) ticket\(s\) en tu perfil/);
    expect(infoText).toBeInTheDocument();
    expect(infoText).toHaveClass('text-gray-600');
  });

  it('should display the payment processing information box', () => {
    const infoBox = screen.getByTestId('processing-info-box');
    expect(infoBox).toBeInTheDocument();
  });

  it('should display the correct processing time information', () => {
    const processingText = screen.getByText('El proceso de confirmación puede tomar entre 5-10 minutos');
    expect(processingText).toBeInTheDocument();
    expect(processingText).toHaveClass('text-blue-700');
    expect(processingText).toHaveClass('text-xs');
  });

  it('should render the link to My Tickets page', () => {
    const link = screen.getByRole('link', { name: /Ir a Mis Tickets/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/client/my-tickets');
  });

  it('should display the email confirmation text', () => {
    const emailText = screen.getByText('También recibirás una confirmación por correo electrónico');
    expect(emailText).toBeInTheDocument();
    expect(emailText).toHaveClass('text-gray-500');
    expect(emailText).toHaveClass('text-xs');
  });
});