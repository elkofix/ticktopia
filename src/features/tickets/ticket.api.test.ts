import axiosClient from "../../shared/lib/axiosClient";
import { getAllMyTickets, getAllMyTicketsHistoric, reedemTicket } from "../tickets/ticket.api";
import { Ticket } from "@/shared/types/ticket";

// Mock the axiosClient module
jest.mock("../../shared/lib/axiosClient");

const mockTicket: Ticket = {
    id: "ticket-123",
    buyDate: "2023-01-01T00:00:00Z",
    quantity: 1,
    isActive: true,
    isRedeemed: false,
    presentation: {
        idPresentation: "pres-123",
        place: "Venue",
        event: {
            id: "event-123",
            name: "Concert",
            bannerPhotoUrl: "/image.jpg",
            isPublic: true,
            user: {
                id: "user-123",
                name: "Organizer",
                email: "organizer@example.com",
                lastname: "LastName",
                isActive: true,
                roles: ["client"]
            }
        },
        capacity: 100,
        price: 50,
        openDate: "2023-01-01T18:00:00Z",
        startDate: "2023-01-01T20:00:00Z",
        latitude: 0,
        longitude: 0,
        description: "Event description",
        ticketAvailabilityDate: "2022-12-01T00:00:00Z",
        ticketSaleAvailabilityDate: "2022-11-01T00:00:00Z",
        city: "City"
    },
    user: {

        id: "user-123",
        name: "Organizer",
        email: "organizer@example.com",
        lastname: "LastName",
        isActive: true,
        roles: ["client"]
    },
};

describe("Ticket Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllMyTickets", () => {
        it("should fetch all tickets successfully", async () => {
            // Mock the axios response
            (axiosClient.get as jest.Mock).mockResolvedValue({
                data: [mockTicket]
            });

            const result = await getAllMyTickets();

            expect(axiosClient.get).toHaveBeenCalledWith("/tickets");
            expect(result).toEqual([mockTicket]);
        });

        it("should handle errors when fetching tickets", async () => {
            const error = new Error("Network error");
            (axiosClient.get as jest.Mock).mockRejectedValue(error);

            await expect(getAllMyTickets()).rejects.toThrow("Network error");
        });
    });

    describe("getAllMyTicketsHistoric", () => {
        it("should fetch historic tickets successfully", async () => {
            (axiosClient.get as jest.Mock).mockResolvedValue({
                data: [mockTicket]
            });

            const result = await getAllMyTicketsHistoric();

            expect(axiosClient.get).toHaveBeenCalledWith("/tickets/historic");
            expect(result).toEqual([mockTicket]);
        });

        it("should handle errors when fetching historic tickets", async () => {
            const error = new Error("Network error");
            (axiosClient.get as jest.Mock).mockRejectedValue(error);

            await expect(getAllMyTicketsHistoric()).rejects.toThrow("Network error");
        });
    });

    describe("reedemTicket", () => {
        it("should redeem a ticket successfully", async () => {
            const updatedTicket = { ...mockTicket, isRedeemed: true };
            (axiosClient.put as jest.Mock).mockResolvedValue({
                data: updatedTicket
            });

            const result = await reedemTicket("ticket-123");

            expect(axiosClient.put).toHaveBeenCalledWith("/tickets/ticket-123", { isRedeemed: true });
            expect(result).toEqual(updatedTicket);
        });

        it("should handle errors when redeeming a ticket", async () => {
            const error = new Error("Redeem failed");
            (axiosClient.put as jest.Mock).mockRejectedValue(error);

            await expect(reedemTicket("ticket-123")).rejects.toThrow("Redeem failed");
        });

        it("should log the response when redeeming", async () => {
            console.log = jest.fn();
            (axiosClient.put as jest.Mock).mockResolvedValue({
                data: mockTicket
            });

            await reedemTicket("ticket-123");

            expect(console.log).toHaveBeenCalledWith({ data: mockTicket });
        });
    });
});