import axiosClient from "../../shared/lib/axiosClient";
import { generateSalesReport, generateOccupationReport } from "./reports.api";

// Mock the axiosClient module
jest.mock("../../shared/lib/axiosClient");

describe("Reports API Service", () => {
  const mockBase64Data = "mock-base64-data";
  const mockMimeType = "application/pdf";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateSalesReport", () => {
    it("should generate sales report successfully", async () => {
      // Mock successful response
      (axiosClient.get as jest.Mock).mockResolvedValue({
        data: {
          data: mockBase64Data,
          mimeType: mockMimeType
        }
      });

      const result = await generateSalesReport();

      expect(axiosClient.get).toHaveBeenCalledWith("/report/sales");
      expect(result).toEqual({
        data: mockBase64Data,
        mimeType: mockMimeType
      });
    });

    it("should handle errors when generating sales report", async () => {
      // Mock error response
      const mockError = {
        response: {
          data: {
            message: "Sales data unavailable"
          }
        }
      };
      (axiosClient.get as jest.Mock).mockRejectedValue(mockError);

      const result = await generateSalesReport();

      expect(result).toEqual({
        error: "Sales data unavailable"
      });
    });

    it("should return generic error when no response data", async () => {
      // Mock error without response data
      (axiosClient.get as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await generateSalesReport();

      expect(result).toEqual({
        error: "Error al generar el reporte de ventas"
      });
    });
  });

  describe("generateOccupationReport", () => {
    it("should generate occupation report successfully", async () => {
      // Mock successful response
      (axiosClient.get as jest.Mock).mockResolvedValue({
        data: {
          data: mockBase64Data,
          mimeType: mockMimeType
        }
      });

      const result = await generateOccupationReport();

      expect(axiosClient.get).toHaveBeenCalledWith("/report/ocupation");
      expect(result).toEqual({
        data: mockBase64Data,
        mimeType: mockMimeType
      });
    });

    it("should handle errors when generating occupation report", async () => {
      // Mock error response
      const mockError = {
        response: {
          data: {
            message: "Occupancy data unavailable"
          }
        }
      };
      (axiosClient.get as jest.Mock).mockRejectedValue(mockError);

      const result = await generateOccupationReport();

      expect(result).toEqual({
        error: "Occupancy data unavailable"
      });
    });

    it("should return generic error when no response data", async () => {
      // Mock error without response data
      (axiosClient.get as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await generateOccupationReport();

      expect(result).toEqual({
        error: "Error al generar el reporte de ocupación"
      });
    });
  });

  it("should log errors to console", async () => {
    console.error = jest.fn();
    const mockError = new Error("Test error");
    (axiosClient.get as jest.Mock).mockRejectedValue(mockError);

    await generateSalesReport();

    expect(console.error).toHaveBeenCalledWith(
      "Error generating sales report:",
      mockError
    );
  });
});