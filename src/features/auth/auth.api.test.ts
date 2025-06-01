import { AuthUser } from "@/shared/types/user";
import { login, register } from "./auth.api";
import axiosClient from "../../shared/lib/axiosClient";

jest.mock("../../shared/lib/axiosClient");

const mockPost = jest.fn();
(axiosClient.post as jest.Mock) = mockPost;

describe("auth.api - additional tests", () => {
  const mockUser: AuthUser = {
    id: "123",
    name: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    isActive: true,
    roles: ["user"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe("login - edge cases", () => {
    it("should handle network errors without response data", async () => {
      const error = new Error("Network error");
      mockPost.mockRejectedValue(error);

      const result = await login("test@example.com", "password");
      expect(result).toEqual({ error: "Error al iniciar sesión" });
      expect(console.error).toHaveBeenCalledWith("Error during login:", error);
    });

    it("should handle unexpected response structure", async () => {
      mockPost.mockResolvedValue({
        data: { unexpected: "response" }
      });

      const result = await login("test@example.com", "password");
      expect(result).toEqual({ unexpected: "response" });
    });

    it("should handle empty response", async () => {
      mockPost.mockResolvedValue({});

      const result = await login("test@example.com", "password");
      expect(result).toEqual(undefined);
    });
  });

  describe("register - edge cases", () => {
    it("should handle network errors without response data", async () => {
      const error = new Error("Network error");
      mockPost.mockRejectedValue(error);

      const result = await register("test@example.com", "password", "Test", "User");
      expect(result).toEqual({ error: "Error al registrar el usuario" });
    });

    it("should handle unexpected response structure", async () => {
      mockPost.mockResolvedValue({
        data: { unexpected: "response" }
      });

      const result = await register("test@example.com", "password", "Test", "User");
      expect(result).toEqual({ unexpected: "response" });
    });

    it("should handle empty response", async () => {
      mockPost.mockResolvedValue({});

      const result = await register("test@example.com", "password", "Test", "User");
      expect(result).toEqual(undefined);
    });

    it("should handle missing fields in registration", async () => {
      const error = { 
        response: { 
          data: { 
            message: "Validation failed",
            details: ["name is required"] 
          } 
        } 
      };
      mockPost.mockRejectedValue(error);

      const result = await register("test@example.com", "password", "", "User");
      expect(result).toEqual({ error: "Validation failed" });
    });
  });

  describe("error logging", () => {
    it("should log errors during login", async () => {
      const error = new Error("Test error");
      mockPost.mockRejectedValue(error);

      await login("fail@example.com", "wrong");
      expect(console.error).toHaveBeenCalledWith("Error during login:", error);
    });

    it("should log successful registration", async () => {
      mockPost.mockResolvedValue({
        data: { user: mockUser }
      });

      await register("new@example.com", "password", "New", "User");
      expect(console.log).toHaveBeenCalledWith("el usuario", { user: mockUser });
    });
  });
});