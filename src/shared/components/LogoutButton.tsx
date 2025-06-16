import { LogOut } from "lucide-react";

export const LogoutButton = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
    >
        <LogOut size={16} className="sm:mr-2" />
    </button>
)