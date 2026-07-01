import { Button } from "@/components/ui/button"
import { useGetBookingsByUserQuery } from "@/hooks/booking.hook"
import type { BookingWithAccommodation, StateSelectedStatus } from "@/types/booking.types"
import { AlertCircle, Calendar, CheckCircle, Clock, RefreshCcw, XCircle } from "lucide-react"
import { useMemo } from "react"
import BookingCard from "./BookingCard"
import EmptyListCard from "./EmptyListCard"

type MyBookingsListProps = {
    selectedStatus: StateSelectedStatus;
}

const MyBookingsList = ({
    selectedStatus
}: MyBookingsListProps) => {
    const { data, isLoading, isError, refetch, isRefetching } = useGetBookingsByUserQuery()

    const groupedBookings = useMemo(() => {
        const groups: Record<StateSelectedStatus, BookingWithAccommodation[]> = {
            pending: [],
            completed: [],
            confirmed: [],
            cancelled: []
        }

        if (data) {
            data.forEach(booking => {
                const status = booking.status.toLowerCase() as StateSelectedStatus
                if (groups[status]) {
                    groups[status].push(booking)
                }
            })
        } 

        return groups
    }, [data])

    if(isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((item) => (
                    <div key={item} className="rounded-xl border bg-card p-4 shadow-sm md:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="h-36 w-full rounded-lg bg-muted sm:h-32 sm:w-48" />
                            <div className="flex flex-1 flex-col gap-3">
                                <div className="h-5 w-48 rounded bg-muted" />
                                <div className="h-4 w-36 rounded bg-muted" />
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="h-10 rounded bg-muted/70" />
                                    <div className="h-10 rounded bg-muted/70" />
                                    <div className="h-10 rounded bg-muted/70" />
                                    <div className="h-10 rounded bg-muted/70" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if(isError) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Unable to load bookings</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    We encountered an issue while retrieving your reservations. Please try again.
                </p>
                <Button className="mt-5" onClick={() => refetch()} disabled={isRefetching}>
                    <RefreshCcw className="size-4" />
                    Retry
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">

            {selectedStatus === "pending" && (
                groupedBookings.pending.length > 0 ? (
                    groupedBookings.pending.map(booking => <BookingCard key={booking.id} booking={booking} /> )
                ) : (
                    <EmptyListCard
                    status={selectedStatus}
                    message="Your bookings are pending verification."
                    icon={Clock}
                    />
                )
            )}

            {selectedStatus === "completed" && (
                groupedBookings.completed.length > 0 ?  (
                    groupedBookings.completed.map(booking => <BookingCard key={booking.id} booking={booking} /> )
                ) : (
                    <EmptyListCard 
                    status={selectedStatus} 
                    message="You don't have any completed bookings yet."
                    icon={CheckCircle}
                    />
                )
            )}

            {selectedStatus === "confirmed" && (
                groupedBookings.confirmed.length > 0 ? (
                    groupedBookings.confirmed.map(booking => <BookingCard key={booking.id} booking={booking} /> )
                ) : (
                    <EmptyListCard  
                    status={selectedStatus}
                    message="You don't have any confirmed bookings at the moment."
                    icon={Calendar}
                    />
                )
            )}

            {selectedStatus === "cancelled" && (
                groupedBookings.cancelled.length > 0 ? (
                    groupedBookings.cancelled.map(booking => <BookingCard key={booking.id} booking={booking} /> )
                ) : (
                    <EmptyListCard 
                    status={selectedStatus}
                    message="You don't have any cancelled bookings."
                    icon={XCircle}
                    />
                )
            )}

        </div>
    )
}

export default MyBookingsList
