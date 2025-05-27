'use client'

import { useAuth } from "@/features/auth/hooks/useAuth"
import { User, LogOut, LogIn, UserPlus, Ticket, Calendar, Shield, Settings, Menu, X, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { NavigationItem } from "../types/navigation"

const NAVIGATION_CONFIG: NavigationItem[] = [
    {
        label: "Mis Tickets",
        href: "/user/my-tickets",
        icon: Ticket,
        roles: ["client"],
        priority: 1
    },
    {
        label: "Panel Admin",
        href: "/admin",
        icon: Shield,
        roles: ["admin"],
        priority: 1
    },
    {
        label: "Gestionar Eventos",
        href: "/events/manage",
        icon: Calendar,
        roles: ["event-manager", "admin"],
        priority: 2
    },
    {
        label: "Validar Tickets",
        href: "/tickets/validate",
        icon: Ticket,
        roles: ["ticketChecker", "admin"],
        priority: 3
    },
    {
        label: "Configuración",
        href: "/settings",
        icon: Settings,
        roles: ["admin", "event-manager"],
        priority: 4
    }
]

export default function TopBar() {
    const { user, isAuthenticated, logout, hasAnyRole } = useAuth()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDesktopDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

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

    const handleNavigate = (href: string) => {
        router.push(href)
        setIsMobileMenuOpen(false)
        setIsDesktopDropdownOpen(false)
    }

    // Filtrar y ordenar items de navegación basados en roles del usuario
    const availableNavItems = NAVIGATION_CONFIG
        .filter(item => hasAnyRole(item.roles))
        .sort((a, b) => (a.priority || 999) - (b.priority || 999))

    return (
        <header className="bg-white shadow-md border-b border-gray-100 relative z-50" style={{ zIndex: 999 }}>
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

                    {/* Navigation & Auth Section */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && availableNavItems.length > 0 && (
                            <>
                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden inline-flex items-center justify-center p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                >
                                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                                </button>
                            </>
                        )}

                        {/* User Section */}
                        {isAuthenticated ? (
                            <div className="flex items-center flex-row space-x-3">
                                {/* User Info */}
                                <div className="hidden sm:flex flex-row items-center bg-gray-50 rounded-lg px-3 py-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            Usuario
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                
                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    <span className="hidden sm:inline">Cerrar Sesión</span>
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
                                    <span className="hidden sm:inline">Iniciar Sesión</span>
                                </button>

                                {/* Register Button */}
                                <button
                                    onClick={handleRegister}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-brand to-violet hover:from-violet hover:to-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <UserPlus size={16} className="mr-2" />
                                    <span className="hidden sm:inline">Registrarse</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu - Ahora es absoluto y no afecta el flujo del documento */}
            {isAuthenticated && isMobileMenuOpen && (
                <div className="md:hidden absolute w-full bg-white shadow-lg border-b border-gray-200 z-40">
                    <div className="px-4 py-3 space-y-1">
                        {availableNavItems.map((item, index) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.href}
                                    onClick={() => handleNavigate(item.href)}
                                    style={{ animationDelay: `${index * 75}ms` }}
                                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                                >
                                    <Icon size={16} className="mr-3" />
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </header>
    )
}