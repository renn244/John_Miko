import type { PaginationParams } from "@/types/pagination.type";

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

export type StaffBookingAddOn = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type StaffBookingPreOrder = {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  status: "Pending" | "Completed";
};

export type StaffBookingDetails = StaffBookingSummary & {
  email: string;
  adultGuests: number;
  kidGuests: number;
  seniorGuest: number;
  specialRequests: string | null;
  addOns: StaffBookingAddOn[];
  preOrders: StaffBookingPreOrder[];
};

export type GetStaffBookingsQuery = PaginationParams & {
  search?: string;
};
