import React from 'react'
import Link from 'next/link'

export default function Unauthorized() {
  return (
        <div 
      className="min-h-screen bg-gradient-to-br from-wisteria/10 to-violet/10 flex items-center justify-center p-4"
      data-testid="unauthorized-container">
      <div className="max-w-md w-full">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-wisteria/20 p-8 text-center">
          {/* Icono de candado */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand to-violet rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              data-testid="lock-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Acceso Denegado
          </h1>

          {/* Mensaje principal */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            No tienes el rol necesario para acceder a esta página.
            Contacta con tu administrador si crees que esto es un error.
          </p>

          {/* Código de error decorativo */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sandyBrown/10 to-sunglow/10 rounded-full mb-6">
            <span className="text-sm font-mono text-sandyBrown font-semibold">
              Error 403
            </span>
          </div>

          {/* Botón de acción */}
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-brand to-violet text-white font-semibold py-3 px-6 rounded-xl hover:from-violet hover:to-brand transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-center"
          >
            Volver al Inicio
          </Link>
        </div>

        {/* Información adicional */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda?
            <span className="text-brand hover:text-violet cursor-pointer font-medium ml-1">
              Contactar Soporte
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}