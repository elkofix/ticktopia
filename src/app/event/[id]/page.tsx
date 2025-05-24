import { notFound } from 'next/navigation';
import { Event } from '@/shared/types/event';
import { Presentation } from '@/shared/types/presentation';
import { getEventData, getEvents } from '@/features/events/events.api';
import EventDetailBanner from '@/features/events/components/EventDetailBanner';
import EventPresentationsList from '@/features/events/components/EventPresentationList';


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const { id } = await params

    const { event, presentations } = await getEventData(id);
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Event Banner Component */}
        <EventDetailBanner event={event} />

        {/* Event Presentations List Component */}
        <EventPresentationsList presentations={presentations} bannerPhotoUrl={event.bannerPhotoUrl} name={event.name} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}