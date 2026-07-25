import AdminTableEmptyState from "@/components/common/AdminTableEmptyState";
import DataPagination from "@/components/common/DataPagination";
import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import StaffFilter from "@/components/pageComponents/Admin/StaffManagement/StaffFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetStaffsQuery } from "@/hooks/admin/staff-management.hook";
import { useStaffManagementSearch } from "@/hooks/admin/staff-management.search";
import { cn } from "@/lib/utils";
import { useStaffManagementStore } from "@/store/admin/staffManagement.store";
import type { StaffRole, StaffStatus, StaffUser } from "@/types/admin/staff-management.type";
import { format } from "date-fns";
import { MoreHorizontal, UserCheck, UserCog, UserMinus } from "lucide-react";

const getRoleLabel = (role: StaffRole) => {
    switch (role) {
        case "KITCHEN_STAFF":
            return "Kitchen Staff";
        case "RESORT_STAFF":
            return "Resort Staff";
        case "MAINTENANCE_STAFF":
            return "Maintenance Staff";
    }
};

const getStatusLabel = (status: StaffStatus) => {
    return status === "ACTIVE" ? "Active" : "Inactive";
};

const getRoleColor = (role: StaffRole) => {
    switch (role) {
        case "KITCHEN_STAFF":
            return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" };
        case "RESORT_STAFF":
            return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" };
        case "MAINTENANCE_STAFF":
            return { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-300" };
    }
};

const getExpertiseLabel = (staff: StaffUser) => {
    if (staff.role !== "MAINTENANCE_STAFF") {
        return null;
    }

    return staff.expertise ?? "No expertise";
};

const getStatusColor = (status: StaffStatus) => {
    switch (status) {
        case "ACTIVE":
            return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" };
        case "INACTIVE":
            return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
    }
};

const StaffTable = () => {
    const setChangeRoleId = useStaffManagementStore((state) => state.setChangeRoleId);
    const setDeactivateId = useStaffManagementStore((state) => state.setDeactivateId);
    const setReactivateId = useStaffManagementStore((state) => state.setReactivateId);

    const { search, role, status, page, limit, updatePage } = useStaffManagementSearch();
    const { data, isLoading, error, refetch, isRefetching } = useGetStaffsQuery({
        search,
        role,
        status,
        page,
        limit,
    });

    const staffs = data?.data ?? [];
    const meta = data?.meta;

    return (
        <>
            <div className="border-b bg-card px-4 py-3">
                <StaffFilter />
            </div>

            {isLoading && (
                <div className="flex min-h-[320px] items-center justify-center px-6 py-12">
                    <LoadingSpinner className="size-8" />
                </div>
            )}

            {error && (
                <div className="p-6">
                    <ErrorDialog
                    onBack={() => undefined}
                    onRetry={refetch}
                    retryLoading={isRefetching}
                    />
                </div>
            )}

            {!isLoading && !error && (
                <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex min-h-0 flex-1 flex-col overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/70">
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Name / ID</TableHead>
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Contact</TableHead>
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Role</TableHead>
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Expertise</TableHead>
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Status</TableHead>
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Joined</TableHead>
                                    <TableHead className="px-4 py-3 text-right text-xs font-semibold tracking-[0.01em] text-muted-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staffs.length === 0 && (
                                    <AdminTableEmptyState
                                    colSpan={7}
                                    emptyMessage="No staff accounts yet."
                                    filteredMessage="No staff members found for the current filters."
                                    hasActiveFilters={Boolean(search || role || status)}
                                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                                    />
                                )}
                                {staffs.map((staff) => {
                                    const roleColor = getRoleColor(staff.role);
                                    const statusColor = getStatusColor(staff.status);
                                    const isInactive = staff.status === "INACTIVE";

                                    return (
                                        <TableRow key={staff.id} className="group hover:bg-primary/[0.03]">
                                            <TableCell className="px-4 py-4 transition-colors group-hover:text-foreground">
                                                <div className="flex flex-col">
                                                    <span className="font-medium tracking-tight text-foreground">
                                                        {staff.name || "Unnamed Staff"}
                                                    </span>
                                                    <span className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
                                                        {staff.id}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 align-top">
                                                <div className="flex flex-col">
                                                    <span className="break-all text-sm font-medium text-primary">
                                                        {staff.email}
                                                    </span>
                                                    <span className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
                                                        {staff.contactNo}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 align-top">
                                                <Badge className={cn("shadow-none", roleColor.bg, roleColor.text, roleColor.border)}>
                                                    {getRoleLabel(staff.role)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 align-top text-sm text-muted-foreground">
                                                {getExpertiseLabel(staff) ?? "-"}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 align-top">
                                                <Badge className={cn("shadow-none", statusColor.bg, statusColor.text, statusColor.border)}>
                                                    {getStatusLabel(staff.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 align-top text-sm text-muted-foreground">
                                                {format(new Date(staff.createdAt), "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 text-right align-top">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className="text-muted-foreground transition-colors group-hover:text-foreground"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setChangeRoleId(staff.id)}>
                                                            <UserCog className="h-4 w-4" />
                                                            Change Role
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                        onClick={() => setDeactivateId(staff.id)}
                                                        variant="destructive"
                                                        disabled={isInactive}
                                                        >
                                                            <UserMinus className="h-4 w-4" />
                                                            {isInactive ? "Already Inactive" : "Deactivate"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                        onClick={() => setReactivateId(staff.id)}
                                                        disabled={!isInactive}
                                                        >
                                                            <UserCheck className="h-4 w-4" />
                                                            {isInactive ? "Reactivate" : "Already Active"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        <div className="mt-auto border-t bg-background/80 px-4 py-4">
                            <DataPagination
                            meta={meta}
                            fallbackMeta={{
                                total: staffs.length,
                                limit,
                            }}
                            page={page}
                            onPageChange={updatePage}
                            showSinglePageControls
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StaffTable;
