export default function LoadingSpinner() {
    return (
        <div 
            className="flex justify-center items-center py-8"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div 
                data-testid="loading-spinner"
                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            />
        </div>
    );
}