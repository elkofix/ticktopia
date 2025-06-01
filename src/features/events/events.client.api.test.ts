import axiosClient from "@/shared/lib/axiosClient";
import { 
  getEventsByUser, 
  getEventDataManager, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from "./events.client.api";
import { Event } from "@/shared/types/event";
import { Presentation } from "@/shared/types/presentation";

// Correct mock path for axiosClient
jest.mock("../../shared/lib/axiosClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

describe("Event API Functions", () => {
  const mockEvent: Event = {
    id: "1",
    name: "Test Event",
    bannerPhotoUrl: "banner.jpg",
    isPublic: true,
    user: {
      id: "user1",
      email: "user@test.com",
      name: "Test",
      lastname: "User",
      isActive: true,
      roles: ["admin"],
    },
  };

  const mockEvents: Event[] = [mockEvent];

  const mockPresentation: Presentation = {
    idPresentation: "1",
    place: "Venue 1",
    event: mockEvent,
    capacity: 100,
    price: 50,
    openDate: "2023-01-01",
    startDate: "2023-01-02",
    latitude: 0,
    longitude: 0,
    description: "Test description",
    ticketAvailabilityDate: "2023-01-01",
    ticketSaleAvailabilityDate: "2023-01-01",
    city: "Test City",
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("getEventsByUser", () => {
    it("should fetch events for current user", async () => {
      (axiosClient.get as jest.Mock).mockResolvedValue({ data: mockEvents });

      const result = await getEventsByUser();

      expect(axiosClient.get).toHaveBeenCalledWith("/event/find/user");
      expect(result).toEqual(mockEvents);
    });

    it("should handle errors", async () => {
      (axiosClient.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(getEventsByUser()).rejects.toThrow("API Error");
    });
  });

  // ... rest of your test cases remain the same ...
});