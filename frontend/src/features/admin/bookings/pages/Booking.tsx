import BookingFilter from "@/features/admin/bookings/components/BookingFilter";
import BookingTable from "@/features/admin/bookings/components/BookingTable";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import MarkCancelDialog from "@/features/admin/bookings/components/MarkCancelDialog";
import MarkCompletedDialog from "@/features/admin/bookings/components/MarkCompletedDialog";
import ReschedulingDialog from "@/features/admin/bookings/components/ReschedulingDialog";
import { Button } from "@/components/ui/button";
import { ClipboardPlus, Plus } from "lucide-react";
import { Link } from "react-router";

const Booking = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <AdminPageHeader
        title="Bookings"
        description="Manage reservations, schedules, payment type, and booking actions."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/admin/booking/walk-in">Record Walk-in<ClipboardPlus className="size-4" /></Link></Button>
            <Button asChild><Link to="/admin/booking/add">Add Booking<Plus className="size-4" /></Link></Button>
          </div>
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
