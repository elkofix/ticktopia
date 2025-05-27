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
import { getEventDataManager } from '@/features/events/events.api';

export default async function Page({
    params,
}: {
    params: Promise<{ eventId: string }>
}) {
    try {
        const { eventId } = await params;
        const { event } = await getEventDataManager(eventId);
        return (
    
        );
    } catch (error) {
        console.log(error)
        notFound();
    }
}