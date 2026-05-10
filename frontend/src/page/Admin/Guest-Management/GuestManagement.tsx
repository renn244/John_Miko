import DeactivateGuestDialog from "@/components/pageComponents/Admin/GuestManagement/DeactivateGuestDialog";
import GuestFilter from "@/components/pageComponents/Admin/GuestManagement/GuestFilter";
import GuestTable from "@/components/pageComponents/Admin/GuestManagement/GuestTable";
import ReactivateGuestDialog from "@/components/pageComponents/Admin/GuestManagement/ReactivateGuestDialog";
import ViewGuestDialog from "@/components/pageComponents/Admin/GuestManagement/ViewGuestDialog";

const GuestManagement = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    User Management
                </h1>
                <p className="text-sm mt-1 text-muted-foreground">
                    Manage guest accounts and active status
                </p>
            </div>

            <GuestFilter />
            <GuestTable />

            <ViewGuestDialog />
            <DeactivateGuestDialog />
            <ReactivateGuestDialog />
        </div>
    )
}

export default GuestManagement
