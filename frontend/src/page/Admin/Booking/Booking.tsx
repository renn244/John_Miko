import BookingFilter from "@/components/pageComponents/Admin/Booking/BookingFilter";
import BookingTable from "@/components/pageComponents/Admin/Booking/BookingTable";
import MarkCancelDialog from "@/components/pageComponents/Admin/Booking/MarkCancelDialog";
import MarkCompletedDialog from "@/components/pageComponents/Admin/Booking/MarkCompletedDialog";
import ReschedulingDialog from "@/components/pageComponents/Admin/Booking/ReschedulingDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const Booking = () => {

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Bookings
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage reservations, schedules, payment type, and booking actions.
                    </p>
                </div>
                <Link to="/admin/booking/add">
                    <Button>
                        Add Booking
                        <Plus className="size-4" />
                    </Button>
                </Link>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
                <BookingFilter />
                <BookingTable />
            </div>

            <ReschedulingDialog />

            <MarkCompletedDialog />

            <MarkCancelDialog />
        </div>
    )
}

export default Booking
