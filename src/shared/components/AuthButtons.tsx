import { LogIn, UserPlus } from "lucide-react";

export const AuthButtons = ({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) => (
    <div className="flex items-center space-x-3">
        <button
            onClick={onLogin}
            className="inline-flex items-center px-4 py-2 border-2 border-indigo-600 text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
            <LogIn size={16} className="mr-2" />
            <span className="hidden sm:inline">Iniciar Sesión</span>
        </button>

        <button
            onClick={onRegister}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-brand to-violet hover:from-violet hover:to-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all duration-200 shadow-sm hover:shadow-md"
        >
            <UserPlus size={16} className="mr-2" />
            <span className="hidden sm:inline">Registrarse</span>
        </button>
    </div>
)