import DataPagination from "@/components/common/DataPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetMaintenancesQuery, useReopenMaintenanceMutation, useStartMaintnenanceMutation } from "@/hooks/admin/maintenance.hook";
import { useMaintenanceSearch } from "@/hooks/admin/maintenance.search";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import type { Maintenance } from "@/types/admin/maintenance.type";
import { format } from "date-fns";
import { Check, Edit, Eye, MoreHorizontal, Play, RotateCcw } from "lucide-react";
import { Link, useNavigate } from "react-router";

const getStatusColor = (status: "Pending" | "InProgress" | "Completed" | "Closed") => {
    switch (status) {
        case "Pending":
            return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" };
        case "InProgress":
            return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" };
        case "Completed":
            return {  bg: "bg-green-100", text: "text-green-700", border: "border-green-300" };
        case "Closed":
            return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
    }
};

const getPriorityColor = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
        case "Low":
            return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
        case "Medium":
            return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" };
        case "High":
            return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-400" };
    }
};

const MaintenanceTable = () => {
    const setCompleteId = useMaintenanceStore((state) => state.setCompleteId);
    const navigate = useNavigate();

    const startMutation = useStartMaintnenanceMutation();
    const reopenMutation = useReopenMaintenanceMutation();

    const { search, status, priority, page, limit, updatePage } = useMaintenanceSearch();
    const { data, isLoading } = useGetMaintenancesQuery({ 
        search, page, limit,
        status: status as Maintenance['status'], 
        priority: priority as Maintenance['priority'] 
    });

    if (isLoading) {
        return (
            <Card className="min-h-147.5 px-4 py-5" role="status" aria-live="polite">
                <span className="sr-only">Loading maintenance tickets</span>
                <div className="space-y-3 animate-pulse">
                    <div className="h-5 w-2/3 rounded bg-muted" />
                    {Array.from({ length: 7 }, (_, index) => (
                        <div key={index} className="h-12 rounded-md bg-muted/65" />
                    ))}
                </div>
            </Card>
        );
    }

    const maintenance = data?.data;
    const meta = data?.meta

    return (
        <Card className="px-4 min-h-147.5">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            ID
                        </TableHead>
                        <TableHead>
                            Title
                        </TableHead>
                        <TableHead>
                            Priority
                        </TableHead>
                        <TableHead>
                            Status
                        </TableHead>
                        <TableHead>
                            Date
                        </TableHead>
                        <TableHead>
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {maintenance?.map((ticket: Maintenance) => {
                        return (
                            <TableRow key={ticket.id}>
                                <TableCell>
                                    {ticket.id}
                                </TableCell>
                                <TableCell>
                                    {ticket.title}
                                </TableCell>
                                <TableCell>
                                    <Badge className={
                                        `${getPriorityColor(ticket.priority).bg} ${getPriorityColor(ticket.priority).text} ${getPriorityColor(ticket.priority).border}`
                                    }>
                                        {ticket.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={
                                        `${getStatusColor(ticket.status).bg} ${getStatusColor(ticket.status).text} ${getStatusColor(ticket.status).border}`
                                    }>
                                        {ticket.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(ticket.createdAt), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon-sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/maintenance/${ticket.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                        Edit Details
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => navigate(`/admin/maintenance/${ticket.id}`)}>
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>

                                            {ticket.status === "Pending" && (
                                                <DropdownMenuItem disabled={startMutation.isPending} onClick={() => startMutation.mutate(ticket.id)}>
                                                    <Play className="h-4 w-4" />
                                                    Start Maintenance
                                                </DropdownMenuItem>
                                            )}

                                            {ticket.status === "InProgress" && (
                                                <DropdownMenuItem onClick={() => setCompleteId(ticket.id)}>
                                                    <Check className="h-4 w-4" />
                                                    Complete
                                                </DropdownMenuItem>
                                            )}

                                            {ticket.status === "Completed" && (
                                                <DropdownMenuItem disabled={reopenMutation.isPending} onClick={() => reopenMutation.mutate(ticket.id)}>
                                                    <RotateCcw className="h-4 w-4" />
                                                    Reopen Ticket
                                                </DropdownMenuItem>
                                            )}
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
    );
};

export default MaintenanceTable
