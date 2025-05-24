import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/shared/types/event';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Event Banner */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <Image
          src={event.bannerPhotoUrl}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-event.jpg';
          }}
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              event.isPublic
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {event.isPublic ? 'Público' : 'Privado'}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand transition-colors line-clamp-2">
          {event.name}
        </h3>

        {/* Organizer Info */}
        <div className="flex items-center space-x-3 mb-4 flex-grow">
          <div className="w-8 h-8 bg-gradient-to-r from-brand to-wisteria rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {event.user.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {event.user.name} {event.user.lastname}
            </p>
            <p className="text-xs text-gray-500">Organizador</p>
          </div>
        </div>

        {/* Action Button - Always at bottom */}
        <div className="mt-auto">
          <Link href={`/event/${event.id}`}>
            <button className="w-full bg-brand text-white py-2 px-4 rounded-lg font-medium hover:bg-brand transition-all duration-200 transform hover:scale-105">
              Ver Evento
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}