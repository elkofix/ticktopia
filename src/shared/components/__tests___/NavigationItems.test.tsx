import { NavigationItem } from "@/shared/types/navigation";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationItems } from "../NavigationItems";

// Mock de un ícono para las pruebas
const MockIcon = () => <div data-testid="mock-icon" />;

describe("NavigationItems", () => {
  // Definimos algunos roles de ejemplo
  const mockRoles = {
    ADMIN: "ADMIN" as Role,
    USER: "USER" as Role,
    GUEST: "GUEST" as Role,
  };

  const mockItems: NavigationItem[] = [
    {
      href: "/home",
      label: "Home",
      icon: MockIcon,
      roles: [mockRoles.USER, mockRoles.ADMIN],
      priority: 1
    },
    {
      href: "/admin",
      label: "Admin",
      icon: MockIcon,
      roles: [mockRoles.ADMIN],
      priority: 2
    },
    {
      href: "/profile",
      label: "Profile",
      icon: MockIcon,
      roles: [mockRoles.USER],
    },
  ];

  const mockOnNavigate = jest.fn();

  it("renderiza todos los items de navegación visibles", () => {
    render(
      <NavigationItems 
        items={mockItems} 
        onNavigate={mockOnNavigate} 
      />
    );

    expect(screen.getAllByTestId("mock-icon")).toHaveLength(mockItems.length);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("llama a onNavigate con el href correcto cuando se hace clic en un item", () => {
    render(
      <NavigationItems 
        items={mockItems} 
        onNavigate={mockOnNavigate} 
      />
    );

    fireEvent.click(screen.getByText("Home"));
    expect(mockOnNavigate).toHaveBeenCalledWith("/home");

    fireEvent.click(screen.getByText("Admin"));
    expect(mockOnNavigate).toHaveBeenCalledWith("/admin");
  });

  it("aplica el className correctamente al contenedor", () => {
    const testClassName = "custom-class";
    render(
      <NavigationItems 
        items={mockItems} 
        onNavigate={mockOnNavigate} 
        className={testClassName}
      />
    );

    const container = screen.getByTestId("navigation-items-container");
    expect(container).toHaveClass("space-y-1");
    expect(container).toHaveClass(testClassName);
  });

  it("aplica el animationDelay de forma progresiva", () => {
    render(
      <NavigationItems 
        items={mockItems} 
        onNavigate={mockOnNavigate} 
      />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button, index) => {
      expect(button).toHaveStyle(`animationDelay: ${index * 75}ms`);
    });
  });


  it("tiene las clases CSS correctas en los botones", () => {
    render(
      <NavigationItems 
        items={mockItems} 
        onNavigate={mockOnNavigate} 
      />
    );

    const firstButton = screen.getAllByRole("button")[0];
    expect(firstButton).toHaveClass("w-full");
    expect(firstButton).toHaveClass("flex");
    expect(firstButton).toHaveClass("items-center");
    expect(firstButton).toHaveClass("px-3");
    expect(firstButton).toHaveClass("py-2");
    expect(firstButton).toHaveClass("text-sm");
    expect(firstButton).toHaveClass("font-medium");
    expect(firstButton).toHaveClass("text-gray-700");
    expect(firstButton).toHaveClass("hover:text-indigo-600");
    expect(firstButton).toHaveClass("hover:bg-indigo-50");
    expect(firstButton).toHaveClass("rounded-lg");
    expect(firstButton).toHaveClass("transition-all");
    expect(firstButton).toHaveClass("duration-200");
  });
});

// Test adicional para filtrar por roles (si el componente lo implementa)
describe("NavigationItems con filtrado por roles", () => {
  const mockRoles = {
    ADMIN: "ADMIN" as Role,
    USER: "USER" as Role,
  };

  const mockItems: NavigationItem[] = [
    {
      href: "/home",
      label: "Home",
      icon: () => <div data-testid="icon-home" />,
      roles: [mockRoles.USER, mockRoles.ADMIN]
    },
    {
      href: "/admin",
      label: "Admin",
      icon: () => <div data-testid="icon-admin" />,
      roles: [mockRoles.ADMIN]
    },
  ];
});