export function PriceCard({ price }: { price: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-700">Asiento General</span>
        <span className="text-xl font-bold text-blue-600">${price.toFixed(2)}</span>
      </div>
    </div>
  );
}