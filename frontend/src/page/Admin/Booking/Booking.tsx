import BookingFilter from "@/components/pageComponents/Admin/Booking/BookingFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetBookingsAdminQuery } from "@/hooks/admin/booking.hook";
import { useBookingSearch } from "@/hooks/admin/booking.search";
import { format } from "date-fns";
import { CalendarSync, CircleCheck, CircleX, Eye, MoreHorizontal, Plus } from "lucide-react";
import { Link } from "react-router";

const Booking = () => {
    const { search, status, paymentType, accommodationId, bookingDate } = useBookingSearch();

    const { data: bookings } = useGetBookingsAdminQuery({ search, status, paymentType, accommodationId, bookingDate });
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return { bg: '#DBEAFE', text: '#1E73BE', border: '#1E73BE' };
            case 'Completed':
                return { bg: '#D1FAE5', text: '#059669', border: '#059669' };
            case 'Cancelled':
                return { bg: '#FEE2E2', text: '#DC2626', border: '#DC2626' };
            default:
                return { bg: '#F3F4F6', text: '#6B7280', border: '#6B7280' };
        }
    };

    const getPaymentTypeColor = (paymentType: string) => {
        switch (paymentType) {
            case 'Full':
                return { bg: '#D1FAE5', text: '#059669'};
            case 'Partial':
                return { bg: '#FEF3C7', text: '#D97706' };
        }
    }

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
                    <Link to="/admin/booking/add">
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
                                <TableHead>Time Slot</TableHead>
                                <TableHead>Guest</TableHead>
                                <TableHead>Payment Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings?.map((booking) => (
                                <TableRow>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell>Name Placeholder</TableCell>
                                    <TableCell>{booking.accommodation.name}</TableCell>
                                    <TableCell>{format(new Date(booking.bookingDate), "MMM dd, yyyy")}</TableCell>
                                    <TableCell>{booking.timeSlot}</TableCell>
                                    <TableCell>pax placeholder</TableCell>
                                    <TableCell>
                                        <Badge style={{
                                            backgroundColor: getPaymentTypeColor(booking.paymentType)?.bg,
                                            color: getPaymentTypeColor(booking.paymentType)?.text,
                                        }}>
                                            {booking.paymentType}                                                
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge style={{
                                            backgroundColor: getStatusColor(booking.status).bg,
                                            color: getStatusColor(booking.status).text,
                                            borderColor: getStatusColor(booking.status).border,
                                            borderWidth: '1px',
                                        }}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
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