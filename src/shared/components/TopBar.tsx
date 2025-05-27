'use client'

import { useAuth } from "@/features/auth/login/hooks/useAuth"
import { User, LogOut, LogIn, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TopBar() {
    const { user, isAuthenticated, logout } = useAuth()
    const router = useRouter()

    const handleLogin = () => {
        router.push('/auth/login')
    }

    const handleRegister = () => {
        router.push('/auth/register')
    }

    const handleLogout = async () => {
        await logout()
        router.push('/')
    }

    return (
        <header className="bg-white shadow-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand via-violet to-wisteria bg-clip-text text-transparent">
                                TickTopia
                            </h1>
                        </div>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {/* User Info */}
                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-white" />
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-medium text-gray-900">
                                            {'Usuario'}
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Cerrar Sesión
                                </button>

                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                {/* Login Button */}
                                <button
                                    onClick={handleLogin}
                                    className="inline-flex items-center px-4 py-2 border-2 border-indigo-600 text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                                >
                                    <LogIn size={16} className="mr-2" />
                                    Iniciar Sesión
                                </button>

                                {/* Register Button */}
                                <button
                                    onClick={handleRegister}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-brand to-violet hover:from-violet hover:to-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <UserPlus size={16} className="mr-2" />
                                    Registrarse
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}