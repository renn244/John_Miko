import type { BookingWithAccommodationAndPreOrderAndPayment } from "../booking.types";
import type { PaginatedResponse, PaginationParams } from "../pagination.type";
import type { MaintenanceExpertise } from "./staff-management.type";

export type ReportStatus = "Pending" | "Approved" | "Rejected";
export type ReportType = "checkIn" | "checkOut" | "maintenance";
export type ReportSeverity = "Low" | "Medium" | "High";

export type StaffReportSummary = {
    totalToday: number;
    checkInReportToday: number;
    checkOutReportToday: number;
    maintenanceReportToday: number;
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export type StaffReportUser = {
    id: string;
    name?: string | null;
    email: string;
    contactNo: string;
    role: string;
}

export type StaffReportReviewer = {
    id: string;
    name?: string | null;
    email: string;
} | null

export type StaffReportBookingSummary = {
    id: string;
    referenceCode: string | null;
    guestName: string;
    bookingDate: string;
    accommodation: {
        id: string;
        name: string;
        type: string;
    }
} | null

export type StaffReport = {
    id: string;
    bookingId?: string | null;
    userId: string;
    title: string;
    proofImages: string[];
    description: string;
    type: ReportType;
    status: ReportStatus;
    severity: ReportSeverity;
    rejectionNote?: string | null;
    reviewedAt?: string | null;
    reviewedById?: string | null;
    maintenanceId?: string | null;
    createdAt: string;
    booking: StaffReportBookingSummary;
    user: StaffReportUser;
    reviewedBy?: StaffReportReviewer;
}

export type GetStaffReportsAdminQuery = {
    search?: string;
    status?: ReportStatus;
    type?: ReportType;
    severity?: ReportSeverity;
} & PaginationParams

export type ReviewStaffReportDto = {
    status: Exclude<ReportStatus, "Pending">;
    rejectionNote?: string;
    expertise?: MaintenanceExpertise;
}

export type PaginatedStaffReports = PaginatedResponse<StaffReport>;
export type LinkedBookingDetails = BookingWithAccommodationAndPreOrderAndPayment;
