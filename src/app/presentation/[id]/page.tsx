"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPresentationById } from '@/features/presentations/presentation.api';
import { BuyButton } from '@/features/presentations/components/ByuButton';
import Image from 'next/image';
import { HeroSection } from '@/features/presentations/components/HeroSection';
import { formateDate } from '@/shared/utils/dates';
import { LocationMap } from '@/features/presentations/components/LocationMap';
import { PaymentMethods } from '@/features/presentations/components/PaymentMethod';
import { PriceCard } from '@/features/presentations/components/PriceCard';
import { DescriptionSection } from '@/features/presentations/components/DescriptionSection';
import { EventInfoCard } from '@/features/events/components/EventInfoCard';
import ErrorHandler from '@/shared/components/ErrorHandler';

// Tipo para la presentación (ajusta según tu interface)
interface Event {
  name: string;
  bannerPhotoUrl: string;
}

interface Presentation {
  idPresentation: string;
  startDate: string;
  place: string;
  city: string;
  price: number;
  description: string;
  latitude: number;
  longitude: number;
  event: Event;
}

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

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Skeleton del Hero Section */}
        <div className="h-96 bg-gray-300 animate-pulse"></div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Skeleton del botón */}
          <div className="flex justify-center my-12">
            <div className="w-48 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>

          {/* Skeleton del grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="h-96 bg-gray-300 rounded-xl animate-pulse"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="h-24 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton del contenido */}
          <div className="space-y-6">
            <div className="h-32 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-24 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return <ErrorHandler message={error} />;
  }

  // Validación de que exista la presentación
  if (!presentation) {
    return <ErrorHandler message="No se encontró la presentación" />;
  }

  const startDate = formateDate(presentation.startDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        bannerPhotoUrl={presentation.event.bannerPhotoUrl}
        eventName={presentation.event.name}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Primer botón de compra */}
        <div className="flex justify-center my-12">
          <BuyButton href={`/buy/${presentation.idPresentation}`} />
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Banner */}
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={presentation.event.bannerPhotoUrl}
              alt={presentation.event.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Sección derecha */}
          <div className="space-y-6">
            <EventInfoCard
              eventName={presentation.event.name}
              formattedDate={startDate}
              place={presentation.place}
              city={presentation.city}
            />

            <PriceCard price={presentation.price} />
          </div>
        </div>
        
        <div className="flex justify-center my-12">
          <BuyButton href={`/buy/${presentation.idPresentation}`} />
        </div>

        <DescriptionSection description={presentation.description} />
        <PaymentMethods />
        <LocationMap
          latitude={presentation.latitude}
          longitude={presentation.longitude}
        />
      </div>
    </div>
  );
}