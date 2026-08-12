export type ReportType = "checkIn" | "checkOut" | "maintenance";
export type ReportStatus = "Pending" | "Approved" | "Rejected";
export type ReportSeverity = "Low" | "Medium" | "High";

export type StaffBookingAccommodation = {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
};
export type StaffBookingStayOption = {
  sortOrder: number;
  startTime: string | null;
  endTime: string | null;
};
export type StaffBookingSummary = {
  id: string;
  referenceCode: string;
  guestName: string;
  contactNo: string;
  bookingDate: string;
  numberOfGuests: number;
  status: "Confirmed";
  stayOptionCodeSnapshot: string;
  stayOptionLabelSnapshot: string;
  stayDurationHoursSnapshot: number | null;
  accommodation: StaffBookingAccommodation;
  stayOption: StaffBookingStayOption;
};
export type StaffBookingDetails = StaffBookingSummary & {
  email: string;
  adultGuests: number;
  kidGuests: number;
  seniorGuest: number;
  specialRequests: string | null;
  addOns: { id: string; name: string; quantity: number; price: number }[];
  preOrders: {
    id: string;
    name: string;
    description: string;
    category: string;
    quantity: number;
    status: "Pending" | "Completed";
  }[];
};
export type StaffReportBooking = {
  id: string;
  referenceCode: string;
  guestName: string;
  bookingDate: string;
  accommodation: { id: string; name: string; type: string };
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
export type ResortReportsFilters = {
  bookingId?: string;
  status?: ReportStatus;
  type?: ReportType;
  severity?: ReportSeverity;
};
export type CreateStaffReportDto = {
  bookingId?: string;
  title: string;
  description: string;
  proofImages: string[];
  type: ReportType;
  severity: ReportSeverity;
};
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
};
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta };
