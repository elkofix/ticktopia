import axiosClient from "../../shared/lib/axiosClient";
import { updateRolesToUser } from "../roles/roles.api";
import { User } from "@/shared/types/event";

jest.mock("../../shared/lib/axiosClient");

// Mock user data
const mockUser: Omit<User, "password"> = {
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
  roles: ["admin"],
    lastname: "User",
    isActive: true,
};

describe("authService - updateRolesToUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update user roles successfully", async () => {
    // Setup mock response
    const updatedRoles: Role[] = ["admin", "client"];
    const updatedUser = { ...mockUser, roles: updatedRoles };
    
    (axiosClient.put as jest.Mock).mockResolvedValue({
      data: updatedUser
    });

    // Call the function
    const result = await updateRolesToUser("user-123", updatedRoles);

    // Verify the request
    expect(axiosClient.put).toHaveBeenCalledWith(
      "/auth/users/roles/user-123",
      { roles: updatedRoles }
    );

    // Verify the response
    expect(result).toEqual(updatedUser);
  });

  it("should log the response data", async () => {
    // Mock console.log
    console.log = jest.fn();
    
    // Setup mock response
    (axiosClient.put as jest.Mock).mockResolvedValue({
      data: mockUser
    });

    // Call the function
    await updateRolesToUser("user-123", ["admin"]);

    // Verify the log
    expect(console.log).toHaveBeenCalledWith("lo usuario", mockUser);
  });

  it("should handle errors when updating roles", async () => {
    // Setup mock error
    const error = new Error("Failed to update roles");
    (axiosClient.put as jest.Mock).mockRejectedValue(error);

    // Verify the error is thrown
    await expect(updateRolesToUser("user-123", ["admin"]))
      .rejects
      .toThrow("Failed to update roles");
  });

  it("should throw an error for empty roles array", async () => {
    await expect(updateRolesToUser("user-123", []))
      .rejects
      .toThrow("Failed to update roles");
  });

  it("should validate the roles array contains valid roles", async () => {
    const invalidRoles = ["INVALID_ROLE"] as unknown as Role[];
    
    await expect(updateRolesToUser("user-123", invalidRoles))
      .rejects
      .toThrow("Failed to update roles");
  });
});