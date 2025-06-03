import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DatePicker } from '../DatePicker';

describe('DatePicker Component', () => {
  const mockOnChange = jest.fn();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with basic props', () => {
    render(
      <DatePicker 
        label="Fecha" 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    const input = screen.getByTestId('date-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  test('displays formatted date when value is provided', () => {
    const testDate = '2023-05-15T14:30:00Z';
    render(
      <DatePicker 
        label="Fecha" 
        value={testDate} 
        onChange={mockOnChange} 
      />
    );
    
    const displayText = screen.getByTestId('selected-date').textContent;
    expect(displayText).toMatch(/lun/); // Lunes abreviado
    expect(displayText).toMatch(/15/); // Día
    expect(displayText).toMatch(/may/); // Mes abreviado
    expect(displayText).toMatch(/2023/); // Año
  });

  test('handles empty date selection', () => {
    render(
      <DatePicker 
        label="Fecha" 
        value="2023-05-15T14:30:00Z" 
        onChange={mockOnChange} 
      />
    );
    
    const input = screen.getByTestId('date-input');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  test('applies required attribute when required prop is true', () => {
    render(
      <DatePicker 
        label="Fecha" 
        value="" 
        onChange={mockOnChange} 
        required 
      />
    );
    
    const input = screen.getByTestId('date-input');
    expect(input).toBeRequired();
  });



  test('handles string date constraints', () => {
    const dateString = '2023-05-15T00:00:00Z';
    render(
      <DatePicker 
        label="Fecha" 
        value="" 
        onChange={mockOnChange} 
        minDate={dateString}
        maxDate={dateString}
      />
    );
    
    const input = screen.getByTestId('date-input');
    expect(input).toHaveAttribute('min', '2023-05-14T19:00');
  });

  test('does not show selected date when value is empty', () => {
    render(
      <DatePicker 
        label="Fecha" 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    expect(screen.queryByTestId('selected-date')).not.toBeInTheDocument();
  });
});