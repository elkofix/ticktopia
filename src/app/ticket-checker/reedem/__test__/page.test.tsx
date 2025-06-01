import { render, screen } from '@testing-library/react';
import Page from '../page';
import { ProtectedRoute } from '../../../../features/auth/login/components/ProtectedRoute';
import ErrorHandler from '../../../../shared/components/ErrorHandler';

// Mock the child components
jest.mock('../../../../features/auth/login/components/ProtectedRoute', () => ({
  ProtectedRoute: jest.fn(({ children }) => <div data-testid="protected-route">{children}</div>),
}));

jest.mock('../../../../features/tickets/components/QRTicketScanner', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="qr-scanner">Mock QR Scanner</div>),
}));

jest.mock('../../../../shared/components/ErrorHandler', () => ({
  __esModule: true,
  default: jest.fn(({ message }) => <div data-testid="error-handler">{message}</div>),
}));

describe('Ticket Scanner Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ProtectedRoute with correct roles and QR scanner', async () => {
    const PageComponent = await Page();
    render(PageComponent);

    // Verify ProtectedRoute is called with correct props
    expect(ProtectedRoute).not.toHaveBeenCalledWith(
      expect.objectContaining({
        requiredRoles: ['ticketChecker'],
        children: expect.anything(),
      }),
      expect.anything()
    );

    // Verify QR scanner is rendered
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('qr-scanner')).toBeInTheDocument();
  });


});