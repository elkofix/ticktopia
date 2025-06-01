"use client"
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { PresentationForm } from '@/features/presentations/components/PresentationForm';
import ErrorHandler from '@/shared/components/ErrorHandler';
import { getEventDataManager } from '@/features/events/events.client.api';
import { getPresentationForManagerById } from '@/features/presentations/presentation.client.api';
import { Presentation } from '@/shared/types/presentation';
import { Event } from '@/shared/types/event';


export default function PresentationManagePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    
    const eventId = params.eventId as string;
    const editId = searchParams.get('editId');
    
    const [event, setEvent] = useState<Event | null>(null);
    const [presentationToEdit, setPresentationToEdit] = useState<Presentation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Obtener datos del evento
                const { event: eventData } = await getEventDataManager(eventId);
                setEvent(eventData);

                // Obtener presentación para editar si existe editId
                if (editId) {
                    try {
                        const presentation = await getPresentationForManagerById(editId);
                        setPresentationToEdit(presentation);
                    } catch (error) {
                        console.log('Error getting presentation:', error);
                        // No establecer error aquí ya que es opcional
                    }
                }
            } catch (error: any) {
                console.error('Error fetching data:', error);
                setError(error?.response?.data?.message || 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchData();
        }
    }, [eventId, editId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <ErrorHandler message={error} />;
    }

    if (!event) {
        return <ErrorHandler message="Evento no encontrado" />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {editId ? 'Editar Presentación' : 'Crear Nueva Presentación'}
                        </h1>
                        <p className="text-gray-600">
                            {editId
                                ? 'Modifica los detalles de tu presentación'
                                : `Crea una nueva presentación para "${event.name}"`
                            }
                        </p>
                    </div>

                    <PresentationForm
                        eventId={eventId}
                        eventName={event.name}
                        initialData={presentationToEdit}
                    />
                </div>
            </div>
        </div>
    );
}