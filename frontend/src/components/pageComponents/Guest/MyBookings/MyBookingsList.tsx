import { useGetBookingsByUserQuery } from "@/hooks/booking.hook"
import type { BookingWithAccommodation, StateSelectedStatus } from "@/types/booking.types"
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react"
import { useMemo } from "react"
import BookingCard from "./BookingCard"
import EmptyListCard from "./EmptyListCard"

type MyBookingsListProps = {
    selectedStatus: StateSelectedStatus;
}

const MyBookingsList = ({
    selectedStatus
}: MyBookingsListProps) => {
    const { data, isLoading } = useGetBookingsByUserQuery()

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

    if(isLoading) return null

    return (
        <div className="space-y-4">

            {selectedStatus === "pending" && (
                groupedBookings.pending.length > 0 ? (
                    groupedBookings.pending.map(booking => <BookingCard booking={booking} /> )
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
                    groupedBookings.completed.map(booking => <BookingCard booking={booking} /> )
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
                    groupedBookings.confirmed.map(booking => <BookingCard booking={booking} /> )
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
                    groupedBookings.cancelled.map(booking => <BookingCard booking={booking} /> )
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