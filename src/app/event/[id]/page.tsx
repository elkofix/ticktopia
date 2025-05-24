import { notFound } from 'next/navigation';
import EventDetailBanner from '@/features/events/components/EventDetailBanner';
import EventPresentationsList from '@/features/events/components/EventPresentationList';
import { getPresentationsByEventId } from '@/features/presentations/presentation.api';


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const { id } = await params

    const presentations  = await getPresentationsByEventId(id);
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Event Banner Component */}
        <EventDetailBanner event={presentations[0].event} />

        {/* Event Presentations List Component */}
        <EventPresentationsList presentations={presentations} bannerPhotoUrl={presentations[0].event.bannerPhotoUrl} name={presentations[0].event.name} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}