import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetMaintenancesQuery } from "@/hooks/admin/maintenance.hook";
import { useMaintenanceSearch } from "@/hooks/admin/maintenance.search";
import { format } from "date-fns";
import { Edit, MoreHorizontal } from "lucide-react";
import { Link } from "react-router";

const MaintenanceTable = () => {

    // fetch the data here
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
                            Location
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
                    {maintenance?.map((ticket: any) => (
                        <TableRow key={ticket.id}>
                            <TableCell>
                                {ticket.id}
                            </TableCell>
                            <TableCell>
                                {ticket.title}
                            </TableCell>
                            <TableCell>
                                {ticket.location}
                            </TableCell>
                            <TableCell>
                                {ticket.priority}
                            </TableCell>
                            <TableCell>
                                {ticket.status}
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
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

export default MaintenanceTable