import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetBookingById } from "@/hooks/admin/booking.hook";
import getCheckInOut from "@/lib/getCheckInOut";
import { useBookingAdminStore } from "@/store/admin/bookingAdmin.store";
import type { BookingWithAccommodation } from "@/types/booking.types";
import { Calendar, CreditCard, FileText, MapPin, Users } from "lucide-react";

const ViewBookingDialog = () => {
    const isViewOpen = useBookingAdminStore((state) => state.isViewOpen);
    const viewId = useBookingAdminStore((state) => state.viewId);
    const setIsViewOpen = useBookingAdminStore((state) => state.setIsViewOpen);

    const { data, isLoading, error, refetch, isRefetching } = useGetBookingById(viewId);

    return (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="sm:max-w-3xl">
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsViewOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isViewOpen) && (
                    <NotFoundDialog 
                    onBack={() => setIsViewOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Booking Not Found"
                    />
                )}
                {data && <BookingDetails selectedBooking={data} />}
            </DialogContent>
        </Dialog>
    )
}

const BookingDetails = ({ selectedBooking } : { selectedBooking: BookingWithAccommodation }) => {
    
    const { 
        checkIn, checkInDayOfTheWeek,
        checkOut, checkOutDayOfTheWeek
    } = getCheckInOut(selectedBooking.bookingDate, selectedBooking.timeSlot);

    return (
        <>
            <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                    {selectedBooking.id} <Badge>{selectedBooking.status}</Badge> <Badge variant="outline">{selectedBooking.paymentType} Payment</Badge>
                </DialogDescription>
            </DialogHeader>
            <div className="grid lg:grid-cols-2 gap-6">

                <div className="space-y-4">

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold">
                                Guest Information
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Full Name
                                </p>
                                <p className="text-lg font-bold">
                                    {selectedBooking.guestName}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Email Address
                                </p>
                                <p className="font-semibold break-all text-primary">
                                    {selectedBooking.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Phone Number
                                </p>
                                <p className="font-semibold">
                                    {selectedBooking.contactNo}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Number of Guests
                                </p>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-bold">
                                        {selectedBooking.numberOfGuests} {selectedBooking.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold">
                                Accommodation Details
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Accommodation
                                </p>
                                <p className="text-lg font-bold">
                                    {selectedBooking.accommodation.name}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                        Type
                                    </p>
                                    <p className="font-semibold">
                                        {selectedBooking.accommodation.type}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedBooking.specialRequests && (
                        <div className="border-t pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-bold">
                                    Special Requests / Notes
                                </h3>
                            </div>
                            <div className="p-4 rounded-lg bg-muted">
                                <p className="leading-relaxed font-medium">
                                    {selectedBooking.specialRequests}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold">
                                Stay Dates
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 rounded-lg border-2 bg-muted/50">
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Check-in
                                </p>
                                <p className="font-bold text-lg mb-1">
                                    {checkIn}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {checkInDayOfTheWeek}
                                </p>
                            </div>
                            <div className="p-4 rounded-lg border-2 bg-muted/50">
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                                    Check-out
                                </p>
                                <p className="font-bold text-lg mb-1">
                                    {checkOut}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {checkOutDayOfTheWeek}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6" style={{ borderColor: '#E5E7EB' }}>

                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5" style={{ color: '#F97316' }} />
                            <h3 className="text-lg font-bold" style={{ color: '#1F2937' }}>
                                Payment Information
                            </h3>
                        </div>
                        {/* <div className="p-5 rounded-lg border-2" style={{ backgroundColor: '#FAFAFA', borderColor: '#E5E7EB' }}>
                            <div className="flex justify-between items-center mb-3 pb-3 border-b" style={{ borderColor: '#E5E7EB' }}>
                                <span className="text-sm font-medium" style={{ color: '#6B7280' }}>
                                    Total Amount:
                                </span>
                                <span className="font-bold text-xl" style={{ color: '#1F2937' }}>
                                    ₱{selectedBooking.totalAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-3 pb-3 border-b" style={{ borderColor: '#E5E7EB' }}>
                                <span className="text-sm font-medium" style={{ color: '#6B7280' }}>
                                    Amount Paid:
                                </span>
                                <span className="font-bold text-lg" style={{ color: '#059669' }}>
                                    ₱{selectedBooking.amountPaid.toLocaleString()}
                                </span>
                            </div>
                            {selectedBooking.paymentType === 'Partial' && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium" style={{ color: '#6B7280' }}>
                                        Balance Due:
                                    </span>
                                    <span className="font-bold text-lg" style={{ color: '#F97316' }}>
                                        ₱{(selectedBooking.totalAmount - selectedBooking.amountPaid).toLocaleString()}
                                    </span>
                                </div>
                            )}
                            {selectedBooking.paymentType === 'Full' && (
                                <div className="flex items-center justify-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#D1FAE5' }}>
                                    <CheckCircle className="w-4 h-4" style={{ color: '#059669' }} />
                                    <span className="font-bold text-sm" style={{ color: '#059669' }}>
                                        Fully Paid
                                    </span>
                                </div>
                            )}
                        </div> */}
                    </div>

                </div>
            </div>
        </>
    )
}

export default ViewBookingDialog