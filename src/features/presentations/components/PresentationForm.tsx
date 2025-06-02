"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Presentation } from '@/shared/types/presentation';
import { createPresentation, updatePresentation } from '../presentation.client.api';
import { DatePicker } from '@/shared/components/DatePicker';
import { LocationPicker } from '@/shared/components/LocationPicker';
import { CitySelector } from '@/shared/components/CitySelector';

interface PresentationFormProps {
  eventId: string;
  eventName: string;
  initialData?: Presentation | null;
}

interface UpdatePresentationDto {
  place?: string;
  capacity?: number;
  openDate?: string;
  startDate?: string;
  ticketAvailabilityDate?: string;
  ticketSaleAvailabilityDate?: string;
  price?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  city?: string;
}

export function PresentationForm({ eventId, initialData }: PresentationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    place: initialData?.place || '',
    capacity: initialData?.capacity || 100,
    openDate: initialData?.openDate || '',
    startDate: initialData?.startDate || '',
    ticketAvailabilityDate: initialData?.ticketAvailabilityDate || '',
    ticketSaleAvailabilityDate: initialData?.ticketSaleAvailabilityDate || '',
    price: initialData?.price || 0,
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    description: initialData?.description || '',
    city: initialData?.city || '',
  });

  // Guardamos los datos iniciales para comparar cambios
  const [initialFormData] = useState(formData);
  const isEditMode = Boolean(initialData);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCapacityChange = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      capacity: Math.max(1, prev.capacity + delta)
    }));
  };

  const handlePriceChange = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      price: Math.max(0, prev.price + delta)
    }));
  };

  // Función para obtener solo los campos que han cambiado
  const getChangedFields = (): UpdatePresentationDto => {
    const changes: UpdatePresentationDto = {};

    Object.keys(formData).forEach(key => {
      const typedKey = key as keyof typeof formData;
      if (formData[typedKey] !== initialFormData[typedKey]) {
        // @ts-ignore - TypeScript no puede inferir que los tipos coinciden
        changes[typedKey] = formData[typedKey];
      }
    });

    return changes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditMode && initialData?.idPresentation) {
        const changedFields = getChangedFields();

        // Solo enviar la actualización si hay cambios
        if (Object.keys(changedFields).length > 0) {
          await updatePresentation(initialData.idPresentation, changedFields);
          console.log('Presentation updated with changes:', changedFields);
        } else {
          console.log('No changes detected');
        }

        router.push(`/event-manager/events/manage/${eventId}`);
      } else {
        const presentationData = {
          ...formData,
          eventId
        };
        await createPresentation(presentationData);
        router.push(`/event-manager/events/manage/${eventId}`);
      }
    } catch (error) {
      console.error('Error saving presentation:', error);
      alert('Error al guardar la presentación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const areDatesValid = () => {
    const ticketSaleDate = new Date(formData.ticketSaleAvailabilityDate);
    const ticketAvailabilityDate = new Date(formData.ticketAvailabilityDate);
    const openDate = new Date(formData.openDate);
    const startDate = new Date(formData.startDate);

    // Para modo edición, solo validamos el orden de las fechas
    if (isEditMode) {
      return (
        ticketSaleDate < ticketAvailabilityDate &&
        ticketAvailabilityDate < openDate &&
        openDate <= startDate
      );
    }

    // Para modo creación, validamos orden y que sean futuras
    const currentDate = new Date();
    return (
      ticketSaleDate < ticketAvailabilityDate &&
      ticketAvailabilityDate < openDate &&
      openDate <= startDate &&
      ticketSaleDate >= currentDate &&
      ticketAvailabilityDate >= currentDate &&
      openDate >= currentDate &&
      startDate >= currentDate
    );
  };

  const isFormValid =
    formData.description &&
    formData.place &&
    formData.city &&
    formData.startDate &&
    formData.openDate &&
    formData.ticketAvailabilityDate &&
    formData.ticketSaleAvailabilityDate &&
    formData.capacity > 0 &&
    formData.price >= 1000 &&
    areDatesValid();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Información Básica</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lugar */}
          <div className="md:col-span-2">
            <label
              htmlFor="place-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Lugar de la presentación *
            </label>
            <input
              id="place-input"
              type="text"
              value={formData.place}
              onChange={(e) => handleInputChange('place', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Teatro Nacional, Auditorio Central..."
              required
            />
            {!formData.place && (
              <p className="mt-1 text-sm text-red-500">El lugar no puede estar vacío</p>
            )}
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad *
            </label>
            <CitySelector
              selectedCity={formData.city}
              onCitySelect={(city: string) => handleInputChange('city', city)}
            />
            {!formData.city && (
              <p className="mt-1 text-sm text-red-500">La ciudad no puede estar vacía</p>
            )}
          </div>

          {/* Capacidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad *
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleCapacityChange(-10)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-bold">-</span>
              </button>

              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-semibold"
                min="1"
                required
              />

              <button
                type="button"
                onClick={() => handleCapacityChange(10)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
            {formData.capacity < 1 && (
              <p className="mt-1 text-sm text-red-500">La capacidad debe ser mayor a 0</p>
            )}
          </div>

          {/* Precio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio por boleto *
            </label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-gray-700">$</span>
              <button
                type="button"
                onClick={() => handlePriceChange(-1000)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-bold">-</span>
              </button>

              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-semibold"
                min="1000"
                step="1000"
              />

              <button
                type="button"
                onClick={() => handlePriceChange(1000)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
            {formData.price < 1000 && (
              <p className="mt-1 text-sm text-red-500">El precio debe ser mayor o igual a $1.000</p>
            )}
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Fechas Importantes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <DatePicker
              label="Fecha de apertura *"
              value={formData.openDate}
              onChange={(date: string) => handleInputChange('openDate', date)}
              required
            />
            {formData.openDate && formData.startDate && new Date(formData.openDate) > new Date(formData.startDate) && (
              <p className="mt-1 text-sm text-red-500">La fecha de apertura debe ser anterior o igual a la fecha de inicio</p>
            )}
            {!isEditMode && new Date(formData.openDate) < new Date() && (
              <p className="mt-1 text-sm text-red-500">La fecha de apertura debe ser en el futuro</p>
            )}
          </div>

          <div>
            <DatePicker
              label="Fecha de inicio *"
              value={formData.startDate}
              onChange={(date: string) => handleInputChange('startDate', date)}
              required
            />
            {!isEditMode && formData.startDate && new Date(formData.startDate) < new Date() && (
              <p className="mt-1 text-sm text-red-500">La fecha de inicio debe ser en el futuro</p>
            )}
          </div>

          <div>
            <DatePicker
              label="Disponibilidad de boletos *"
              value={formData.ticketAvailabilityDate}
              onChange={(date: string) => handleInputChange('ticketAvailabilityDate', date)}
              required
            />
            {formData.ticketAvailabilityDate && formData.openDate &&
              new Date(formData.ticketAvailabilityDate) >= new Date(formData.openDate) && (
                <p className="mt-1 text-sm text-red-500">La disponibilidad debe ser antes de la fecha de apertura</p>
              )}
            {!isEditMode && new Date(formData.ticketAvailabilityDate) < new Date() && (
              <p className="mt-1 text-sm text-red-500">La fecha de acceso a los boletos debe ser en el futuro</p>
            )}
          </div>

          <div>
            <DatePicker
              label="Venta de boletos disponible *"
              value={formData.ticketSaleAvailabilityDate}
              onChange={(date: string) => handleInputChange('ticketSaleAvailabilityDate', date)}
              required
            />
            {formData.ticketSaleAvailabilityDate && formData.ticketAvailabilityDate &&
              new Date(formData.ticketSaleAvailabilityDate) >= new Date(formData.ticketAvailabilityDate) && (
                <p className="mt-1 text-sm text-red-500">La venta debe estar disponible antes de la disponibilidad general</p>
              )}
            {!isEditMode && new Date(formData.ticketSaleAvailabilityDate) < new Date() && (
              <p className="mt-1 text-sm text-red-500">La fecha de apertura de ventas debe ser en el futuro</p>
            )}
          </div>
        </div>

        {/* Validation summary */}
        {formData.ticketSaleAvailabilityDate && formData.ticketAvailabilityDate && formData.openDate && formData.startDate &&
          (new Date(formData.ticketSaleAvailabilityDate) >= new Date(formData.ticketAvailabilityDate) ||
            new Date(formData.ticketAvailabilityDate) >= new Date(formData.openDate) ||
            new Date(formData.openDate) > new Date(formData.startDate)) && (
            <div className="mt-4 text-red-500 text-sm">
              Las fechas deben cumplir con: Venta de boletos &lt; Disponibilidad &lt; Apertura &le; Inicio
            </div>
          )}
      </div>

      {/* Ubicación */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Ubicación</h2>

        <LocationPicker
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationChange={(lat: number, lng: number) => {
            handleInputChange('latitude', lat);
            handleInputChange('longitude', lng);
          }}
        />
        {formData.latitude === 0 && (
          <p className="mt-1 text-sm text-red-500">La latitud no puede estar vacía</p>
        )}
        {formData.longitude === 0 && (
          <p className="mt-1 text-sm text-red-500">La longitud no puede estar vacía</p>
        )}
      </div>

      {/* Descripción */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Descripción</h2>

        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Describe detalles adicionales sobre esta presentación..."
        />
        {!formData.description && (
          <p className="mt-1 text-sm text-red-500">La descripción no puede estar vacía</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditMode ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            isEditMode ? 'Actualizar Presentación' : 'Crear Presentación'
          )}
        </button>
      </div>
    </form>
  );
}