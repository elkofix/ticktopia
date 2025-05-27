import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

export const ProfileEditForm = ({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  isLoading 
}: {
  formData: { name: string; lastname: string; email: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <Input
      label="Nombre"
      id="name"
      name="name"
      value={formData.name}
      onChange={onChange}
      required
    />
    <Input
      label="Apellido"
      id="lastname"
      name="lastname"
      value={formData.lastname}
      onChange={onChange}
      required
    />
    <Input
      label="Email"
      id="email"
      name="email"
      type="email"
      value={formData.email}
      onChange={onChange}
      required
    />
    
    <div className="flex space-x-4 pt-4">
      <Button 
        type="submit" 
        variant="primary" 
        disabled={isLoading}
      >
        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
      <Button 
        type="button" 
        variant="secondary" 
        onClick={onCancel}
      >
        Cancelar
      </Button>
    </div>
  </form>
)