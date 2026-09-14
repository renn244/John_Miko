import { useState } from 'react';
import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import AdminDecisionNotice from "@/components/common/AdminDecisionNotice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useChangeBookingStatusAdminMutation, useGetBookingById } from "@/features/admin/bookings/hooks/useAdminBookings";
import getCheckInOut from "@/lib/getCheckInOut";
import { getBookingDates } from "@/lib/getBookingDates";
import { useBookingAdminStore } from "@/features/admin/bookings/store/bookingAdmin.store";
import type { BookingWithAccommodation } from "@/features/shared/bookings/types/booking.type";
import { CheckCircle } from "lucide-react";

const MarkCompletedDialog = () => {
    const isMarkCompletedOpen = useBookingAdminStore((state) => state.isMarkCompletedOpen);
    const markCompletedBookingId = useBookingAdminStore((state) => state.markCompletedBookingId);
    const setIsMarkCompletedOpen = useBookingAdminStore((state) => state.setIsMarkCompletedOpen);
    const setMarkCompletedBookingId = useBookingAdminStore((state) => state.setMarkCompletedBookingId);

    const { data, isLoading, error, refetch, isRefetching } = useGetBookingById(markCompletedBookingId);
    
    return (
        <Dialog open={isMarkCompletedOpen}  onOpenChange={setIsMarkCompletedOpen}>
            <DialogContent className="sm:max-w-xl" onCloseAutoFocus={() => setMarkCompletedBookingId(undefined)}>
                {isLoading && (
                    <div className="flex items-cetner justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsMarkCompletedOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isMarkCompletedOpen) && (
                    <NotFoundDialog 
                    onBack={() => setIsMarkCompletedOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Booking Not Found"
                    />
                )}
                {data && <MarkCompletedBooking booking={data} />}
            </DialogContent>
        </Dialog>
    )
}

const MarkCompletedBooking = ({ booking } : { booking: BookingWithAccommodation }) => {
    const setIsMarkCompletedOpen = useBookingAdminStore((state) => state.setIsMarkCompletedOpen);
    
    const { checkOut } = getCheckInOut({
        bookingDate: booking.bookingDate,
        startTime: booking.stayOption?.startTime,
        endTime: booking.stayOption?.endTime,
        label: booking.stayOption?.label ?? booking.stayOptionLabelSnapshot,
    });
    const { mutateAsync, isPending } = useChangeBookingStatusAdminMutation(booking.id);
    const [openedAt] = useState(Date.now);
    const hasSchedule = Boolean(booking.stayOption?.startTime && booking.stayOption?.endTime);
    const { checkIn, checkOut: scheduledCheckOut } = getBookingDates(new Date(booking.bookingDate), booking.stayOption);
    const availableAt = hasSchedule
        ? Math.max(checkIn.getTime(), scheduledCheckOut.getTime() - 2 * 60 * 60 * 1000)
        : null;
    const canComplete = booking.status === 'Confirmed' && availableAt !== null && openedAt >= availableAt;
    const completionMessage = booking.status !== 'Confirmed' ? 'Only confirmed bookings can be marked Completed.'
        : availableAt === null ? 'Stay schedule is unavailable. Cannot complete this booking.'
        : `Completion available from ${new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'short' }).format(availableAt)} (Philippine time).`;


    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Complete Booking
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                
                <AdminDecisionNotice
                    tone="success"
                    icon={CheckCircle}
                    title="Mark as Completed"
                    description="This will update the booking status to Completed and mark it as successfully finished."
                />

                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">
                        Booking Details:
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Reference:</span>
                            <span className="font-semibold">
                                {booking.referenceCode ?? "—"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Guest:</span>
                            <span className="font-medium">
                                {booking.guestName}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Accommodation:</span>
                            <span className="font-medium capitalize">
                                {booking.accommodation.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-out:</span>
                            <span className="font-medium">
                                {checkOut}
                            </span>
                        </div>

                    </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                    {completionMessage}
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button 
                type="button" 
                onClick={() => setIsMarkCompletedOpen(false)} 
                variant="outline"
                >
                    Cancel
                </Button>
                <Button
                type="button"
                disabled={isPending || !canComplete}
                onClick={async () => {
                    await mutateAsync("Completed")
                    setIsMarkCompletedOpen(false)
                }}
                variant="success"
                >
                    {
                        isPending ? 
                            <LoadingSpinner /> :
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Yes, Mark as Completed
                            </>
                    }
                </Button>
            </div>
        </>
    )
}

export default MarkCompletedDialog
