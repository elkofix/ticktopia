export function EventInfoCard({ 
  eventName, 
  formattedDate, 
  place, 
  city 
}: { 
  eventName: string; 
  formattedDate: string; 
  place: string; 
  city: string 
}) {
  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-md"
      data-testid="event-info-card"
    >
      <h1 
        className="text-3xl font-bold text-gray-900"
        data-testid="event-name"
      >
        {eventName}
      </h1>
      <p 
        className="text-gray-600 mt-2"
        data-testid="event-date"
      >
        {formattedDate}
      </p>
      <div 
        className="border-t border-gray-200 my-4"
        data-testid="divider" 
      ></div>
      <div className="space-y-2">
        <p 
          className="text-gray-700"
          data-testid="event-place"
        >
          <span className="font-semibold">Lugar:</span> {place}
        </p>
        <p 
          className="text-gray-700"
          data-testid="event-city"
        >
          <span className="font-semibold">Ciudad:</span> {city}
        </p>
      </div>
    </div>
  );
}