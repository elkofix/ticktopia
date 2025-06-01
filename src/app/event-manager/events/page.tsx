"use client";

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEventsByUser } from '@/features/events/events.client.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import EventList from '@/features/events/components/EventList';
import { Event } from '@/shared/types/event';

export default function Page() {
    const [events, setEvents] = useState<Event[] | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEventsByUser();
                setEvents(data);

            } catch (err: any) {
                console.error(err);
                setError(true);
            }
        };

        fetchEvents();
    }, []);

    if (error) {
        return null;
    }

    if (!events) {
        return <div>Cargando eventos...</div>;
    }

    console.log(events);
    return (
        <div className="space-y-6">
            {/* Header con botón agregar evento */}
            <div className="flex justify-end mx-12 mt-5">
                <Link 
                    href="/event-manager/events/create"
                    className="inline-flex items-center px-4 py-2 bg-brand hover:bg-violet text-white font-medium rounded-lg shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-wisteria focus:ring-offset-2"
                >
                    <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 4v16m8-8H4" 
                        />
                    </svg>
                    Agregar Evento
                </Link>
            </div>

            {/* Lista de eventos */}
            <EventList initialEvents={events} showControls />
        </div>
    );
}