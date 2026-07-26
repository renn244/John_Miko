import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import AdminDecisionNotice from "@/components/common/AdminDecisionNotice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useChangeBookingStatusAdminMutation, useGetBookingById } from "@/hooks/admin/booking.hook";
import getCheckInOut from "@/lib/getCheckInOut";
import { useBookingAdminStore } from "@/store/admin/bookingAdmin.store";
import type { BookingWithAccommodation } from "@/types/booking.types";
import { AlertTriangle, XCircle } from "lucide-react";

const MarkCancelDialog = () => {
    const isMarkCancelOpen = useBookingAdminStore((state) => state.isMarkCancelOpen);
    const markCancelBookingId = useBookingAdminStore((state) => state.markCancelBookingId);
    const setIsMarkCancelOpen = useBookingAdminStore((state) => state.setIsMarkCancelOpen);
    const setMarkCancelBookingId = useBookingAdminStore((state) => state.setMarkCancelBookingId);

    const { data, isLoading, error, refetch, isRefetching } = useGetBookingById(markCancelBookingId);

    return (
        <Dialog open={isMarkCancelOpen}  onOpenChange={setIsMarkCancelOpen}>
            <DialogContent className="sm:max-w-xl" onCloseAutoFocus={() => setMarkCancelBookingId(undefined)}>
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsMarkCancelOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isMarkCancelOpen) && (
                    <NotFoundDialog 
                    onBack={() => setIsMarkCancelOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Booking Not Found"
                    />
                )}
                {data && <MarkCancelBooking booking={data} />}
            </DialogContent>
        </Dialog>
    )
}

const MarkCancelBooking = ({ booking } : { booking: BookingWithAccommodation }) => {
    const setIsMarkCancelOpen = useBookingAdminStore((state) => state.setIsMarkCancelOpen);

    const { checkOut } = getCheckInOut({
        bookingDate: booking.bookingDate,
        startTime: booking.stayOption?.startTime,
        endTime: booking.stayOption?.endTime,
        label: booking.stayOption?.label ?? booking.stayOptionLabelSnapshot,
    });
    const { mutateAsync, isPending } = useChangeBookingStatusAdminMutation(booking.id);

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Cancel Booking
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                
                <AdminDecisionNotice
                    tone="destructive"
                    icon={AlertTriangle}
                    title="Mark as Cancelled"
                    description="Cancelling this booking will permanently change its status to Cancelled."
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
                    Do you want to proceed with this change?
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button 
                type="button" 
                onClick={() => setIsMarkCancelOpen(false)} 
                variant="outline"
                >
                    Cancel
                </Button>
                <Button
                type="button"
                disabled={isPending}
                onClick={async () => {
                    await mutateAsync("Cancelled")
                    setIsMarkCancelOpen(false)
                }}
                variant="destructive"
                >
                    {
                        isPending ? 
                            <LoadingSpinner /> :
                            <>
                                <XCircle className="w-5 h-5" />
                                Yes, Mark as Cancelled
                            </>
                    }
                </Button>
            </div>
        </>
    )

}

export default MarkCancelDialog
