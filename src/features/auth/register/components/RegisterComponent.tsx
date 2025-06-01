'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../auth.api';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterComponent() {
  const [credentials, setCredentials] = useState({
    name: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const router = useRouter();
  const { login, isLoading: isLoggingIn, error: loginError } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setIsRegistering(true);

    try {
      // Registrar al usuario usando la función independiente
      const registerData = await register(
        credentials.email,
        credentials.password,
        credentials.name,
        credentials.lastname
      );

      if (!('error' in registerData)) {
        const userData = await login(credentials.email, credentials.password);

        if (userData) {
          router.push('/');
        }
      } else {
        setRegisterError(registerData.error);
      }
    } catch (err: any) {
      // Error handling for registration
      console.error('Register error:', err);

      // Manejar diferentes tipos de errores
      if (err.response?.data?.message) {
        setRegisterError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setRegisterError(err.response.data.error);
      } else if (err.message) {
        setRegisterError(err.message);
      } else {
        setRegisterError('Error al crear la cuenta. Por favor intenta de nuevo.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand to-violet flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Únete a
          </h1>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-brand to-violet bg-clip-text text-transparent">
            Ticktopia
          </h2>
          <p className="text-gray-600 mt-2">Crea tu cuenta nueva</p>
        </div>

        {/* Error Messages */}
        {(registerError || loginError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {registerError || loginError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={credentials.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-colors outline-none"
              placeholder="Tu nombre"
              disabled={isRegistering || isLoggingIn}
            />
          </div>

          {/* Lastname Field */}
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={credentials.lastname}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-colors outline-none"
              placeholder="Tu apellido"
              disabled={isRegistering || isLoggingIn}
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-colors outline-none"
              placeholder="tu@email.com"
              disabled={isRegistering || isLoggingIn}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-colors outline-none"
              placeholder="••••••••"
              disabled={isRegistering || isLoggingIn}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isRegistering || isLoggingIn}
            className="w-full bg-gradient-to-r from-brand to-violet text-white py-3 px-4 rounded-lg font-semibold hover:from-violet hover:to-brand transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {(isRegistering || isLoggingIn) ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isRegistering ? 'Creando cuenta...' : 'Iniciando sesión...'}
              </div>
            ) : (
              'Crear mi cuenta'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <a
              href="/auth/login"
              className="text-brand hover:text-violet font-semibold transition-colors"
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}