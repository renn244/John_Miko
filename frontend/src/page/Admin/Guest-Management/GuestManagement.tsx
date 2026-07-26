import DeactivateGuestDialog from "@/components/pageComponents/Admin/GuestManagement/DeactivateGuestDialog";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import GuestTable from "@/components/pageComponents/Admin/GuestManagement/GuestTable";
import ReactivateGuestDialog from "@/components/pageComponents/Admin/GuestManagement/ReactivateGuestDialog";
import ViewGuestDialog from "@/components/pageComponents/Admin/GuestManagement/ViewGuestDialog";

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
