import axiosClient from "../../shared/lib/axiosClient";
import {
  getPresentationForManagerById,
  createPresentation,
  updatePresentation,
  deletePresentation,
} from "./presentation.client.api";
import { Presentation } from "@/shared/types/presentation";

// Mock axiosClient
jest.mock("../../shared/lib/axiosClient", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("Presentation Client API", () => {
  const mockPresentation: Presentation = {
    idPresentation: "pres-123",
    place: "Main Hall",
    event: {
      id: "event-123",
      name: "Test Event",
      bannerPhotoUrl: "/test.jpg",
      isPublic: true,
      user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        lastname: "Test",
        isActive: true,
        roles: ["event-manager"],
      },
    },
    capacity: 100,
    price: 50,
    openDate: "2023-12-01T18:00:00Z",
    startDate: "2023-12-01T20:00:00Z",
    latitude: 40.7128,
    longitude: -74.0060,
    description: "Test description",
    ticketAvailabilityDate: "2023-11-15T00:00:00Z",
    ticketSaleAvailabilityDate: "2023-11-01T00:00:00Z",
    city: "New York",
  };

  const mockCreateDto = {
    place: "New Venue",
    capacity: 100,
    openDate: "2023-12-01T18:00:00Z",
    startDate: "2023-12-01T20:00:00Z",
    ticketAvailabilityDate: "2023-11-15T00:00:00Z",
    ticketSaleAvailabilityDate: "2023-11-01T00:00:00Z",
    price: 50,
    latitude: 40.7128,
    longitude: -74.0060,
    description: "New description",
    city: "New York",
    eventId: "event-123",
  };

  const mockUpdateDto = {
    place: "Updated Venue",
    capacity: 150,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getPresentationForManagerById", () => {
    it("should fetch a presentation for manager", async () => {
      const mockResponse = { data: mockPresentation };
      (axiosClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getPresentationForManagerById("pres-123");

      expect(axiosClient.get).toHaveBeenCalledWith(
        "/presentation/manager/pres-123"
      );
      expect(result).toEqual(mockPresentation);
    });

    it("should throw an error if request fails", async () => {
      const error = new Error("Network error");
      (axiosClient.get as jest.Mock).mockRejectedValue(error);

      await expect(getPresentationForManagerById("pres-123")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("createPresentation", () => {
    it("should create a new presentation", async () => {
      const mockResponse = { data: mockPresentation };
      (axiosClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createPresentation(mockCreateDto);

      expect(axiosClient.post).toHaveBeenCalledWith(
        "/presentation",
        mockCreateDto
      );
      expect(result).toEqual(mockPresentation);
      expect(console.log).toHaveBeenCalledWith(
        "press",
        mockCreateDto
      );
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify(mockPresentation, null, 2)
      );
    });

    it("should log the request and response", async () => {
      const mockResponse = { data: mockPresentation };
      (axiosClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await createPresentation(mockCreateDto);

      expect(console.log).toHaveBeenCalledTimes(2);
    });

    it("should throw an error if creation fails", async () => {
      const error = new Error("Creation failed");
      (axiosClient.post as jest.Mock).mockRejectedValue(error);

      await expect(createPresentation(mockCreateDto)).rejects.toThrow(
        "Creation failed"
      );
    });
  });

  describe("updatePresentation", () => {
    it("should update an existing presentation", async () => {
      const mockResponse = { data: mockPresentation };
      (axiosClient.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await updatePresentation(
        "pres-123",
        mockUpdateDto
      );

      expect(axiosClient.put).toHaveBeenCalledWith(
        "/presentation/pres-123",
        mockUpdateDto
      );
      expect(result).toEqual(mockPresentation);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify(mockPresentation, null, 2)
      );
    });

    it("should log the response", async () => {
      const mockResponse = { data: mockPresentation };
      (axiosClient.put as jest.Mock).mockResolvedValue(mockResponse);

      await updatePresentation("pres-123", mockUpdateDto);

      expect(console.log).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if update fails", async () => {
      const error = new Error("Update failed");
      (axiosClient.put as jest.Mock).mockRejectedValue(error);

      await expect(
        updatePresentation("pres-123", mockUpdateDto)
      ).rejects.toThrow("Update failed");
    });
  });

  describe("deletePresentation", () => {
    it("should delete a presentation successfully", async () => {
      const mockResponse = { data: mockPresentation };
      (axiosClient.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await deletePresentation("pres-123");

      expect(axiosClient.delete).toHaveBeenCalledWith(
        "/presentation/pres-123"
      );
      expect(result).toEqual(mockPresentation);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify(mockPresentation, null, 2)
      );
    });

    it("should handle error responses", async () => {
      const errorResponse = { error: "Deletion failed" };
      (axiosClient.delete as jest.Mock).mockResolvedValue({ data: errorResponse });

      const result = await deletePresentation("pres-123");

      expect(result).toEqual(errorResponse);
    });

    it("should log the response", async () => {
      const mockResponse = { data: mockPresentation };
      (axiosClient.delete as jest.Mock).mockResolvedValue(mockResponse);

      await deletePresentation("pres-123");

      expect(console.log).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if deletion fails", async () => {
      const error = new Error("Network error");
      (axiosClient.delete as jest.Mock).mockRejectedValue(error);

      await expect(deletePresentation("pres-123")).rejects.toThrow(
        "Network error"
      );
    });
  });
});