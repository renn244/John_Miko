import NavBar from "@/components/common/NavBar"
import MyBookingsList from "@/components/pageComponents/Guest/MyBookings/MyBookingsList"
import MyBookingStatusFilter from "@/components/pageComponents/Guest/MyBookings/MyBookingStatusFilter"
import type { StateSelectedStatus } from "@/types/booking.types"
import { useState } from "react"

const MyBookings = () => {
    const [selectedStatus, setSelectedStatus] = useState<StateSelectedStatus>("pending");

    return (
        <div className="min-h-screen">
            <NavBar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                <div className="mb-4">
                    <h1 className="text-4xl font-bold mb-2">
                        My Bookings
                    </h1>
                    <p className="text-muted-foreground">
                        View and review all your bookings
                    </p>
                </div>

                <MyBookingStatusFilter 
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                />

                <MyBookingsList 
                selectedStatus={selectedStatus}
                />
            </div>
        </div>
    )
}

export default MyBookings