import { CreditCard, Shield, CheckCircle, Lock } from 'lucide-react';

export function PaymentMethods() {
  const creditCards = [
    {
      name: 'Visa',
      color: 'bg-gradient-to-r from-blue-600 to-blue-700',
      textColor: 'text-white',
      logo: 'VISA'
    },
    {
      name: 'Mastercard',
      color: 'bg-gradient-to-r from-red-500 to-orange-500',
      textColor: 'text-white',
      logo: 'MC',
      circles: true
    }
  ];

  return (
    <div 
      className="bg-white p-8 rounded-2xl shadow-lg mb-12 border border-gray-100"
      data-testid="payment-methods-container"
    >
      <div className="flex items-center mb-6">
        <CreditCard className="w-7 h-7 text-blue-600 mr-3" data-testid="credit-card-icon" />
        <h2 className="text-3xl font-bold text-gray-900">Métodos de Pago</h2>
      </div>
      
      <div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
        data-testid="security-notice"
      >
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-2" data-testid="shield-icon" />
          <p className="text-blue-800 font-medium">
            Aceptamos únicamente tarjetas de crédito para garantizar la seguridad de tu compra
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {creditCards.map((card, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            data-testid="credit-card"
          >
            {/* ... existing card content ... */}
            <div className="bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{card.name}</span>
                <CheckCircle className="w-5 h-5 text-green-500" data-testid="check-circle-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}