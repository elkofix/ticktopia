'use client'

import { useAuth } from "@/features/auth/hooks/useAuth"
import { User, LogOut, LogIn, UserPlus, Ticket, Calendar, Shield, Settings, Menu, X, ChevronDown, Camera, CalendarHeart, Users, FileChartColumn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { NavigationItem } from "../types/navigation"
import Link from "next/link"
import { Logo } from "./Logo"
import { MobileMenuButton } from "./MobileMenuButton"
import { UserInfo } from "./UserInfo"
import { LogoutButton } from "./LogoutButton"
import { AuthButtons } from "./AuthButtons"
import { MobileMenu } from "./MobileMenu"

const NAVIGATION_CONFIG: NavigationItem[] = [
    {
        label: "Mis Tickets",
        href: "/client/my-tickets",
        icon: Ticket,
        roles: ["client"],
        priority: 1
    },
    {
        label: "Mi historial",
        href: "/client/my-historic",
        icon: Calendar,
        roles: ["client"],
        priority: 1
    },
    {
        label: "Checker",
        href: "/ticket-checker/reedem",
        icon: Camera,
        roles: ["ticketChecker"],
        priority: 1
    },
    {
        label: "Mis eventos",
        href: "/event-manager/events",
        icon: CalendarHeart,
        roles: ["event-manager"],
        priority: 1
    },

    {
        label: "Usuarios",
        href: "/admin/users",
        icon: Users,
        roles: ["admin"],
        priority: 1
    },
    {
        label: "Perfil",
        href: "/profile",
        icon: User,
        roles: ["admin", "client", "event-manager", "ticketChecker"],
        priority: 2
    },
    {
        label: "Reportes",
        href: "/admin/reports",
        icon: FileChartColumn,
        roles: ["admin"],
        priority: 2
    },
]

export default function TopBar() {
    const { user, isAuthenticated, logout, hasAnyRole } = useAuth()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

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

    const handleLogin = () => router.push('/auth/login')
    const handleRegister = () => router.push('/auth/register')
    const handleLogout = async () => {
        await logout()
        router.push('/')
    }

    const handleNavigate = (href: string) => {
        router.push(href)
        setIsMobileMenuOpen(false)
        setIsDesktopDropdownOpen(false)
    }

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
                            <Logo />
                        </div>
                    </div>

                    {/* Navigation & Auth Section */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && availableNavItems.length > 0 && (
                            <MobileMenuButton
                                isOpen={isMobileMenuOpen}
                                toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            />
                        )}

                        {/* User Section */}
                        {isAuthenticated ? (
                            <div className="flex items-center flex-row space-x-3">
                                <UserInfo email={user?.email} />
                                <LogoutButton onClick={handleLogout} />
                            </div>
                        ) : (
                            <AuthButtons onLogin={handleLogin} onRegister={handleRegister} />
                        )}
                    </div>
                </div>
            </div>

            <MobileMenu
                isOpen={isMobileMenuOpen && isAuthenticated}
                items={availableNavItems}
                onNavigate={handleNavigate}
            />
        </header>
    )
}