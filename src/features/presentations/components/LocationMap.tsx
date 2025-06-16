export function LocationMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md mb-12"
      data-testid="location-map-container"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Ubicación</h2>
      <div
        className="h-96 w-full rounded-lg overflow-hidden"
        data-testid="map-container"
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
          title="Ubicación del evento"
          data-testid="map-iframe"
        ></iframe>
      </div>
    </div>
  );
}