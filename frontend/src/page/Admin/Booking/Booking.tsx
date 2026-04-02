import BookingFilter from "@/components/pageComponents/Admin/Booking/BookingFilter";
import BookingTable from "@/components/pageComponents/Admin/Booking/BookingTable";
import ReschedulingDialog from "@/components/pageComponents/Admin/Booking/ReschedulingDialog";
import ViewBookingDialog from "@/components/pageComponents/Admin/Booking/ViewBookingDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const Booking = () => {

    return (
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Booking Management
                    </h1>
                    <p className="text-sm mt-1 text-muted-foreground">
                        Manage and monitor all confirmed reservations
                    </p>
                </div>
                <Link to="/admin/booking/add">
                    <Button>
                        Add Booking
                        <Plus className="w-5 h-5 text-white" />
                    </Button>
                </Link>
            </div>

            <BookingFilter />

            <BookingTable />

            <ViewBookingDialog />

            <ReschedulingDialog />
        </div>
    )
}

export default Booking