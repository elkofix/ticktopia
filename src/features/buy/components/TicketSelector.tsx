"use client"
import { useState } from 'react';
import { getTicketsCheckout } from '../buy.api';

interface TicketSelectorProps {
  capacity: number;
  price: number;
  presentationId: string; // Agregamos el ID de la presentación
}

export default function TicketSelector({ capacity, price, presentationId }: TicketSelectorProps) {
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < capacity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
    }
  };

  const handleConfirm = async () => {
    if (quantity === 0) return;
    
    setIsLoading(true);
    try {
      const response = await getTicketsCheckout(presentationId, quantity);
      // Redirigir a la checkout session
      window.location.href = response.checkoutSession;
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
      alert('Error al procesar la compra. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8" data-testid="ticket-selector">
      <h2 className="text-xl font-bold mb-6">Seleccionar Boletos</h2>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <span className="text-lg font-medium text-gray-900">General</span>
          <p className="text-sm text-gray-500">{capacity} boletos disponibles</p>
        </div>
        
        <div className="flex-1 text-center">
          <span className="text-2xl font-bold text-green-600">
            ${price.toLocaleString()}
          </span>
          <p className="text-sm text-gray-500">por boleto</p>
        </div>
        
        <div className="flex-1 flex items-center justify-end gap-3">
          <button
            onClick={handleDecrease}
            disabled={quantity === 0 || isLoading}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 transition-colors"
          >
            <span className="text-xl font-bold">-</span>
          </button>
          
          <span className="text-xl font-bold min-w-8 text-center">
            {quantity}
          </span>
          
          <button
            onClick={handleIncrease}
            disabled={quantity >= capacity || isLoading}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 transition-colors"
          >
            <span className="text-xl font-bold">+</span>
          </button>
        </div>
      </div>
      
      {quantity > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${(quantity * price).toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              'Confirmar Compra'
            )}
          </button>
        </div>
      )}
    </div>
  );
}