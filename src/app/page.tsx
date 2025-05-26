'use client';

import { useState, useEffect } from 'react';
import { getEvents } from "@/features/events/events.api";
import EventList from "../features/events/components/EventList";
import EventsHeroSection from "@/features/events/components/EventHeroSection";
import { Event } from '@/shared/types/event';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const initialEvents = await getEvents({ limit: 10, offset: 0 });
        setEvents(initialEvents);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los eventos');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <main className="">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="">
      {/* Hero Section con carrusel de banners */}
      <EventsHeroSection events={events} />
      
      {/* Lista de eventos */}
      <div className="mt-8">
        <EventList initialEvents={events} />
      </div>
    </main>
  );
}