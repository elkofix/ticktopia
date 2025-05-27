"use server"
import { notFound } from 'next/navigation';
import { getEventDataManager } from '@/features/events/events.api';
import { getPresentationById } from '@/features/presentations/presentation.api';
import { PresentationForm } from '@/features/presentations/components/PresentationForm';

export default async function PresentationManagePage({
    params,
    searchParams,
}: {
    params: Promise<{ eventId: string }>
    searchParams: Promise<{ editId?: string }>
}) {
    try {
        const { eventId } = await params;
        const { editId } = await searchParams;
        
        const { event } = await getEventDataManager(eventId);
        
        let presentationToEdit = null;
        if (editId) {
            try {
                presentationToEdit = await getPresentationById(editId);
            } catch (error) {
                console.log('Error getting presentation:', error);
            }
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
    } catch (error) {
        console.log(error);
        notFound();
    }
}