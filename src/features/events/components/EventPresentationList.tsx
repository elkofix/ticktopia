"use client"
import EmptyPresentationsState from '@/features/presentations/components/EmptyPresentationState';
import PresentationCard from '@/features/presentations/components/PresentationCard';
import { Presentation } from '@/shared/types/presentation';

interface EventPresentationsListProps {
  presentations: Presentation[];
  bannerPhotoUrl: string;
  name: string;
}

export default function EventPresentationsList({ presentations, bannerPhotoUrl, name}: EventPresentationsListProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="presentations-container">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8" data-testid="presentations-inner-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Presentaciones
          </h2>
          <span className="bg-brand bg-opacity-10 text-brand px-3 py-1 rounded-full text-sm font-medium">
            {presentations.length} {presentations.length === 1 ? 'presentación' : 'presentaciones'}
          </span>
        </div>
        
        {presentations.length === 0 ? (
          <EmptyPresentationsState />
        ) : (
          <div className="space-y-4">
            {presentations.map((presentation) => (
              <PresentationCard 
                key={presentation.idPresentation} 
                bannerPhotoUrl={bannerPhotoUrl} 
                name={name} 
                presentation={presentation} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}