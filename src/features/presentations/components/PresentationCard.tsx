import Image from 'next/image';
import Link from 'next/link';
import { Presentation } from '@/shared/types/presentation';
import { formateDate } from '@/shared/utils/dates';

interface PresentationCardProps {
  presentation: Presentation;
  bannerPhotoUrl: string;
  name: string;
}

export default function PresentationCard({ presentation, bannerPhotoUrl, name }: PresentationCardProps) {
  return (
    <div
      className="group flex flex-col md:flex-row bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:bg-gray-100"
      data-testid="presentation-card"
    >
      {/* Presentation Banner */}
      <div
        className="relative w-full h-40 md:w-48 md:h-32 lg:w-56 lg:h-36 flex-shrink-0"
        data-testid="image-container"
      >
        <Image
          src={bannerPhotoUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 200px, 250px"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-presentation.jpg';
          }}
          data-testid="presentation-image"
        />
      </div>

      {/* Presentation Info */}
      <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-brand transition-colors line-clamp-1">
            {name}
          </h3>

          <div className="space-y-2" >
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m3 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v1m16 0v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7h16z" />
              </svg>
              <span className="text-sm font-medium line-clamp-1" data-testid="presentation-date">{formateDate(presentation.startDate)}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm line-clamp-1">
                <span className="text-gray-400 mx-1 hidden md:inline">•</span>
                <span data-testid="presentation-location">{presentation.city}</span>
              </span>
            </div>

            {presentation.description && (
              <p
                className="text-sm text-gray-500 mt-2 line-clamp-2"
                data-testid="presentation-description"
              >
                {presentation.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Button - Ajustado para no cortarse */}
        <div className="flex-shrink-0 self-end md:self-center">
          <Link href={`/presentation/${presentation.idPresentation}`} className="inline-block min-w-[150px]"  data-testid="presentation-link">
            <button className="bg-brand text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-dark transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md w-full text-center">
              Ver Presentación
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}