"use server"
import { notFound } from 'next/navigation';
import EditEventCard from '@/features/events/components/EditEventCard';
import { getEventData, getEventDataManager } from '@/features/events/events.api';

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    try {
        console.log("fasf")
        const { id } = await params;
        console.log(id);
        const { event, presentations } = await getEventDataManager(id);
        console.log(event)
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Editar Evento
                            </h1>
                            <p className="text-gray-600">
                                Modifica la información de tu evento o elimínalo si ya no lo necesitas.
                            </p>
                        </div>
                        
                        <EditEventCard event={event} />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.log(error);
        notFound();
    }
}