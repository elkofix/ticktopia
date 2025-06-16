'use client';

import { Event } from '@/shared/types/event';
import { useState } from 'react';
import { getEvents } from '../events.api';
import { EventCard } from './EventCard';
import { EventListEmptyState } from './EventListEmptyState';
import { EventListPagination } from './EventListPagination';
import { EventListSkeleton } from './EventListSkeleton';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface EventListProps {
  initialEvents: Event[];
  itemsPerPage?: number;
  showControls?: boolean;
}

export default function EventList({
  initialEvents,
  itemsPerPage = 10,
  showControls = false
}: EventListProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { hasRole } = useAuth();

  const shouldChangeTitle = showControls && hasRole('event-manager');

  const loadEvents = async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const newEvents = await getEvents({
        limit: itemsPerPage,
        offset
      });

      if (page === 1) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }

      setHasMoreData(newEvents.length === itemsPerPage);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadEvents(nextPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadEvents(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const currentEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{shouldChangeTitle? "Mis Eventos" : "Eventos Disponibles"}</h2>
        <p className="text-gray-600">{shouldChangeTitle? "Aqui encontraras los eventos que te pertenecen  " : "Descubre los mejores eventos cerca de ti"}</p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            showControls={showControls}
          />
        ))}
      </div>

      {/* Loading State */}
      {loading && <EventListSkeleton />}

      {/* Empty State */}
      {events.length === 0 && !loading && <EventListEmptyState />}

      {/* Pagination */}
      {events.length > 0 && (
        <EventListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={events.length}
          hasMoreData={hasMoreData}
          loading={loading}
          onLoadMore={handleLoadMore}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}