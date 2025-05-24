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
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-900">{eventName}</h1>
      <p className="text-gray-600 mt-2">{formattedDate}</p>
      <div className="border-t border-gray-200 my-4"></div>
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="font-semibold">Lugar:</span> {place}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Ciudad:</span> {city}
        </p>
      </div>
    </div>
  );
}