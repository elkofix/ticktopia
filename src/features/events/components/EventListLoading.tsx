export function EventListLoading() {
  return (
    <div className="flex justify-center mb-8" role="status">
      <div 
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"
        data-testid="loading-spinner"
        aria-live="polite"
        aria-busy="true"
      ></div>
    </div>
  );
}