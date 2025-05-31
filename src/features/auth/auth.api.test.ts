import { AuthUser } from "@/shared/types/user";
import { login, register } from "./auth.api";
import axiosClient from "../../shared/lib/axiosClient";

jest.mock("../../shared/lib/axiosClient");

const mockPost = jest.fn();
(axiosClient.post as jest.Mock) = mockPost;

describe("auth.api", () => {
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
  });

  describe("login", () => {
    it("should make a POST request to /auth/login with email and password", async () => {
      // Mock a successful response with the expected structure
      mockPost.mockResolvedValue({ 
        data: { 
          user: mockUser 
        } 
      });

      const email = "test@example.com";
      const password = "password123";

      const result = await login(email, password);

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/login", {
        email,
        password,
      });
      expect(result).toEqual({ user: mockUser });
      expect(console.log).toHaveBeenCalledWith("el usuario", { user: mockUser });
    });

    it("should throw an error when login fails", async () => {
      const error = new Error("Network error");
      mockPost.mockRejectedValue(error);

      await expect(login("test@example.com", "wrong")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("register", () => {
    it("should make a POST request to /auth/register with user data", async () => {
      mockPost.mockResolvedValue({ 
        data: { 
          user: mockUser 
        } 
      });

      const userData = {
        email: "new@example.com",
        password: "password123",
        name: "New",
        lastname: "User",
      };

      const result = await register(
        userData.email,
        userData.password,
        userData.name,
        userData.lastname
      );

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/register", {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        lastname: userData.lastname,
      });
      expect(result).toEqual({ user: mockUser });
      expect(console.log).toHaveBeenCalledWith("el usuario", { user: mockUser });
    });

    it("should throw an error when registration fails", async () => {
      const error = new Error("Registration failed");
      mockPost.mockRejectedValue(error);

      await expect(
        register("test@example.com", "password", "Test", "User")
      ).rejects.toThrow("Registration failed");
    });
  });
});