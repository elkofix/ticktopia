'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPresentationById } from '@/features/presentations/presentation.api';
import { formateDate } from '@/shared/utils/dates';
import EventSidebar from '@/features/buy/components/EventSidebar';
import { DescriptionSection } from '@/features/presentations/components/DescriptionSection';
import { PaymentMethods } from '@/features/presentations/components/PaymentMethod';
import TicketSelector from '@/features/buy/components/TicketSelector';
import ErrorHandler from '@/shared/components/ErrorHandler';
import { Presentation } from '@/shared/types/presentation';


export default function Page() {
    const params = useParams();
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPresentation = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const id = params.id as string;
                const presentationData = await getPresentationById(id);
                setPresentation(presentationData);
            } catch (err: any) {
                console.error('Error fetching presentation:', err);
                setError(err?.response?.data?.message ?? "Error obteniendo la presentación");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPresentation();
        }
    }, [params.id]);

    // Estados de carga y error
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando presentación...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <ErrorHandler message={error} />;
    }

    if (!presentation) {
        return <ErrorHandler message="No se encontró la presentación" />;
    }

    const startDate = formateDate(presentation.startDate);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contenido principal */}
                    <div className="lg:col-span-2">
                        <TicketSelector
                            capacity={presentation.capacity}
                            price={presentation.price}
                            presentationId={presentation.idPresentation}
                        />

                        <DescriptionSection description={presentation.description} />

                        <PaymentMethods />
                    </div>

                    {/* Sidebar del evento */}
                    <div className="lg:col-span-1">
                        <EventSidebar
                            event={presentation.event}
                            place={presentation.place}
                            city={presentation.city}
                            startDate={startDate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}