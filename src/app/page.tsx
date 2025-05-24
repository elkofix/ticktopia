
import { getEvents } from "@/features/events/events.api";
import EventList from "../features/events/components/EventList";

export default async function HomePage() {
  const initialEvents = await getEvents({ limit: 10, offset: 0 });

  return (
    <main className="p-8">
      <EventList initialEvents={initialEvents} />
    </main>
  );
}