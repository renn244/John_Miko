import DataPagination from "@/components/common/DataPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetStaffsQuery } from "@/hooks/admin/staff-management.hook";
import { useStaffManagementSearch } from "@/hooks/admin/staff-management.search";
import { useStaffManagementStore } from "@/store/admin/staffManagement.store";
import type { StaffRole, StaffStatus } from "@/types/admin/staff-management.type";
import { format } from "date-fns";
import { MoreHorizontal, UserCheck, UserCog, UserMinus } from "lucide-react";

const getRoleLabel = (role: StaffRole) => {
    return role === "KITCHEN_STAFF" ? "Kitchen Staff" : "Resort Staff";
}

const getStatusLabel = (status: StaffStatus) => {
    return status === "ACTIVE" ? "Active" : "Inactive";
}

const getRoleColor = (role: StaffRole) => {
    switch (role) {
        case "KITCHEN_STAFF":
            return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" };
        case "RESORT_STAFF":
            return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" };
    }
}

const getStatusColor = (status: StaffStatus) => {
    switch (status) {
        case "ACTIVE":
            return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" };
        case "INACTIVE":
            return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
    }
}

const StaffTable = () => {
    const setChangeRoleId = useStaffManagementStore((state) => state.setChangeRoleId);
    const setDeactivateId = useStaffManagementStore((state) => state.setDeactivateId);
    const setReactivateId = useStaffManagementStore((state) => state.setReactivateId);

    const { search, role, status, page, limit, updatePage } = useStaffManagementSearch();
    const { data, isLoading } = useGetStaffsQuery({
        search,
        role,
        status,
        page,
        limit
    });

    if(isLoading) return null;

    const staffs = data?.data;
    const meta = data?.meta;

    return (
        <Card className="px-4 min-h-147.5">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staffs?.map((staff) => {
                        const roleColor = getRoleColor(staff.role);
                        const statusColor = getStatusColor(staff.status);
                        const isInactive = staff.status === "INACTIVE";

                        return (
                            <TableRow key={staff.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground">
                                            {staff.name || "Unnamed Staff"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {staff.id}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-primary break-all">
                                            {staff.email}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {staff.contactNo}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${roleColor.bg} ${roleColor.text} ${roleColor.border}`}>
                                        {getRoleLabel(staff.role)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                                        {getStatusLabel(staff.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(staff.createdAt), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setChangeRoleId(staff.id)}>
                                                <UserCog className="w-4 h-4 text-primary" />
                                                Change Role
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                            onClick={() => setDeactivateId(staff.id)}
                                            variant="destructive"
                                            disabled={isInactive}
                                            >
                                                <UserMinus className="w-4 h-4" />
                                                {isInactive ? "Already Inactive" : "Deactivate"}
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                            onClick={() => setReactivateId(staff.id)}
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

export default StaffTable
