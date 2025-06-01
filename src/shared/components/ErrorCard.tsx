'use client';

import { AlertTriangle } from 'lucide-react';

export default function ErrorCard({ title = "Ocurrió un error", message = "Algo salió mal. Por favor, intenta de nuevo más tarde." }) {
  return (
    <div  className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl border border-red-200 p-6 flex items-start gap-4">
      <div className="p-2 bg-red-100 text-red-600 rounded-full">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-red-700">{title}</h2>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
    </div>
  );
}
