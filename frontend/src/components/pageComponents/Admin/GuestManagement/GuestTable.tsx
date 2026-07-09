import AdminTableEmptyState from "@/components/common/AdminTableEmptyState";
import DataPagination from "@/components/common/DataPagination";
import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import GuestFilter from "@/components/pageComponents/Admin/GuestManagement/GuestFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetGuestsQuery } from "@/hooks/admin/guest-management/guest-management.hook";
import { useGuestManagementSearch } from "@/hooks/admin/guest-management/guest-management.search";
import { cn } from "@/lib/utils";
import { useGuestManagementStore } from "@/store/admin/guestManagement.store";
import type { GuestStatus } from "@/types/admin/guest-management.type";
import { format } from "date-fns";
import { MoreHorizontal, UserCheck, UserMinus } from "lucide-react";

const getStatusLabel = (status: GuestStatus) => {
    return status === "ACTIVE" ? "Active" : "Inactive";
};

const getStatusColor = (status: GuestStatus) => {
    switch (status) {
        case "ACTIVE":
            return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" };
        case "INACTIVE":
            return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
    }
};

const GuestTable = () => {
    const setViewId = useGuestManagementStore((state) => state.setViewId);
    const setDeactivateId = useGuestManagementStore((state) => state.setDeactivateId);
    const setReactivateId = useGuestManagementStore((state) => state.setReactivateId);

    const { search, status, page, limit, updatePage } = useGuestManagementSearch();
    const { data, isLoading, error, refetch, isRefetching } = useGetGuestsQuery({
        search,
        status,
        page,
        limit,
    });

    const guests = data?.data ?? [];
    const meta = data?.meta;

    return (
        <>
            <div className="border-b bg-card px-4 py-3">
                <GuestFilter />
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
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Guest</TableHead>
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Contact</TableHead>
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Bookings</TableHead>
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Status</TableHead>
                                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-[0.01em] text-muted-foreground">Registered</TableHead>
                                    <TableHead className="px-4 py-3 text-right text-xs font-semibold tracking-[0.01em] text-muted-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guests.length === 0 && (
                                    <AdminTableEmptyState
                                    colSpan={6}
                                    emptyMessage="No guest accounts yet."
                                    filteredMessage="No guests found for the current filters."
                                    hasActiveFilters={Boolean(search || status)}
                                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                                    />
                                )}
                                {guests.map((guest) => {
                                    const statusColor = getStatusColor(guest.status);
                                    const isInactive = guest.status === "INACTIVE";

                                    return (
                                        <TableRow key={guest.id} className="group hover:bg-primary/[0.03]">
                                            <TableCell className="px-4 py-4 transition-colors group-hover:text-foreground">
                                                <div className="flex flex-col">
                                                    <span className="font-medium tracking-tight text-foreground">
                                                        {guest.name || "Unnamed Guest"}
                                                    </span>
                                                    <span className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
                                                        {guest.id}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 align-top">
                                                <div className="flex flex-col">
                                                    <span className="break-all text-sm font-medium text-primary">
                                                        {guest.email}
                                                    </span>
                                                    <span className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
                                                        {guest.contactNo}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 align-top">
                                                <span className="text-sm font-medium text-foreground">
                                                    {guest.bookingCount}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 align-top">
                                                <Badge className={cn("shadow-none", statusColor.bg, statusColor.text, statusColor.border)}>
                                                    {getStatusLabel(guest.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 align-top text-sm text-muted-foreground">
                                                {format(new Date(guest.createdAt), "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 text-right align-top">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="h-auto px-0 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary"
                                                    onClick={() => setViewId(guest.id)}
                                                    >
                                                        View
                                                    </Button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setViewId(guest.id)}>
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                            onClick={() => setDeactivateId(guest.id)}
                                                            variant="destructive"
                                                            disabled={isInactive}
                                                            >
                                                                <UserMinus className="h-4 w-4" />
                                                                {isInactive ? "Already Inactive" : "Deactivate"}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                            onClick={() => setReactivateId(guest.id)}
                                                            disabled={!isInactive}
                                                            >
                                                                <UserCheck className="h-4 w-4 text-emerald-700" />
                                                                {isInactive ? "Reactivate" : "Already Active"}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
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
                                total: guests.length,
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

export default GuestTable;
