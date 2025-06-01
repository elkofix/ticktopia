import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PresentationForm } from '../PresentationForm';
import { useRouter } from 'next/navigation';
import { createPresentation, updatePresentation } from '../../presentation.client.api';
import '@testing-library/jest-dom';
import { Presentation } from '@/shared/types/presentation';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../presentation.client.api', () => ({
  createPresentation: jest.fn(),
  updatePresentation: jest.fn(),
}));

jest.mock('../../../../shared/components/DatePicker', () => ({
  DatePicker: ({ label, value, onChange }: { label: string; value: string; onChange: (date: string) => void }) => (
    <div>
      <label>{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`datepicker-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
    </div>
  ),
}));

jest.mock('../../../../shared/components/LocationPicker', () => ({
  LocationPicker: ({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) => (
    <div>
      <button 
        onClick={() => onLocationChange(40.7128, -74.0060)}
        data-testid="location-picker-mock"
      >
        Set Location
      </button>
    </div>
  ),
}));

jest.mock('../../../../shared/components/CitySelector', () => ({
  CitySelector: ({ selectedCity, onCitySelect }: { selectedCity: string; onCitySelect: (city: string) => void }) => (
    <select
      value={selectedCity}
      onChange={(e) => onCitySelect(e.target.value)}
      data-testid="city-selector"
    >
      <option value="">Select a city</option>
      <option value="Bogotá">Bogotá</option>
      <option value="Medellín">Medellín</option>
    </select>
  ),
}));

describe('PresentationForm', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  const mockInitialData: Presentation = {
    idPresentation: 'pres-123',
    place: 'Test Venue',
    event: {
      id: 'event-123',
      name: '',
      bannerPhotoUrl: '/test.jpg',
      isPublic: true,
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        lastname: 'Test',
        isActive: true,
        roles: ['event-manager'],
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


  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  // Prueba actualizada para edición
  it('handles form submission in edit mode with changes', async () => {
    (updatePresentation as jest.Mock).mockResolvedValue({});
    render(<PresentationForm eventId="event-123" initialData={mockInitialData} eventName={''} />);

    // Usamos getByDisplayValue para encontrar el input con el valor inicial
    fireEvent.change(screen.getByDisplayValue('Test Venue'), {
      target: { value: 'Updated Venue' },
    });

    fireEvent.click(screen.getByRole('button', { name: /actualizar presentación/i }));

    await waitFor(() => {
      expect(updatePresentation).toHaveBeenCalledWith('pres-123', {
        place: 'Updated Venue',
      });
      expect(mockRouter.push).toHaveBeenCalledWith(
        '/event-manager/events/manage/event-123'
      );
    });
  });

  it('handles cancel button click', () => {
    render(<PresentationForm eventId="event-123" eventName={''} />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockRouter.back).toHaveBeenCalled();
  });
});