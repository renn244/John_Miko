import { Button } from "@/components/ui/button"
import ManualBookingForm from "@/forms/Admin/Booking/ManualBookingForm"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"

const AddBooking = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-6">

            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline" aria-label="Back to bookings">
                    <Link to="/admin/booking">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Add New Booking
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Fill in the details below to create a new booking
                    </p>
                </div>
            </div>

            <ManualBookingForm />
        </div>
    )
}

export default AddBooking
