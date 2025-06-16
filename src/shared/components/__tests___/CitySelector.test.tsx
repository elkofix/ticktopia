import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CitySelector } from '../CitySelector';

// Mock de la API
const mockCities = [
  { id: 1, name: 'Bogotá', description: 'Capital de Colombia' },
  { id: 2, name: 'Medellín', description: 'Ciudad de la eterna primavera' },
  { id: 3, name: 'Cali', description: 'Sucursal del cielo' },
];

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockCities),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CitySelector Component', () => {
  const mockOnCitySelect = jest.fn();

  test('renders correctly with initial props', async () => {
    await act(async () => {
      render(<CitySelector selectedCity="Bogotá" onCitySelect={mockOnCitySelect} />);
    });
    
    const input = screen.getByPlaceholderText('Buscar ciudad...');
    expect(input).toHaveValue('Bogotá');
    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();
  });

  test('fetches cities on mount', async () => {
    await act(async () => {
      render(<CitySelector selectedCity="" onCitySelect={mockOnCitySelect} />);
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://api-colombia.com/api/v1/City');
    });
  });


  test('opens dropdown when input is focused and shows filtered cities', async () => {
    await act(async () => {
      render(<CitySelector selectedCity="" onCitySelect={mockOnCitySelect} />);
    });
    
    const input = screen.getByPlaceholderText('Buscar ciudad...');
    
    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'bog' } });
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
      expect(screen.getByText('Bogotá')).toBeInTheDocument();
    });
  });

  test('calls onCitySelect when a city is selected', async () => {
    await act(async () => {
      render(<CitySelector selectedCity="" onCitySelect={mockOnCitySelect} />);
    });
    
    const input = screen.getByPlaceholderText('Buscar ciudad...');
    
    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'bog' } });
    });
    
    await waitFor(() => {
      const cityOption = screen.getByText('Bogotá');
      fireEvent.click(cityOption);
      
      expect(mockOnCitySelect).toHaveBeenCalledWith('Bogotá');
      expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();
    });
  });

  test('shows "No results" message when no cities match', async () => {
    await act(async () => {
      render(<CitySelector selectedCity="" onCitySelect={mockOnCitySelect} />);
    });
    
    const input = screen.getByPlaceholderText('Buscar ciudad...');
    
    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'xyz' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('No se encontraron ciudades')).toBeInTheDocument();
    });
  });

  test('closes dropdown when clicking outside', async () => {
    await act(async () => {
      render(
        <div>
          <button data-testid="outside-button">Outside button</button>
          <CitySelector selectedCity="" onCitySelect={mockOnCitySelect} />
        </div>
      );
    });
    
    const input = screen.getByPlaceholderText('Buscar ciudad...');
    
    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'bog' } });
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });
    
    const outsideButton = screen.getByTestId('outside-button');
    fireEvent.mouseDown(outsideButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();
    });
  });

  test('updates search term when selectedCity prop changes', async () => {
    const { rerender } = render(
      <CitySelector selectedCity="" onCitySelect={mockOnCitySelect} />
    );
    
    await act(async () => {
      rerender(<CitySelector selectedCity="Cali" onCitySelect={mockOnCitySelect} />);
    });
    
    expect(screen.getByPlaceholderText('Buscar ciudad...')).toHaveValue('Cali');
  });

});