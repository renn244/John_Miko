import BookingReportDocumentationsSection from "@/components/common/BookingReportDocumentationsSection";
import { Card } from "@/components/ui/card";
import type { BookingWithAccommodationAndPreOrderAndPayment } from "@/features/shared/bookings/types/booking.type";
import { Pizza, PlusCircle } from "lucide-react";
import BookingDetailHeader from "./BookingDetailHeader";
import BookingInformationCard from "./BookingInformationCard";
import BookingItemsCard from "./BookingItemsCard";
import GuestInformationCard from "./GuestInformationCard";
import PaymentReviewCard from "./PaymentReviewCard";
import PaymentSummaryCard from "./PaymentSummaryCard";
import RejectPaymentDialog from "./RejectPaymentDialog";
import RefundPaymentDialog from "./RefundPaymentDialog";

type BookingDetailContentProps = {
    booking: BookingWithAccommodationAndPreOrderAndPayment;
};

const BookingDetailContent = ({ booking }: BookingDetailContentProps) => {
    const addOns = booking.addOns ?? [];
    const preOrders = booking.preOrders ?? [];
    const addOnSubtotal = addOns.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );
    const preOrderSubtotal = preOrders.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );
    const addOnAmount = booking.payment?.addOnAmount ?? addOnSubtotal;
    const preOrderAmount = booking.payment?.preOrderAmount ?? preOrderSubtotal;

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <BookingDetailHeader booking={booking} />

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-6">
                    <BookingInformationCard booking={booking} />

                    <GuestInformationCard booking={booking} />

                    <div className="grid gap-6 xl:grid-cols-2">
                        <BookingItemsCard
                            title="Add-on Services"
                            emptyMessage="No add-on services selected."
                            subtotalLabel="Add-on subtotal"
                            subtotal={addOnAmount}
                            icon={PlusCircle}
                            items={addOns}
                        />
                        <BookingItemsCard
                            title="Pre-orders"
                            emptyMessage="No pre-order items."
                            subtotalLabel="Pre-order subtotal"
                            subtotal={preOrderAmount}
                            icon={Pizza}
                            items={preOrders}
                        />
                    </div>

                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <BookingReportDocumentationsSection
                            reports={booking.reports}
                            compact
                        />
                    </Card>
                </div>
                <div className="space-y-6 xl:sticky xl:top-6">
                    <PaymentSummaryCard
                        booking={booking}
                        addOnAmount={addOnAmount}
                        preOrderAmount={preOrderAmount}
                    />

                    <PaymentReviewCard booking={booking} />
                </div>
            </div>

            <RejectPaymentDialog />

            <RefundPaymentDialog />
        </div>
    );
};

export default BookingDetailContent;
