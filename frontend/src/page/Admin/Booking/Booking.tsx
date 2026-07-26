import BookingFilter from "@/components/pageComponents/Admin/Booking/BookingFilter";
import BookingTable from "@/components/pageComponents/Admin/Booking/BookingTable";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import MarkCancelDialog from "@/components/pageComponents/Admin/Booking/MarkCancelDialog";
import MarkCompletedDialog from "@/components/pageComponents/Admin/Booking/MarkCompletedDialog";
import ReschedulingDialog from "@/components/pageComponents/Admin/Booking/ReschedulingDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const Booking = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <AdminPageHeader
        title="Bookings"
        description="Manage reservations, schedules, payment type, and booking actions."
        actions={
          <Button asChild>
            <Link to="/admin/booking/add">
              Add Booking
              <Plus className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <BookingFilter />
        <BookingTable />
      </div>

      <ReschedulingDialog />

      <MarkCompletedDialog />

      <MarkCancelDialog />
    </div>
  );
};

export default Booking;
