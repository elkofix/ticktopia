'use client';

import React, { useState } from 'react';

export interface DownloadReportsClientProps {
  type: 'sales' | 'occupation';
  generateReport: () => Promise<{ data: string; mimeType: string } | { error: string }>; // Cambiar la interfaz
  buttonText: string;
  buttonColor: string;
}

export function DownloadReportsClient({
  type,
  generateReport,
  buttonText,
  buttonColor
}: DownloadReportsClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setDownloadStatus('idle');

      // Generar el reporte (ahora devuelve base64)
      const reportData = await generateReport();

      if ('error' in reportData) {
        throw new Error(reportData.error);
      }

      // Convertir base64 a bytes
      const base64Data = reportData.data;

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      // Crear un Blob con el contenido del PDF
      const blob = new Blob([byteArray], { type: reportData.mimeType || 'application/pdf' });

      // Crear un URL temporal para el blob
      const url = window.URL.createObjectURL(blob);

      // Crear un elemento <a> temporal para descargar
      const link = document.createElement('a');
      link.href = url;

      // Generar nombre del archivo con timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `reporte-${type}-${timestamp}-${Date.now()}.pdf`;
      link.download = filename;

      // Simular click para iniciar descarga
      document.body.appendChild(link);
      link.click();

      // Limpiar: remover el elemento y liberar el URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadStatus('success');

      // Resetear el estado después de 3 segundos
      setTimeout(() => {
        setDownloadStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Error al descargar el reporte:', error);
      setDownloadStatus('error');

      // Resetear el estado de error después de 5 segundos
      setTimeout(() => {
        setDownloadStatus('idle');
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // ... resto del código igual (getButtonContent, getButtonClasses, render)
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generando...
        </>
      );
    }

    if (downloadStatus === 'success') {
      return (
        <>
          <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          ¡Descargado!
        </>
      );
    }

    if (downloadStatus === 'error') {
      return (
        <>
          <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Error - Reintentar
        </>
      );
    }

    return (
      <>
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {buttonText}
      </>
    );
  };

  const getButtonClasses = () => {
    let baseClasses = "w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-white shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50";

    if (isLoading) {
      return `${baseClasses} bg-gray-400 cursor-not-allowed`;
    }

    if (downloadStatus === 'success') {
      return `${baseClasses} bg-green-500 hover:bg-green-600 focus:ring-green-300`;
    }

    if (downloadStatus === 'error') {
      return `${baseClasses} bg-red-500 hover:bg-red-600 focus:ring-red-300`;
    }

    return `${baseClasses} ${buttonColor} focus:ring-violet-300 hover:scale-[1.02] active:scale-[0.98]`;
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={getButtonClasses()}
      >
        {getButtonContent()}
      </button>

      {downloadStatus === 'error' && (
        <div className="text-center">
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            Hubo un error al generar el reporte. Por favor, inténtalo de nuevo.
          </p>
        </div>
      )}

      {downloadStatus === 'success' && (
        <div className="text-center">
          <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
            El reporte se ha descargado exitosamente.
          </p>
        </div>
      )}
    </div>
  );
}