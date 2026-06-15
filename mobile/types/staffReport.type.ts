import type { PaginationParams } from "@/types/pagination.type";

export type ReportType = "checkIn" | "checkOut" | "maintenance";
export type ReportStatus = "Pending" | "Approved" | "Rejected";
export type ReportSeverity = "Low" | "Medium" | "High";

export type StaffReportBooking = {
  id: string;
  guestName: string;
  bookingDate: string;
  accommodation: {
    id: string;
    name: string;
    type: string;
  };
};

export type StaffReport = {
  id: string;
  bookingId: string | null;
  userId: string;
  title: string;
  description: string;
  proofImages: string[];
  type: ReportType;
  status: ReportStatus;
  severity: ReportSeverity;
  rejectionNote: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  booking: StaffReportBooking | null;
};

export type CreateStaffReportRequest = {
  bookingId?: string;
  title: string;
  description: string;
  proofImages: string[];
  type: ReportType;
  severity: ReportSeverity;
};

export type GetStaffReportsQuery = PaginationParams & {
  bookingId?: string;
  status?: ReportStatus;
  type?: ReportType;
  severity?: ReportSeverity;
};
