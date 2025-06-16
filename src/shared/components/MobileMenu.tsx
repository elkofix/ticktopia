import { NavigationItem } from "../types/navigation";
import { NavigationItems } from "./NavigationItems";

export const MobileMenu = ({
    isOpen,
    items,
    onNavigate
}: {
    isOpen: boolean;
    items: NavigationItem[];
    onNavigate: (href: string) => void;
}) => (
    isOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg border-b border-gray-200 z-40">
            <div className="px-4 py-3">
                <NavigationItems items={items} onNavigate={onNavigate} />
            </div>
        </div>
    )
)