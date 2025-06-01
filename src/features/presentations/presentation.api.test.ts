import axiosServer from "../../shared/lib/axiosServer";
import {
  getPresentationsByEventId,
  getPresentationById
} from "./presentation.api";
import { Presentation } from "@/shared/types/presentation";

// Mock axiosServer
jest.mock("../../shared/lib/axiosServer", () => ({
  get: jest.fn()
}));

describe("Presentation Server API", () => {
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
        roles: ["event-manager"]
      }
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
    city: "New York"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPresentationsByEventId", () => {
    it("should fetch presentations for an event", async () => {
      const mockResponse = {
        data: [mockPresentation]
      };
      (axiosServer.get as jest.Mock).mockResolvedValue(mockResponse);

      const eventId = "event-123";
      const result = await getPresentationsByEventId(eventId);

      expect(axiosServer.get).toHaveBeenCalledWith(
        `/presentation/event/${eventId}`
      );
      expect(result).toEqual([mockPresentation]);
    });

    it("should log the response data", async () => {
      const consoleSpy = jest.spyOn(console, "log");
      const mockResponse = {
        data: [mockPresentation]
      };
      (axiosServer.get as jest.Mock).mockResolvedValue(mockResponse);

      await getPresentationsByEventId("event-123");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(JSON.stringify(mockResponse.data, null, 2))
      );
      consoleSpy.mockRestore();
    });

    it("should throw an error if request fails", async () => {
      const error = new Error("Network error");
      (axiosServer.get as jest.Mock).mockRejectedValue(error);

      await expect(getPresentationsByEventId("event-123")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("getPresentationById", () => {
    it("should fetch a single presentation", async () => {
      const mockResponse = {
        data: mockPresentation
      };
      (axiosServer.get as jest.Mock).mockResolvedValue(mockResponse);

      const presentationId = "pres-123";
      const result = await getPresentationById(presentationId);

      expect(axiosServer.get).toHaveBeenCalledWith(
        `/presentation/${presentationId}`
      );
      expect(result).toEqual(mockPresentation);
    });

    it("should throw an error if request fails", async () => {
      const error = new Error("Network error");
      (axiosServer.get as jest.Mock).mockRejectedValue(error);

      await expect(getPresentationById("pres-123")).rejects.toThrow(
        "Network error"
      );
    });
  });
});