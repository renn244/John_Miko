import Footer from "@/components/common/Footer"
import NavBar from "@/components/common/NavBar"
import {
    GuestContainer,
    GuestPageHeader,
    GuestPageShell,
} from "@/components/guest"
import MyBookingsList from "@/components/pageComponents/Guest/MyBookings/MyBookingsList"
import MyBookingStatusFilter from "@/components/pageComponents/Guest/MyBookings/MyBookingStatusFilter"
import type { StateSelectedStatus } from "@/types/booking.types"
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
