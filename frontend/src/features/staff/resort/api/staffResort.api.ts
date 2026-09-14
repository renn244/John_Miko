import apiClient from "@/lib/apiClient";
import type {
  CreateStaffReportDto,
  PaginatedResponse,
  ResortReportsFilters,
  StaffBookingDetails,
  StaffBookingSummary,
  StaffReport,
} from "@/features/staff/resort/types/staffResort.type";

export const staffResortApi = {
  getBookings: async (query: {
    search?: string;
    page: number;
    limit: number;
  }) => {
    const response = await apiClient.get("/booking/staff", { params: query });
    if (response.status >= 400)
      throw new Error(response.data?.message || "Could not load bookings.");
    return response.data as PaginatedResponse<StaffBookingSummary>;
  },
  getBookingById: async (id: string) => {
    const response = await apiClient.get(`/booking/staff/${id}`);
    if (response.status === 404) return null;
    if (response.status >= 400)
      throw new Error(response.data?.message || "Could not load this booking.");
    return response.data as StaffBookingDetails;
  },
  getReports: async (
    query: ResortReportsFilters & { page: number; limit: number },
  ) => {
    const response = await apiClient.get("/staff-reports/byUser", {
      params: query,
    });
    if (response.status >= 400)
      throw new Error(response.data?.message || "Could not load reports.");
    return response.data as PaginatedResponse<StaffReport>;
  },
  getReportById: async (id: string) => {
    const response = await apiClient.get(`/staff-reports/${id}`);
    if (response.status === 404) return null;
    if (response.status >= 400)
      throw new Error(response.data?.message || "Could not load this report.");
    return response.data as StaffReport;
  },
  createReport: async (data: CreateStaffReportDto) => {
    const response = await apiClient.post("/staff-reports", data);
    if (response.status >= 400)
      throw new Error(
        response.data?.errors?.[0]?.message?.[0] ||
          response.data?.message ||
          "Could not submit this report.",
      );
    return response.data as StaffReport;
  },
};
