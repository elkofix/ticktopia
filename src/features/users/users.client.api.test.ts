import axiosClient from "../../shared/lib/axiosClient";
import { getAllUsers, updateProfile, closeProfile } from "../users/users.client.api";

// Mock de axiosClient correctamente configurado
jest.mock("../../shared/lib/axiosClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe("User Service", () => {
  const mockUser = {
    id: "1",
    name: "John",
    lastname: "Doe",
    email: "john@example.com",
    isActive: true,
    roles: ["client"],
  };

  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    (axiosClient.get as jest.Mock).mockClear();
    (axiosClient.put as jest.Mock).mockClear();
    (axiosClient.delete as jest.Mock).mockClear();
  });

  describe("getAllUsers", () => {
    it("should return users list on successful request", async () => {
      // Configurar mock exitoso
      (axiosClient.get as jest.Mock).mockResolvedValueOnce({ data: [mockUser] });

      const result = await getAllUsers();

      expect(axiosClient.get).toHaveBeenCalledWith("/auth/users");
      expect(result).toEqual([mockUser]);
    });

    it("should return error object when request fails with response", async () => {
      // Configurar mock fallido con respuesta
      const errorMessage = "Network Error";
      (axiosClient.get as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const result = await getAllUsers();

      expect(result).toEqual({ error: errorMessage });
    });

    it("should return generic error when request fails without response", async () => {
      // Configurar mock fallido sin respuesta
      (axiosClient.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      const result = await getAllUsers();

      expect(result).toEqual({ error: "Error al obtener los usuarios" });
    });

    it("should log error to console when request fails", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const testError = new Error("Test error");
      (axiosClient.get as jest.Mock).mockRejectedValueOnce(testError);

      await getAllUsers();

      expect(consoleSpy).toHaveBeenCalledWith("Error fetching users:", testError);
      consoleSpy.mockRestore();
    });
  });

  describe("updateProfile", () => {
    const updateData = {
      name: "John Updated",
      email: "john.updated@example.com",
    };

    it("should update user profile successfully", async () => {
      // Configurar mock exitoso
      const updatedUser = { ...mockUser, ...updateData };
      (axiosClient.put as jest.Mock).mockResolvedValueOnce({ data: updatedUser });

      const result = await updateProfile(updateData, mockUser.id);

      expect(axiosClient.put).toHaveBeenCalledWith(
        `/auth/users/${mockUser.id}`,
        updateData
      );
      expect(result).toEqual(updatedUser);
    });

    it("should handle partial updates", async () => {
      const partialUpdate = { name: "John Updated" };
      (axiosClient.put as jest.Mock).mockResolvedValueOnce({
        data: { ...mockUser, ...partialUpdate },
      });

      const result = await updateProfile(partialUpdate, mockUser.id);

      expect(axiosClient.put).toHaveBeenCalledWith(
        `/auth/users/${mockUser.id}`,
        partialUpdate
      );
      expect(result.name).toBe("John Updated");
    });

    it("should throw error when update fails", async () => {
      // Configurar mock fallido
      const errorMessage = "Update failed";
      (axiosClient.put as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(updateProfile(updateData, mockUser.id)).rejects.toThrow();
    });

    it("should log response data to console on success", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      (axiosClient.put as jest.Mock).mockResolvedValueOnce({ data: mockUser });

      await updateProfile(updateData, mockUser.id);

      expect(consoleSpy).toHaveBeenCalledWith("lo usuario", mockUser);
      consoleSpy.mockRestore();
    });
  });

  describe("closeProfile", () => {
    it("should close user profile successfully", async () => {
      // Configurar mock exitoso
      (axiosClient.delete as jest.Mock).mockResolvedValueOnce({ data: mockUser });

      const result = await closeProfile(mockUser.id);

      expect(axiosClient.delete).toHaveBeenCalledWith(
        `/auth/users/${mockUser.id}`
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw error when deletion fails", async () => {
      // Configurar mock fallido
      const errorMessage = "Deletion failed";
      (axiosClient.delete as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(closeProfile(mockUser.id)).rejects.toThrow();
    });

    it("should log response data to console on success", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      (axiosClient.delete as jest.Mock).mockResolvedValueOnce({ data: mockUser });

      await closeProfile(mockUser.id);

      expect(consoleSpy).toHaveBeenCalledWith("lo usuario", mockUser);
      consoleSpy.mockRestore();
    });
  });
});