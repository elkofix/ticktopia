"use client"
import { useState, useEffect, useRef } from 'react';

interface City {
  id: number;
  name: string;
  description: string;
}

interface CitySelectorProps {
  selectedCity: string;
  onCitySelect: (cityName: string) => void;
}

export function CitySelector({ selectedCity, onCitySelect }: CitySelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState(selectedCity);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    setSearchTerm(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 10)); // Limitar a 10 resultados
    } else {
      setFilteredCities([]);
    }
  }, [searchTerm, cities]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api-colombia.com/api/v1/City');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsOpen(true);
  };

  const handleCitySelect = (cityName: string) => {
    setSearchTerm(cityName);
    onCitySelect(cityName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar ciudad..."
          required
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto" data-testid="dropdown">
          {filteredCities.map((city) => (
            <button
              key={city.id}
              data-testid="city-item"
              type="button"
              onClick={() => handleCitySelect(city.name)}
              className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{city.name}</div>
              {city.description && (
                <div className="text-sm text-gray-500">{city.description}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && searchTerm && filteredCities.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <div className="text-gray-500 text-sm">No se encontraron ciudades</div>
        </div>)}
    </div>
  );
}