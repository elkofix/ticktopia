export function PriceCard({ price }: { price: number }) {
  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-md"
      data-testid="price-card"
    >
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-700">Asiento General</span>
        <span data-testid="presentation-price" className="text-xl font-bold text-blue-600">${price.toFixed(2)}</span>
      </div>
    </div>
  );
}