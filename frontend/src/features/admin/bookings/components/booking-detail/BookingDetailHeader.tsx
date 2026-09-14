import { Badge } from "@/components/ui/badge";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import type { BookingWithAccommodationAndPreOrderAndPayment } from "@/features/shared/bookings/types/booking.type";

type BookingDetailHeaderProps = {
    booking: BookingWithAccommodationAndPreOrderAndPayment;
};

const getBookingStatusStyle = (
    status: BookingWithAccommodationAndPreOrderAndPayment["status"],
) => {
    switch (status) {
        case "Confirmed":
            return { bg: "#DBEAFE", text: "#1E73BE", border: "#1E73BE" };
        case "Completed":
            return { bg: "#D1FAE5", text: "#059669", border: "#059669" };
        case "Cancelled":
            return { bg: "#FEE2E2", text: "#DC2626", border: "#DC2626" };
        default:
            return { bg: "#FEF3C7", text: "#B45309", border: "#F59E0B" };
    }
};

const getPaymentTypeStyle = (paymentType: "Full" | "Partial") => {
    switch (paymentType) {
        case "Full":
            return { bg: "#D1FAE5", text: "#059669", border: "#A7F3D0" };
        default:
            return { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" };
    }
};

const BookingDetailHeader = ({ booking }: BookingDetailHeaderProps) => {
    const bookingStyle = getBookingStatusStyle(booking.status);
    const paymentStyle = getPaymentTypeStyle(booking.paymentType);

    return (
        <AdminPageHeader
            backTo="/admin/booking"
            backLabel="Back to bookings"
            title="Booking Details"
            description={booking.referenceCode ?? "N/A"}
            actions={
                <div className="flex flex-wrap items-center gap-2">
                    <Badge
                        className="border"
                        style={{
                            backgroundColor: bookingStyle.bg,
                            borderColor: bookingStyle.border,
                            color: bookingStyle.text,
                        }}
                    >
                        {booking.status}
                    </Badge>
                    <Badge variant="secondary">
                        {booking.source ?? "Online"}
                    </Badge>
                    <Badge
                        className="border"
                        style={{
                            backgroundColor: paymentStyle.bg,
                            borderColor: paymentStyle.border,
                            color: paymentStyle.text,
                        }}
                    >
                        {booking.paymentType} Payment
                    </Badge>
                </div>
            }
        />
    );
};

export default BookingDetailHeader;
