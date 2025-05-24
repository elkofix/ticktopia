import Image from 'next/image';
import Link from 'next/link';
import { Presentation } from '@/shared/types/presentation';

interface PresentationCardProps {
  presentation: Presentation;
  bannerPhotoUrl: string;
  name: string;
}

export default function PresentationCard({ presentation, bannerPhotoUrl, name }: PresentationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="group flex bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:bg-gray-100">
      {/* Presentation Banner */}
      <div className="relative w-48 h-32 flex-shrink-0">
        <Image
          src={bannerPhotoUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fill
          sizes="200px"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-presentation.jpg';
          }}
        />
      </div>

      {/* Presentation Info */}
      <div className="flex-1 p-6 flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand transition-colors">
            {name}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m3 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v1m16 0v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7h16z" />
              </svg>
              <span className="text-sm font-medium">{formatDate(presentation.startDate)}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">
                <span className="text-gray-400 mx-1">•</span>
                <span>{presentation.city}</span>
              </span>
            </div>

            {/* Additional info if available */}
            {presentation.description && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {presentation.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Action Button */}
        <div className="ml-6">
          <Link href={`/presentation/${presentation.idPresentation}`}>
            <button className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-dark transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
              Ver Presentación
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}