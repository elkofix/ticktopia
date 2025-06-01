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
  
  const shouldShowManagerControls = showControls && hasRole('event-manager');
  
  const buttonText = shouldShowManagerControls ? 'Gestionar evento' : 'Ver Evento';
  const eventUrl = shouldShowManagerControls 
    ? `/event-manager/events/manage/${event.id}` 
    : `/event/${event.id}`;

  return (
    <div 
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
      data-testid="event-card"
    >
      {/* Event Banner */}
      <div className="relative h-48 overflow-hidden flex-shrink-0" data-testid="event-banner">
        <Image
          src={event.bannerPhotoUrl}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-event.jpg';
          }}
          data-testid="event-image"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3" data-testid="event-status">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              event.isPublic
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
            data-testid="event-status-badge"
          >
            {event.isPublic ? 'Público' : 'Privado'}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6 flex flex-col flex-grow" data-testid="event-content">
        <h3 
          className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand transition-colors line-clamp-2"
          data-testid="event-title"
        >
          {event.name}
        </h3>

        {/* Organizer Info */}
        <div className="flex items-center space-x-3 mb-4 flex-grow" data-testid="organizer-info">
          <div 
            className="w-8 h-8 bg-gradient-to-r from-brand to-wisteria rounded-full flex items-center justify-center flex-shrink-0"
            data-testid="organizer-avatar"
          >
            <span className="text-white text-sm font-medium">
              {event.user.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate" data-testid="organizer-name">
              {event.user.name} {event.user.lastname}
            </p>
            <p className="text-xs text-gray-500" data-testid="organizer-label">Organizador</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto" data-testid="action-button-container">
          <Link href={eventUrl} passHref>
            <button 
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                shouldShowManagerControls
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-brand text-white hover:bg-brand'
              }`}
              data-testid="event-action-button"
            >
              {shouldShowManagerControls && (
                <svg 
                  className="w-4 h-4 mr-2 inline" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  data-testid="settings-icon"
                >
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