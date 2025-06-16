export function EventListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-testid="skeleton-container">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse" data-testid="skeleton-item">
          <div className="h-48 bg-gray-200" data-testid="skeleton-image"></div>
          <div className="p-4" data-testid="skeleton-content">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" data-testid="skeleton-title"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" data-testid="skeleton-subtitle"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4" data-testid="skeleton-meta"></div>
          </div>
        </div>
      ))}
    </div>
  );
}