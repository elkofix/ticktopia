'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function LoginComponent() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = await login(credentials.email, credentials.password);
      
      if (userData) {
        router.push('/');
      }
    } catch (err) {
      // Error is already handled by the useAuth hook
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand to-violet flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido a
          </h1>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-brand to-violet bg-clip-text text-transparent">
            Ticktopia
          </h2>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand to-violet text-white py-3 px-4 rounded-lg font-semibold hover:from-violet hover:to-brand transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Entrar a mi cuenta'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <a 
              href="/auth/register" 
              className="text-brand hover:text-violet font-semibold transition-colors"
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}