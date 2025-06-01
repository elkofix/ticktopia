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
          
          <div className="space-y-2">
            {/* ... existing date and location elements ... */}
            
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
        
        {/* ... existing action button ... */}
      </div>
    </div>
  );
}