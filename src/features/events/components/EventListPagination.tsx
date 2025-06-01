interface EventListPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  hasMoreData: boolean;
  loading: boolean;
  onLoadMore: () => void;
  onPageChange: (page: number) => void;
}

export function EventListPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  hasMoreData,
  loading,
  onLoadMore,
  onPageChange,
}: EventListPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4"data-testid="pagination-container">
      {/* Load More Button */}
      <div className="flex-1">
        {hasMoreData && (
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-accent-sandyBrown hover:bg-accent-sunglow text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Cargar Más'}
          </button>
        )}
      </div>

      {/* Page Numbers */}
      <div className="flex items-center space-x-2">
        <button
  aria-label="Previous page"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-brand text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
  aria-label="Next page"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Items Count */}
      <div className="flex-1 text-right">
        <span className="text-sm text-gray-500">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
        </span>
      </div>
    </div>
  );
}