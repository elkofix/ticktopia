import { NavigationItem } from "../types/navigation";

export const NavigationItems = ({
    items,
    onNavigate,
    className = ""
}: {
    items: NavigationItem[];
    onNavigate: (href: string) => void;
    className?: string;
}) => (
    <div className={`space-y-1 ${className}`}>
        {items.map((item, index) => {
            const Icon = item.icon
            return (
                <button
                    key={item.href}
                    onClick={() => onNavigate(item.href)}
                    style={{ animationDelay: `${index * 75}ms` }}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                >
                    <Icon size={16} className="mr-3" />
                    {item.label}
                </button>
            )
        })}
    </div>
)