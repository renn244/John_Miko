import AdminTableEmptyState from "@/components/common/AdminTableEmptyState";
import AdminAvailabilityBadge from "@/components/common/AdminAvailabilityBadge";
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
import type { StaffRole, StaffUser } from "@/types/admin/staff-management.type";
import { format } from "date-fns";
import { MoreHorizontal, Trash2, UserCheck, UserCog, UserMinus } from "lucide-react";

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

const StaffTable = () => {
    const setChangeRoleId = useStaffManagementStore((state) => state.setChangeRoleId);
    const setDeactivateId = useStaffManagementStore((state) => state.setDeactivateId);
    const setReactivateId = useStaffManagementStore((state) => state.setReactivateId);
    const setDeleteId = useStaffManagementStore((state) => state.setDeleteId);

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
                    <div className="space-y-3 p-3 md:hidden">
                        {staffs.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                {search || role || status ? "No staff members found for the current filters." : "No staff accounts yet."}
                            </p>
                        ) : staffs.map((staff) => {
                            const roleColor = getRoleColor(staff.role);
                            const isInactive = staff.status === "INACTIVE";

                            return (
                                <article key={staff.id} className="rounded-xl border bg-card p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold tracking-tight">{staff.name || "Unnamed Staff"}</p>
                                            <p className="mt-1 truncate text-xs text-muted-foreground">{staff.id}</p>
                                        </div>
                                        <AdminAvailabilityBadge active={!isInactive} className="shrink-0" />
                                    </div>

                                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y py-3 text-sm">
                                        <div className="col-span-2 min-w-0">
                                            <dt className="text-xs text-muted-foreground">Email</dt>
                                            <dd className="mt-1 break-all font-medium text-primary">{staff.email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Role</dt>
                                            <dd className="mt-1">
                                                <Badge className={cn("shadow-none", roleColor.bg, roleColor.text, roleColor.border)}>
                                                    {getRoleLabel(staff.role)}
                                                </Badge>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Expertise</dt>
                                            <dd className="mt-1 font-medium">{getExpertiseLabel(staff) ?? "—"}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Contact</dt>
                                            <dd className="mt-1 font-medium">{staff.contactNo || "—"}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Joined</dt>
                                            <dd className="mt-1 font-medium">{format(new Date(staff.createdAt), "MMM dd, yyyy")}</dd>
                                        </div>
                                    </dl>

                                    <div className="mt-3 flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon-sm" aria-label={`Staff actions for ${staff.name || staff.email}`}>
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setChangeRoleId(staff.id)}>
                                                    <UserCog className="size-4" />
                                                    Change Role
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                onClick={() => setDeactivateId(staff.id)}
                                                variant="destructive"
                                                disabled={isInactive}
                                                >
                                                    <UserMinus className="size-4" />
                                                    {isInactive ? "Already Inactive" : "Deactivate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setReactivateId(staff.id)} disabled={!isInactive}>
                                                    <UserCheck className="size-4" />
                                                    {isInactive ? "Reactivate" : "Already Active"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setDeleteId(staff.id)} variant="destructive">
                                                    <Trash2 className="size-4" />
                                                    Delete Staff
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="hidden min-h-0 flex-1 flex-col overflow-x-auto md:flex">
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
                                                <AdminAvailabilityBadge active={!isInactive} />
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
                                                        aria-label={`Staff actions for ${staff.name || staff.email}`}
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
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setDeleteId(staff.id)} variant="destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete Staff
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

                    </div>

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
            )}
        </>
    );
};

export default StaffTable;
