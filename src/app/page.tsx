
import { getEvents } from "@/features/events/events.api";
import EventList from "../features/events/components/EventList";
import EventsHeroSection from "@/features/events/components/EventHeroSection";

export default async function HomePage() {
  const initialEvents = await getEvents({ limit: 10, offset: 0 });

  return (
    <main className="">
      {/* Hero Section con carrusel de banners */}
      <EventsHeroSection events={initialEvents} />
      
      {/* Lista de eventos */}
      <div className="mt-8">
        <EventList initialEvents={initialEvents} />
      </div>
    </main>
  );
}