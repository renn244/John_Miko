import DeactivateGuestDialog from "@/components/pageComponents/Admin/GuestManagement/DeactivateGuestDialog";
import GuestTable from "@/components/pageComponents/Admin/GuestManagement/GuestTable";
import ReactivateGuestDialog from "@/components/pageComponents/Admin/GuestManagement/ReactivateGuestDialog";
import ViewGuestDialog from "@/components/pageComponents/Admin/GuestManagement/ViewGuestDialog";

const GuestManagement = () => {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-5">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    Guest Management
                </h1>
                <p className="text-sm mt-1 text-muted-foreground">
                    Manage guest accounts, booking activity, and account status.
                </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
                <GuestTable />
            </div>

            <ViewGuestDialog />
            <DeactivateGuestDialog />
            <ReactivateGuestDialog />
        </div>
    )
}

export default GuestManagement
