'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/shared/types/event';

export default function EventsHeroSection({ events }:{events: Event[]}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (events.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === events.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);



  const handleEventClick = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  if (events.length === 0) {
    return null;
  }

  const currentEvent = events[currentIndex];

  return (
    <section className="relative w-full h-96 mb-8 overflow-hidden shadow-lg">
      {/* Banner de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ 
          backgroundImage: `url(${currentEvent.bannerPhotoUrl})`,
        }}
      >
        {/* Overlay oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Contenido del hero */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
            {currentEvent.name}
          </h1>
          <p className="text-lg mb-4 drop-shadow">
            Organizado por {currentEvent.user.name || 'Usuario'}
          </p>
          <button
            onClick={() => handleEventClick(currentEvent.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
          >
            Ver Evento
          </button>
        </div>
      </div>

    </section>
  );
}