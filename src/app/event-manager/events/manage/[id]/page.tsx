"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EditEventCard from '@/features/events/components/EditEventCard';
import Link from 'next/link';
import { PresentationManagerCard } from '@/features/presentations/components/PresentationManagerCard';
import ErrorHandler from '@/shared/components/ErrorHandler';
import { getEventDataManager } from '@/features/events/events.client.api';
import { Event } from '@/shared/types/event';
import { Presentation } from '@/shared/types/presentation';


interface EventData {
    event: Event;
    presentations: Presentation[];
}

export default function EditEventPage() {
    const params = useParams();
    const id = params.id as string;
    
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                const data = await getEventDataManager(id);
                setEventData(data);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Error al cargar los datos del evento');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando datos del evento...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <ErrorHandler message={error} />;
    }

    if (!eventData) {
        return <ErrorHandler message="No se pudo cargar la información del evento" />;
    }

    const { event, presentations } = eventData;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Editar Evento
                        </h1>
                        <p className="text-gray-600">
                            Modifica la información de tu evento o elimínalo si ya no lo necesitas.
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto mb-8">
                        <EditEventCard event={event} />
                    </div>

                    {/* Sección de Presentaciones */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Presentaciones
                            </h2>
                            <Link
                                href={`/event-manager/presentation/manage/${id}`}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Crear Presentación
                            </Link>
                        </div>

                        {presentations && presentations.length > 0 ? (
                            <div className="space-y-4">
                                {presentations.map((presentation) => (
                                    <PresentationManagerCard
                                        key={presentation.idPresentation}
                                        presentation={presentation}
                                        bannerPhotoUrl={event.bannerPhotoUrl || '/placeholder-presentation.jpg'}
                                        eventName={event.name}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m3 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v1m16 0v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7h16z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No hay presentaciones
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Crea tu primera presentación para este evento
                                </p>
                                <Link
                                    href={`/event-manager/presentation/manage/${id}`}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Crear Presentación
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}