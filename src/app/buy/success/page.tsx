import React from 'react'
import Link from 'next/link'

export default function PaymentConfirmationPage() {
  return (
      <div data-testid="payment-confirmation-container" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icono de check */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg data-testid="check-icon"
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Título principal */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Felicidades!
          </h1>

          {/* Mensaje de confirmación */}
          <div className="mb-6" >
            <p className="text-lg text-green-600 font-semibold mb-2">
              Tu pago ha sido confirmado
            </p>
            <p className="text-gray-600 text-sm leading-relaxed" data-testid="processing-info-box">
              Cuando sea aceptado por tu entidad podrás ver tu(s) ticket(s) en tu perfil
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-blue-800 font-medium text-sm">
                Procesando pago
              </span>
            </div>
            <p className="text-blue-700 text-xs">
              El proceso de confirmación puede tomar entre 5-10 minutos
            </p>
          </div>

          {/* Botón para ir al perfil */}
          <Link
            href="/client/my-tickets"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md inline-block"
          >
            Ir a Mis Tickets
          </Link>

          {/* Texto adicional */}
          <p className="text-gray-500 text-xs mt-4">
            También recibirás una confirmación por correo electrónico
          </p>
        </div>
      </div>
  )
}