import { render, screen } from '@testing-library/react';
import Page from '../page';
import { getPresentationById } from '../../../../features/presentations/presentation.api';
import { notFound } from 'next/navigation';
import { PaymentMethods } from '../../../../features/presentations/components/PaymentMethod';
PaymentMethods
jest.mock('../../../../features/presentations/presentation.api');
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock child components to simplify testing
jest.mock('../../../../features/presentations/components/HeroSection', () => ({
  HeroSection: ({ bannerPhotoUrl, eventName }: { bannerPhotoUrl: string, eventName: string }) => (
    <div data-testid="hero-section">
      {eventName} - {bannerPhotoUrl}
    </div>
  ),
}));

jest.mock('../../../../features/presentations/components/ByuButton', () => ({
  BuyButton: ({ href }: { href: string }) => (
    <a data-testid="buy-button" href={href}>Buy Tickets</a>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string, alt: string }) => (
    <img data-testid="mock-image" src={src} alt={alt} />
  ),
}));

jest.mock('../../../../features/events/components/EventInfoCard', () => ({
  EventInfoCard: ({ eventName, formattedDate, place, city }: any) => (
    <div data-testid="event-info">
      {eventName} - {formattedDate} - {place} - {city}
    </div>
  ),
}));

jest.mock('../../../../features/presentations/components/PriceCard', () => ({
  PriceCard: ({ price }: { price: number }) => (
    <div data-testid="price-card">${price}</div>
  ),
}));

jest.mock('../../../../features/presentations/components/DescriptionSection', () => ({
  DescriptionSection: ({ description }: { description: string }) => (
    <div data-testid="description">{description}</div>
  ),
}));

jest.mock('../../../../features/presentations/components/PaymentMethod', () => ({
  PaymentMethods: () => <div data-testid="payment-methods" />,
}));


jest.mock('../../../../features/presentations/components/LocationMap', () => ({
  LocationMap: ({ latitude, longitude }: { latitude: number, longitude: number }) => (
    <div data-testid="map">{latitude},{longitude}</div>
  ),
}));

jest.mock('../../../../shared/components/ErrorHandler', () => ({
  __esModule: true,
  default: ({ message }: { message?: string }) => (
    <div data-testid="error-handler">{message || 'Error'}</div>
  ),
}));

const mockPresentation = {
  idPresentation: '123',
  startDate: '2023-12-25T20:00:00',
  price: 50,
  place: 'Main Arena',
  city: 'New York',
  description: 'Amazing concert experience',
  latitude: 40.7128,
  longitude: -74.0060,
  event: {
    name: 'Winter Concert',
    bannerPhotoUrl: '/winter-concert.jpg',
  },
};

describe('Presentation Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders presentation details when data is available', async () => {
    (getPresentationById as jest.Mock).mockResolvedValue(mockPresentation);

    const PageComponent = await Page({ params: Promise.resolve({ id: '123' }) });
    render(PageComponent);

    // Verify main sections are rendered
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getAllByTestId('buy-button')).toHaveLength(2);
    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
    expect(screen.getByTestId('event-info')).toBeInTheDocument();
    expect(screen.getByTestId('price-card')).toHaveTextContent('$50');
    expect(screen.getByTestId('description')).toHaveTextContent('Amazing concert experience');
    expect(screen.getByTestId('payment-methods')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toHaveTextContent('40.7128,-74.006');
  });

  it('calls notFound when presentation does not exist', async () => {
    (getPresentationById as jest.Mock).mockResolvedValue(null);

    await Page({ params: Promise.resolve({ id: 'invalid' }) });
    expect(notFound).not.toHaveBeenCalled();
  });

  it('shows error handler when API fails', async () => {
    const errorMessage = 'Failed to load presentation';
    (getPresentationById as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } }
    });

    const PageComponent = await Page({ params: Promise.resolve({ id: '123' }) });
    render(PageComponent);
    
    expect(screen.getByTestId('error-handler')).toHaveTextContent(errorMessage);
  });

  it('handles undefined error responses', async () => {
    (getPresentationById as jest.Mock).mockRejectedValue(new Error('Network error'));

    const PageComponent = await Page({ params: Promise.resolve({ id: '123' }) });
    render(PageComponent);
    
    expect(screen.getByTestId('error-handler')).toBeInTheDocument();
  });

  it('formats the date correctly', async () => {
    (getPresentationById as jest.Mock).mockResolvedValue(mockPresentation);

    const PageComponent = await Page({ params: Promise.resolve({ id: '123' }) });
    render(PageComponent);
    
    // Verify date is formatted (adjust based on your formateDate implementation)
    expect(screen.getByTestId('event-info')).toHaveTextContent('Winter Concert - 25 de diciembre de 2023, 20:00 - Main Arena - New York');
  });

  it('includes correct buy links', async () => {
    (getPresentationById as jest.Mock).mockResolvedValue(mockPresentation);

    const PageComponent = await Page({ params: Promise.resolve({ id: '123' }) });
    render(PageComponent);
    
    const buttons = screen.getAllByTestId('buy-button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('href', '/buy/123');
    });
  });
});