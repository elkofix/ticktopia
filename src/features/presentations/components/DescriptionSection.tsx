export function DescriptionSection({ description }: { description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
      <p className="text-gray-700 whitespace-pre-line">{description}</p>
    </div>
  );
}
