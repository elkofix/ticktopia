export default function EmptyPresentationsState() {
  return (
    <div 
      className="text-center py-12"
      data-testid="empty-presentations-container"
    >
      <div 
        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        data-testid="icon-container"
      >
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          data-testid="calendar-icon"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v14a1 1 0 01-1 1H8a1 1 0 01-1-1V4z"
            data-testid="calendar-icon-path"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No hay presentaciones disponibles
      </h3>
      <p className="text-gray-500">
        Las presentaciones aparecerán aquí cuando el organizador las publique.
      </p>
    </div>
  );
}