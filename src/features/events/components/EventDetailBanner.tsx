"use client"
import Image from 'next/image';
import { Event } from '@/shared/types/event';

interface EventDetailBannerProps {
  event: Event;
}

export default function EventDetailBanner({ event }: EventDetailBannerProps) {
  return (
    <div className="relative h-96 overflow-hidden" data-testid="event-detail-banner">
      <Image
        src={event.bannerPhotoUrl}
        alt={event.name}
        className="w-full h-full object-cover"
        fill
        sizes="100vw"
        priority
        onError={(e) => {
          e.currentTarget.src = '/placeholder-event.jpg';
        }}
        data-testid="event-banner-image"
      />
      
      {/* Dark overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40"
        data-testid="banner-overlay"
      ></div>
      
      {/* Event Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Event Status Badge */}
          <div className="flex items-center space-x-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.isPublic
                  ? 'bg-green-500 bg-opacity-80 text-white'
                  : 'bg-gray-500 bg-opacity-80 text-white'
              }`}
              data-testid="event-status-badge"
            >
              {event.isPublic ? 'Público' : 'Privado'}
            </span>
          </div>
          
          {/* Event Title */}
          <h1 
            className="text-4xl font-bold mb-6"
            data-testid="event-title"
          >
            {event.name}
          </h1>
          
          {/* Organizer Info */}
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
              data-testid="organizer-avatar"
            >
              <span className="text-white text-lg font-medium">
                {event.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p 
                className="text-lg font-medium"
                data-testid="organizer-name"
              >
                {event.user.name} {event.user.lastname}
              </p>
              <p 
                className="text-gray-200"
                data-testid="organizer-label"
              >
                Organizador
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}