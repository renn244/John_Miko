import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClosedMaintenanceMutation, useGetMaintenancesQuery, useStartMaintnenanceMutation } from "@/hooks/admin/maintenance.hook";
import { useMaintenanceSearch } from "@/hooks/admin/maintenance.search";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import { format } from "date-fns";
import { Check, Edit, Lock, MoreHorizontal, Play } from "lucide-react";
import { Link } from "react-router";

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
    const setViewId = useMaintenanceStore((state) => state.setViewId);
    const setCompleteId = useMaintenanceStore((state) => state.setCompleteId);

    const startMutation = useStartMaintnenanceMutation();
    const closeMutation = useClosedMaintenanceMutation();

    const {  search, status, priority } = useMaintenanceSearch();
    const { data: maintenance, isLoading } = useGetMaintenancesQuery({ search, status, priority });

    

    if(isLoading) return null;

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
                    {maintenance?.map((ticket: any) => {
                        
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
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuGroup>
                                                <Link to={`/admin/maintenance/${ticket.id}/edit`}>
                                                    <DropdownMenuItem>
                                                        <Edit className="w-4 h-4 text-primary" />
                                                        Edit Details
                                                    </DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => setViewId(ticket.id)}>
                                                View Details
                                            </DropdownMenuItem>

                                            {ticket.status === "Pending" && (
                                                <DropdownMenuItem disabled={startMutation.isPending} onClick={() => startMutation.mutate(ticket.id)}>
                                                    <Play className="w-4 h-4 text-primary" />
                                                    Start Maintenance
                                                </DropdownMenuItem>
                                            )}

                                            {ticket.status === "InProgress" && (
                                                <DropdownMenuItem onClick={() => setCompleteId(ticket.id)}>
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                    Complete
                                                </DropdownMenuItem>
                                            )}

                                            {ticket.status === "Completed" && (
                                                <DropdownMenuItem disabled={closeMutation.isPending} onClick={() => closeMutation.mutate(ticket.id)}>
                                                    <Lock className="w-4 h-4 text-amber-500" />
                                                    Close Ticket
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
        </Card>
    )
}

export default MaintenanceTable