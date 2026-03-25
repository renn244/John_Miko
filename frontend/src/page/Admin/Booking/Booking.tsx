import BookingFilter from "@/components/pageComponents/Admin/Booking/BookingFilter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarSync, CircleCheck, CircleX, Eye, MoreHorizontal, Plus } from "lucide-react";
import { Link } from "react-router";

const Booking = () => {

    const bookings = [
        {
            id: "BK-001",
            guestName: "Juan Dela Cruz",
            accommodation: "Deluxe Room 101",
            checkIn: "2026-04-01",
            checkOut: "2026-04-03",
            guests: 2,
            paymentType: "Full Payment",
            status: "Confirmed",
        },
        {
            id: "BK-002",
            guestName: "Maria Santos",
            accommodation: "Beach Cottage A",
            checkIn: "2026-04-05",
            checkOut: "2026-04-06",
            guests: 4,
            paymentType: "50% Downpayment",
            status: "Pending",
        },
        {
            id: "BK-003",
            guestName: "Carlos Reyes",
            accommodation: "Event Hall 1",
            checkIn: "2026-04-10",
            checkOut: "2026-04-10",
            guests: 50,
            paymentType: "Full Payment",
            status: "Confirmed",
        },
        {
            id: "BK-004",
            guestName: "Ana Lopez",
            accommodation: "Standard Room 205",
            checkIn: "2026-04-12",
            checkOut: "2026-04-14",
            guests: 3,
            paymentType: "50% Downpayment",
            status: "Cancelled",
        },
        {
            id: "BK-005",
            guestName: "Mark Villanueva",
            accommodation: "Family Cottage B",
            checkIn: "2026-04-15",
            checkOut: "2026-04-17",
            guests: 6,
            paymentType: "Full Payment",
            status: "Confirmed",
        },
    ];

    return (
        <div className="space-y-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Booking Management
                        </h1>
                        <p className="text-sm mt-1 text-muted-foreground">
                            Manage and monitor all confirmed reservations
                        </p>
                    </div>
                    <Link to="/admin/accommodation/add">
                        <Button>
                            Add Booking
                            <Plus className="w-5 h-5 text-white" />
                        </Button>
                    </Link>
                </div>

                <BookingFilter />

                <Card className="px-4 min-h-147.5">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Booking ID</TableHead>
                                <TableHead>Guest Name</TableHead>
                                <TableHead>Accommodation</TableHead>
                                <TableHead>Check In</TableHead>
                                <TableHead>Check Out</TableHead>
                                <TableHead>Guest</TableHead>
                                <TableHead>Payment Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell>{booking.guestName}</TableCell>
                                    <TableCell>{booking.accommodation}</TableCell>
                                    <TableCell>{booking.checkIn}</TableCell>
                                    <TableCell>{booking.checkOut}</TableCell>
                                    <TableCell>{booking.guests}</TableCell>
                                    <TableCell>{booking.paymentType}</TableCell>
                                    <TableCell>{booking.status}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>
                                                    <Eye />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>Action</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <CircleCheck />
                                                    Mark as Confirmed
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <CalendarSync />
                                                    Reschedule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <CircleX />
                                                    Mark as Cancelled
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
        </div>
    )
}

export default Booking