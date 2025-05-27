import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/shared/types/event';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface EventCardProps {
  event: Event;
  showControls?: boolean;
}

export function EventCard({ event, showControls = false }: EventCardProps) {
  const { hasRole } = useAuth();
  
  // Solo mostrar controles si showControls es true Y el usuario es event-manager
  const shouldShowManagerControls = showControls && hasRole('event-manager');
  
  // Determinar la URL y el texto del botón
  const buttonText = shouldShowManagerControls ? 'Gestionar evento' : 'Ver Evento';
  const eventUrl = shouldShowManagerControls 
    ? `/event-manager/events/manage/${event.id}` 
    : `/event/${event.id}`;

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
          <Link href={eventUrl}>
            <button 
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                shouldShowManagerControls
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-brand text-white hover:bg-brand'
              }`}
            >
              {shouldShowManagerControls && (
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}