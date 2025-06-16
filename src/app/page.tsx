"use client";
import { useEffect, useState } from 'react';
import { getEvents } from "@/features/events/events.api";
import EventList from "../features/events/components/EventList";
import EventsHeroSection from "@/features/events/components/EventHeroSection";
import { Event } from '@/shared/types/event';


export default function HomePage() {
  const [initialEvents, setInitialEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const events = await getEvents({ limit: 10, offset: 0 });
        setInitialEvents(events);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError(err?.response?.data?.message ?? "Error cargando los eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Estado de carga
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando eventos...</p>
        </div>
      </main>
    );
  }

  // Estado de error
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar eventos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  // Validación de que existan eventos
  if (!initialEvents || initialEvents.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No hay eventos disponibles</h2>
          <p className="text-gray-600">Por el momento no hay eventos para mostrar.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="">
      {/* Hero Section con carrusel de banners */}
      <EventsHeroSection events={initialEvents} />

      {/* Lista de eventos */}
      <div className="mt-8">
        <EventList initialEvents={initialEvents} />
      </div>
    </main>
  );
}