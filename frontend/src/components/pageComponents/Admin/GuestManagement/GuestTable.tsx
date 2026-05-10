import DataPagination from "@/components/common/DataPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetGuestsQuery } from "@/hooks/admin/guest-management/guest-management.hook";
import { useGuestManagementSearch } from "@/hooks/admin/guest-management/guest-management.search";
import { useGuestManagementStore } from "@/store/admin/guestManagement.store";
import type { GuestStatus } from "@/types/admin/guest-management.type";
import { format } from "date-fns";
import { MoreHorizontal, UserCheck, UserMinus } from "lucide-react";

const getStatusLabel = (status: GuestStatus) => {
    return status === "ACTIVE" ? "Active" : "Inactive";
}

const getStatusColor = (status: GuestStatus) => {
    switch (status) {
        case "ACTIVE":
            return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" };
        case "INACTIVE":
            return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
    }
}

const GuestTable = () => {
    const setViewId = useGuestManagementStore((state) => state.setViewId);
    const setDeactivateId = useGuestManagementStore((state) => state.setDeactivateId);
    const setReactivateId = useGuestManagementStore((state) => state.setReactivateId);

    const { search, status, page, limit, updatePage } = useGuestManagementSearch();

    const { data, isLoading } = useGetGuestsQuery({
        search,
        status,
        page,
        limit
    })

    if(isLoading) return null;

    const guests = data?.data;
    const meta = data?.meta;

    return (
        <Card className="px-4 min-h-147.5">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {guests?.map((guest) => {
                        const statusColor = getStatusColor(guest.status);
                        const isInactive = guest.status === "INACTIVE";

                        return (
                            <TableRow key={guest.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground">
                                            {guest.name || "Unnamed Guest"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {guest.id}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-primary break-all">
                                            {guest.email}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {guest.contactNo}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold text-foreground">
                                        {guest.bookingCount}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                                        {getStatusLabel(guest.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(guest.createdAt), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setViewId(guest.id)}>
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                            onClick={() => setDeactivateId(guest.id)}
                                            variant="destructive"
                                            disabled={isInactive}
                                            >
                                                <UserMinus className="w-4 h-4" />
                                                {isInactive ? "Already Inactive" : "Deactivate"}
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                            onClick={() => setReactivateId(guest.id)}
                                            disabled={!isInactive}
                                            >
                                                <UserCheck className="w-4 h-4 text-emerald-700" />
                                                {isInactive ? "Reactivate" : "Already Active"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {meta && (
                <DataPagination
                meta={meta}
                page={page}
                onPageChange={updatePage}
                />
            )}
        </Card>
    )
}

export default GuestTable
