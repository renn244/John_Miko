import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import ReschedulingForm from "@/forms/Admin/Booking/ReschedulingForm";
import { useGetBookingById, useRescheduleBookingAdminMutation } from "@/hooks/admin/booking.hook";
import { toDateOnly } from "@/lib/date.util";
import getCheckInOut from "@/lib/getCheckInOut";
import { useBookingAdminStore } from "@/store/admin/bookingAdmin.store";
import type { BookingWithAccommodation } from "@/types/booking.types";

const ReschedulingDialog = () => {
    const isRescheduleOpen = useBookingAdminStore((state) => state.isRescheduleOpen);
    const rescheduleBookingId = useBookingAdminStore((state) => state.rescheduleBookingId);
    const setIsRescheduleOpen = useBookingAdminStore((state) => state.setIsRescheduleOpen);

    const { data, isLoading, error, refetch, isRefetching } = useGetBookingById(rescheduleBookingId);

    return (
        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
            <DialogContent className="sm:max-w-2xl">
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsRescheduleOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isRescheduleOpen) && (
                    <NotFoundDialog 
                    onBack={() => setIsRescheduleOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Booking Not Found"
                    />
                )}
                {data && <BookingReschedule booking={data} />}
            </DialogContent>
        </Dialog>
    )
}

const BookingReschedule = ({ booking }: { booking: BookingWithAccommodation }) => {
    const setIsRescheduleOpen = useBookingAdminStore((state) => state.setIsRescheduleOpen);

    const { mutateAsync: rescheduleBooking, isPending: reschedulingLoading } = useRescheduleBookingAdminMutation(booking.id)

    const { 
        checkIn, checkOut
    } = getCheckInOut({
        bookingDate: booking.bookingDate,
        startTime: booking.stayOption?.startTime,
        endTime: booking.stayOption?.endTime,
        label: booking.stayOption?.label ?? booking.stayOptionLabelSnapshot,
    });

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Reschedule Booking
                </DialogTitle>
                <DialogDescription>
                    Change Booking Date and Time Slot
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">

                <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="mb-2 text-sm font-semibold text-muted-foreground">
                        Current Booking Details:
                    </p>
                    <div className="space-y-1">
                        <p className="text-sm">
                            <span className="font-semibold">Guest:</span> {booking.guestName}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Accommodation:</span> {booking.accommodation.name}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border p-4 bg-card">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide">
                        Original Dates
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div>
                            <p className="text-sm text-muted-foreground">Check-in</p>
                            <p className="font-semibold">
                                {checkIn}
                            </p>
                        </div>
                        <div className="text-2xl text-muted-foreground">→</div>
                        <div>
                            <p className="text-sm text-muted-foreground">Check-out</p>
                            <p className="font-semibold">
                                {checkOut}
                            </p>
                        </div>
                    </div>
                </div>

                <ReschedulingForm 
                onsubmit={async (data) => {
                    await rescheduleBooking({ 
                        bookingId: booking.id,
                        bookingDate: toDateOnly(data.bookingDate),
                        stayOptionId: data.stayOptionId
                    })

                    setIsRescheduleOpen(false)
                }}
                onCancel={() => setIsRescheduleOpen(false)}
                isLoading={reschedulingLoading}
                initialData={{
                    bookingDate: new Date(booking.bookingDate),
                    stayOptionId: booking.stayOptionId
                }}
                accommodationId={booking.accommodation.id}
                />
            </div>
        </>
    ) 
}

export default ReschedulingDialog
