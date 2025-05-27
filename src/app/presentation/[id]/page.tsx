import { notFound } from 'next/navigation';
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

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    try {
        const { id } = await params;
        const presentation = await getPresentationById(id);

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
                        <BuyButton href={`/buy/${presentation.idPresentation}`}  />
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
    } catch (error) {
        console.log(error)
        notFound();
    }
}