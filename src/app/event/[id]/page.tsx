"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EventDetailBanner from '@/features/events/components/EventDetailBanner';
import EventPresentationsList from '@/features/events/components/EventPresentationList';
import { getPresentationsByEventId } from '@/features/presentations/presentation.api';
import ErrorHandler from '@/shared/components/ErrorHandler';
import { Presentation } from '@/shared/types/presentation';


export default function Page() {
  const params = useParams();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const id = params.id as string;
        const presentationsData = await getPresentationsByEventId(id);
        setPresentations(presentationsData);
      } catch (err: any) {
        console.error('Error fetching presentations:', err);
        setError(err?.response?.data?.message ?? "Error obteniendo las presentaciones");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPresentations();
    }
  }, [params.id]);

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evento...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return <ErrorHandler message={error} />;
  }

  // Validación de que existan presentaciones
  if (!presentations || presentations.length === 0) {
    return <ErrorHandler message="No se encontraron presentaciones para este evento" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Banner Component */}
      <EventDetailBanner event={presentations[0].event} />

      {/* Event Presentations List Component */}
      <EventPresentationsList 
        presentations={presentations} 
        bannerPhotoUrl={presentations[0].event.bannerPhotoUrl} 
        name={presentations[0].event.name} 
      />
    </div>
  );
}