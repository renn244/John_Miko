import AdminTableEmptyState from "@/components/common/AdminTableEmptyState";
import AdminAvailabilityBadge from "@/components/common/AdminAvailabilityBadge";
import DataPagination from "@/components/common/DataPagination";
import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import GuestFilter from "@/components/pageComponents/Admin/GuestManagement/GuestFilter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetGuestsQuery } from "@/hooks/admin/guest-management/guest-management.hook";
import { useGuestManagementSearch } from "@/hooks/admin/guest-management/guest-management.search";
import { useGuestManagementStore } from "@/store/admin/guestManagement.store";
import { format } from "date-fns";
import { Eye, MoreHorizontal, UserCheck, UserMinus } from "lucide-react";

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
                    <div className="space-y-3 p-3 md:hidden">
                        {guests.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                {search || status ? "No guests found for the current filters." : "No guest accounts yet."}
                            </p>
                        ) : guests.map((guest) => {
                            const isInactive = guest.status === "INACTIVE";

                            return (
                                <article key={guest.id} className="rounded-xl border bg-card p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold tracking-tight">{guest.name || "Unnamed Guest"}</p>
                                            <p className="mt-1 truncate text-xs text-muted-foreground">{guest.id}</p>
                                        </div>
                                        <AdminAvailabilityBadge active={!isInactive} className="shrink-0" />
                                    </div>

                                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y py-3 text-sm">
                                        <div className="col-span-2 min-w-0">
                                            <dt className="text-xs text-muted-foreground">Email</dt>
                                            <dd className="mt-1 break-all font-medium text-primary">{guest.email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Contact</dt>
                                            <dd className="mt-1 font-medium">{guest.contactNo || "—"}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Bookings</dt>
                                            <dd className="mt-1 font-medium">{guest.bookingCount}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Registered</dt>
                                            <dd className="mt-1 font-medium">{format(new Date(guest.createdAt), "MMM dd, yyyy")}</dd>
                                        </div>
                                    </dl>

                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <Button variant="outline" size="sm" onClick={() => setViewId(guest.id)}>
                                            <Eye className="size-4" />
                                            View guest
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon-sm" aria-label={`Guest actions for ${guest.name || guest.email}`}>
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setViewId(guest.id)}>
                                                    <Eye className="size-4" />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                onClick={() => setDeactivateId(guest.id)}
                                                variant="destructive"
                                                disabled={isInactive}
                                                >
                                                    <UserMinus className="size-4" />
                                                    {isInactive ? "Already Inactive" : "Deactivate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setReactivateId(guest.id)} disabled={!isInactive}>
                                                    <UserCheck className="size-4" />
                                                    {isInactive ? "Reactivate" : "Already Active"}
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
                                                <AdminAvailabilityBadge active={!isInactive} />
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
                                                            size="icon-sm"
                                                            className="text-muted-foreground transition-colors group-hover:text-foreground"
                                                            aria-label={`Guest actions for ${guest.name || guest.email}`}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setViewId(guest.id)}>
                                                                <Eye className="h-4 w-4" />
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
                                                                <UserCheck className="h-4 w-4" />
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

                    </div>

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
            )}
        </>
    );
};

export default GuestTable;
