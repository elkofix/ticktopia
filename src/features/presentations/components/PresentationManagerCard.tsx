"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Presentation } from '@/shared/types/presentation';
import { formateDate } from '@/shared/utils/dates';

interface PresentationManagerCardProps {
  presentation: Presentation;
  bannerPhotoUrl: string;
  eventName: string;
}

export function PresentationManagerCard({ 
  presentation, 
  bannerPhotoUrl, 
  eventName 
}: PresentationManagerCardProps) {
  return (
    <div className="group flex flex-col md:flex-row bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Presentation Banner */}
      <div className="relative w-full h-40 md:w-48 md:h-32 lg:w-56 lg:h-36 flex-shrink-0">
        <Image
          src={bannerPhotoUrl}
          alt={eventName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 200px, 250px"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-presentation.jpg';
          }}
        />
      </div>

      {/* Presentation Info */}
      <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
            {eventName}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m3 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v1m16 0v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7h16z" />
              </svg>
              <span className="font-medium">{formateDate(presentation.startDate)}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{presentation.city}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{presentation.capacity} asientos</span>
            </div>

            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="font-semibold text-green-600">${presentation.price?.toLocaleString()}</span>
            </div>
          </div>

          {presentation.description && (
            <p className="text-sm text-gray-500 mt-3 line-clamp-2">
              {presentation.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 flex-shrink-0 self-end md:self-center min-w-[150px]">
          <Link 
            href={`/presentation/${presentation.idPresentation}`}
            className="inline-block"
          >
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 w-full text-center text-sm">
              Ver Presentación
            </button>
          </Link>
          
          <Link 
            href={`/event-manager/presentation/manage/${presentation.event.id}?editId=${presentation.idPresentation}`}
            className="inline-block"
          >
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 w-full text-center text-sm border border-gray-300">
              Editar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}