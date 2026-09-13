import Footer from "@/features/public/layout/components/Footer"
import NavBar from "@/features/public/layout/components/NavBar"
import {
    GuestContainer,
    GuestPageHeader,
    GuestPageShell,
} from "@/features/public/layout/components/guest"
import MyBookingsList from "@/features/public/bookings/components/MyBookingsList"
import MyBookingStatusFilter from "@/features/public/bookings/components/MyBookingStatusFilter"
import type { StateSelectedStatus } from "@/features/shared/bookings/types/booking.type"
import { useState } from "react"

const MyBookings = () => {
    const [selectedStatus, setSelectedStatus] = useState<StateSelectedStatus>("pending");

    return (
        <GuestPageShell>
            <NavBar />

            <GuestContainer className="pb-10">
                <GuestPageHeader
                    title="My Bookings"
                    description="View your reservations, payment status, and stay details."
                />

                <MyBookingStatusFilter 
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                />

                <MyBookingsList 
                selectedStatus={selectedStatus}
                />
            </GuestContainer>

            <Footer />
        </GuestPageShell>
    )
}

export default MyBookings
