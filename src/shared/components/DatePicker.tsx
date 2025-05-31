"use client"
import { useState } from "react";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  id?: string;
}

export function DatePicker({ 
  label, 
  value, 
  onChange, 
  required = false,
  minDate,
  maxDate,
  id = "date-input"
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateFromInput = (inputValue: string) => {
    if (!inputValue) return '';
    return new Date(inputValue).toISOString();
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMinMaxAttributes = () => {
    const attributes: {min?: string; max?: string} = {};
    
    if (minDate) {
      const min = minDate instanceof Date ? minDate : new Date(minDate);
      attributes.min = formatDateForInput(min.toISOString());
    }
    
    if (maxDate) {
      const max = maxDate instanceof Date ? maxDate : new Date(maxDate);
      attributes.max = formatDateForInput(max.toISOString());
    }
    
    return attributes;
  };

  const handleDateChange = (inputValue: string) => {
    const isoDate = formatDateFromInput(inputValue);
    onChange(isoDate);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        <input
          id={id}
          type="datetime-local"
          value={formatDateForInput(value)}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required={required}
          {...getMinMaxAttributes()}
          data-testid="date-input"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            data-testid="calendar-icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m3 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v1m16 0v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7h16z" />
          </svg>
        </div>
      </div>
      
      {value && (
        <div className="text-sm text-gray-600" data-testid="selected-date">
          Seleccionado: {formatDateForDisplay(value)}
        </div>
      )}
    </div>
  );
}