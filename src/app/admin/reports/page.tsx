"use client"
import React from 'react';
import { generateOccupationReport, generateSalesReport } from '@/features/reports/reports.api';
import { DownloadReportsClient } from '@/features/reports/components/DownloadReportsClient';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Generador de Reportes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descarga reportes detallados de ventas y ocupación en formato PDF con un solo clic
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Sales Report Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reporte de Ventas</h2>
                <p className="text-gray-500 text-sm">Análisis detallado de ventas</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Tickets por evento
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Tickets por vendedor
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Análisis de rendimiento
              </div>
            </div>

            <DownloadReportsClient 
              type="sales"
              generateReport={generateSalesReport}
              buttonText="Descargar Reporte de Ventas"
              buttonColor="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
            />
          </div>

          {/* Occupation Report Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reporte de Ocupación</h2>
                <p className="text-gray-500 text-sm">Estado de ocupación de eventos</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Tickets totales vs canjeados
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ratios de ocupación
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Resumen estadístico
              </div>
            </div>

            <DownloadReportsClient 
              type="occupation"
              generateReport={generateOccupationReport}
              buttonText="Descargar Reporte de Ocupación"
              buttonColor="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Información de los Reportes</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="mb-2">• Los reportes se generan en tiempo real con los datos más actuales</p>
              <p className="mb-2">• Los archivos PDF incluyen gráficos y tablas detalladas</p>
            </div>
            <div>
              <p className="mb-2">• Se guardan automáticamente en el servidor para futuras consultas</p>
              <p className="mb-2">• Formato optimizado para impresión y presentaciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}