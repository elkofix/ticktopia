import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PresentationManagerCard } from '../PresentationManagerCard';
import { deletePresentation } from '../../presentation.client.api';
import '@testing-library/jest-dom';

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

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockNextLink';
  return MockLink;
});


jest.mock('../../presentation.client.api', () => ({
  deletePresentation: jest.fn(),
}));

jest.mock('../../../../shared/utils/dates', () => ({
  formateDate: jest.fn((date) => `Formatted: ${date}`),
}));

describe('PresentationManagerCard', () => {
  const mockPresentation = {
    idPresentation: 'pres-123',
    place: 'Test Venue',
    event: {
      id: 'event-123',
      name: 'Test Event',
      bannerPhotoUrl: '/test.jpg',
      isPublic: true,
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        lastname: 'Test',
        isActive: true,
        roles: ['ORGANIZER'],
      },
    },
    capacity: 100,
    price: 5000,
    openDate: '2023-12-01T18:00:00Z',
    startDate: '2023-12-01T20:00:00Z',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'Test description',
    ticketAvailabilityDate: '2023-11-15T00:00:00Z',
    ticketSaleAvailabilityDate: '2023-11-01T00:00:00Z',
    city: 'Bogotá',
  };

  const mockProps = {
    presentation: mockPresentation,
    bannerPhotoUrl: '/banner.jpg',
    eventName: 'Test Event',
    onPresentationDeleted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<PresentationManagerCard {...mockProps as any} />);

    // Check main container
    expect(screen.getByTestId('presentation-card')).toBeInTheDocument();

    // Check image
    expect(screen.getByAltText(mockProps.eventName)).toBeInTheDocument();

    // Check event name
    expect(screen.getByText(mockProps.eventName)).toBeInTheDocument();

    // Check date
    expect(screen.getByText(`Formatted: ${mockPresentation.startDate}`)).toBeInTheDocument();

    // Check city
    expect(screen.getByText(mockPresentation.city)).toBeInTheDocument();

    // Check capacity
    expect(screen.getByText(`${mockPresentation.capacity} asientos`)).toBeInTheDocument();

    // Check price
    expect(screen.getByText(`$${mockPresentation.price.toLocaleString()}`)).toBeInTheDocument();

    // Check description
    expect(screen.getByText(mockPresentation.description)).toBeInTheDocument();

    // Check action buttons
    expect(screen.getByText('Ver Presentación')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('shows delete button on hover', () => {
    render(<PresentationManagerCard {...mockProps as any} />);
    
    const deleteButton = screen.getByTitle('Eliminar presentación');
    expect(deleteButton).toHaveClass('opacity-0');
    expect(deleteButton).toHaveClass('group-hover:opacity-100');
  });

  it('opens delete confirmation modal when delete button is clicked', () => {
    render(<PresentationManagerCard {...mockProps as any} />);
    
    fireEvent.click(screen.getByTitle('Eliminar presentación'));
    
    expect(screen.getByText('Eliminar Presentación')).toBeInTheDocument();
  });

  it('calls deletePresentation and shows success modal when deletion is successful', async () => {
    (deletePresentation as jest.Mock).mockResolvedValue({ success: true });
    render(<PresentationManagerCard {...mockProps as any} />);
    
    // Open delete modal
    fireEvent.click(screen.getByTitle('Eliminar presentación'));
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Eliminar'));
    
    await waitFor(() => {
      expect(deletePresentation).toHaveBeenCalledWith(mockPresentation.idPresentation);
      expect(screen.getByText('Presentación Eliminada')).toBeInTheDocument();
      expect(mockProps.onPresentationDeleted).toHaveBeenCalledWith(mockPresentation.idPresentation);
    });
  });

  it('shows error modal when deletion fails', async () => {
    const errorMessage = 'Failed to delete';
    (deletePresentation as jest.Mock).mockResolvedValue({ error: errorMessage });
    render(<PresentationManagerCard {...mockProps as any} />);
    
    // Open delete modal
    fireEvent.click(screen.getByTitle('Eliminar presentación'));
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Eliminar'));
    
    await waitFor(() => {
      expect(screen.getByText('Error al Eliminar')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('closes delete modal when cancel is clicked', () => {
    render(<PresentationManagerCard {...mockProps as any} />);
    
    // Open delete modal
    fireEvent.click(screen.getByTitle('Eliminar presentación'));
    
    // Cancel deletion
    fireEvent.click(screen.getByText('Cancelar'));
    
    expect(screen.queryByText('Cancelar')).toBeInTheDocument();
  });

  it('shows loading state during deletion', async () => {
    (deletePresentation as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<PresentationManagerCard {...mockProps as any} />);
    
    // Open delete modal
    fireEvent.click(screen.getByTitle('Eliminar presentación'));
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Eliminar'));
    
    expect(screen.getByText('Eliminando...')).toBeInTheDocument();
  });

  it('handles image error by showing placeholder', () => {
    render(<PresentationManagerCard {...mockProps as any} />);
    
    const image = screen.getByAltText(mockProps.eventName);
    fireEvent.error(image);
    
    expect(image).toHaveAttribute('src', '/placeholder-presentation.jpg');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<PresentationManagerCard {...mockProps as any} />);
    expect(asFragment()).toMatchSnapshot();
  });
});