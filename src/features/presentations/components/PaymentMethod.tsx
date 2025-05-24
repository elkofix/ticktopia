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
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 border border-gray-100">
      <div className="flex items-center mb-6">
        <CreditCard className="w-7 h-7 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Métodos de Pago</h2>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
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
          >
            <div className={`${card.color} p-6 h-40 relative`}>
              {/* Chip simulado */}
              <div className="absolute top-4 left-4 w-8 h-6 bg-yellow-400 rounded opacity-80"></div>
              
              {/* Logo de la tarjeta */}
              <div className="absolute top-4 right-4">
                {card.circles ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full opacity-90"></div>
                    <div className="w-6 h-6 bg-yellow-400 rounded-full -ml-3 opacity-90"></div>
                  </div>
                ) : (
                  <div className={`${card.textColor} font-bold text-lg tracking-wider`}>
                    {card.logo}
                  </div>
                )}
              </div>

              {/* Número de tarjeta simulado */}
              <div className="absolute bottom-8 left-4">
                <div className={`${card.textColor} font-mono text-lg tracking-widest opacity-90`}>
                  •••• •••• •••• ••••
                </div>
              </div>

              {/* Nombre y fecha */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <div className={`${card.textColor} text-sm opacity-80`}>
                  NOMBRE APELLIDO
                </div>
                <div className={`${card.textColor} text-sm opacity-80`}>
                  12/28
                </div>
              </div>

              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:animate-pulse"></div>
            </div>
            
            <div className="bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{card.name}</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
}