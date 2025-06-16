import { render, screen, fireEvent } from "@testing-library/react";
import { Menu, X } from "lucide-react";
import { MobileMenuButton } from "../MobileMenuButton";

// Mock de los íconos de lucide-react para simplificar las pruebas
jest.mock("lucide-react", () => ({
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

describe("MobileMenuButton", () => {
  it("renderiza el ícono de menú cuando isOpen es false", () => {
    const mockToggle = jest.fn();
    render(<MobileMenuButton isOpen={false} toggle={mockToggle} />);
    
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  it("renderiza el ícono de X cuando isOpen es true", () => {
    const mockToggle = jest.fn();
    render(<MobileMenuButton isOpen={true} toggle={mockToggle} />);
    
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("menu-icon")).not.toBeInTheDocument();
  });

  it("llama a la función toggle cuando se hace clic", () => {
    const mockToggle = jest.fn();
    render(<MobileMenuButton isOpen={false} toggle={mockToggle} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("tiene las clases CSS correctas", () => {
    const mockToggle = jest.fn();
    render(<MobileMenuButton isOpen={false} toggle={mockToggle} />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveClass("md:hidden");
    expect(button).toHaveClass("inline-flex");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("justify-center");
    expect(button).toHaveClass("p-2");
    expect(button).toHaveClass("text-gray-700");
    expect(button).toHaveClass("hover:text-indigo-600");
    expect(button).toHaveClass("hover:bg-indigo-50");
    expect(button).toHaveClass("rounded-lg");
    expect(button).toHaveClass("transition-colors");
    expect(button).toHaveClass("duration-200");
  });
});