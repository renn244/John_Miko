import DeactivateGuestDialog from "@/features/admin/guest-management/components/DeactivateGuestDialog";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import GuestTable from "@/features/admin/guest-management/components/GuestTable";
import ReactivateGuestDialog from "@/features/admin/guest-management/components/ReactivateGuestDialog";
import ViewGuestDialog from "@/features/admin/guest-management/components/ViewGuestDialog";

const GuestManagement = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <AdminPageHeader
        title="Guest Management"
        description="Manage guest accounts, booking activity, and account status."
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <GuestTable />
      </div>

      <ViewGuestDialog />
      <DeactivateGuestDialog />
      <ReactivateGuestDialog />
    </div>
  );
};

export default GuestManagement;
