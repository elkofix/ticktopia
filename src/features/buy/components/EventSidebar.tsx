interface EventSidebarProps {
  event: {
    name: string;
    bannerPhotoUrl: string;
  };
  place: string;
  city: string;
  startDate: string;
}

export default function EventSidebar({ event, place, city, startDate }: EventSidebarProps) {
  return (
    <div className="sticky top-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-white" style={{ marginTop: '-2rem' }}>
        <div className="relative">
          <img
            src={event.bannerPhotoUrl}
            alt={event.name}
            className="w-full h-48 object-cover"
          />
        </div>
        
        <div className="p-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {event.name}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Lugar</p>
              <p className="font-medium text-gray-900">{place}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Ciudad</p>
              <p className="font-medium text-gray-900">{city}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Fecha y Hora</p>
              <p className="font-medium text-gray-900">{startDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

