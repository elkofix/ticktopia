import { User } from "lucide-react"; 
export const UserInfo = ({ email }: { email?: string }) => (
  <div className="flex items-center">
    {/* Ícono solo visible en pantallas pequeñas */}
    <div className="flex sm:invisible items-center justify-center p-2 rounded-full bg-gray-200">
      <User className="h-5 w-5 text-gray-600" />
    </div>

  </div>
);
