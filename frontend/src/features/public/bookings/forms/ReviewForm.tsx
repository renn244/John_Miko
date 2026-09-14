import { GuestCard, GuestDivider } from "@/features/public/layout/components/guest";
import { Button } from "@/components/ui/button";
import { useGetMenuItemsBulkQuery } from "@/features/shared/menu-items/hooks/useMenuItemQueries";
import { formatPeso } from "@/lib/utils";
import type { Accommodation } from "@/features/shared/accommodations/types/accommodation.type";
import type { MenuItem } from "@/features/shared/menu-items/types/menu-item.type";
import { ArrowRight } from "lucide-react";
import { useMemo, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type ReviewFormProps = {
    accommodation: Accommodation;
    setBookingStep: Dispatch<SetStateAction<"form" | "add-on" | "review" | "pre-order" | "payment">>;
    stayType: string;
    checkIn: Date;
    checkOut: Date;
    accommodationSubtotal: number;
    addOnSubTotal: number;
    preOrderSubTotal: number;
    guestFeeSubTotal: number;
    total: number;
};

type ReviewSectionProps = {
    title: string;
    action?: ReactNode;
    children: ReactNode;
    stretch?: boolean;
};

const formatDateTime = (date: Date) =>
    date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

const getAccommodationTypeLabel = (type: Accommodation["type"]) =>
    type === "EventHall" ? "Event Hall" : type;

const ReviewSection = ({ title, action, children, stretch = false }: ReviewSectionProps) => (
    <GuestCard className={stretch ? "flex h-full flex-col p-4 md:p-5" : "p-4 md:p-5"}>
        <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-bold tracking-normal">{title}</h3>
            {action}
        </div>
        {stretch ? <div className="flex flex-1 flex-col">{children}</div> : children}
    </GuestCard>
);

const SummaryLine = ({
    label,
    value,
    emphasize = false,
}: {
    label: string;
    value: string;
    emphasize?: boolean;
}) => (
    <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={emphasize ? "font-bold text-primary" : "font-semibold"}>
            {value}
        </span>
    </div>
);

const ReviewForm = ({
    accommodation,
    stayType,
    checkIn,
    checkOut,
    accommodationSubtotal,
    addOnSubTotal,
    guestFeeSubTotal,
    preOrderSubTotal,
    total,
    setBookingStep,
}: ReviewFormProps) => {
    const { watch } = useFormContext<multiStepBookingFormSchema>();

    const preOrderItems = watch("preOrderItems") || [];
    const addOnServices = watch("addOnServices") || [];
    const adultGuests = watch("adultGuests") || 0;
    const seniorGuests = watch("seniorGuests") || 0;
    const kidGuests = watch("kidGuests") || 0;
    const totalGuests = watch("numberOfGuests");
    const specialRequest = watch("specialRequest");
    const { data: menuItems } = useGetMenuItemsBulkQuery(preOrderItems.map((item) => item.menuItemId));

    const preOrders = useMemo(() => {
        if (!menuItems) return [];

        const preOrderData: (MenuItem & { quantity: number })[] = [];

        preOrderItems.forEach((item) => {
            const menuItem = menuItems.find((menu) => menu.id === item.menuItemId);
            if (!menuItem) return;

            preOrderData.push({
                ...menuItem,
                quantity: item.quantity,
            });
        });

        return preOrderData;
    }, [preOrderItems, menuItems]);

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
                <ReviewSection
                    title="Accommodation"
                    action={
                        <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={() => setBookingStep("form")}
                        >
                            Edit
                        </Button>
                    }
                >
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <img
                            src={accommodation.imageUrl}
                            alt={accommodation.name}
                            className="h-32 w-full rounded-lg object-cover sm:h-32 sm:w-44"
                        />
                        <div className="min-w-0 flex-1 self-center">
                            <h4 className="text-xl font-bold tracking-normal">
                                {accommodation.name}
                            </h4>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {getAccommodationTypeLabel(accommodation.type)} | {stayType} | Up to {accommodation.capacity} guests
                            </p>
                            <div className="mt-5 grid gap-4 border-t pt-4 text-sm sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Check-in
                                    </p>
                                    <p className="mt-1 font-semibold">{formatDateTime(checkIn)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Check-out
                                    </p>
                                    <p className="mt-1 font-semibold">{formatDateTime(checkOut)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ReviewSection>

                <ReviewSection
                    title="Guest Details"
                    action={
                        <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={() => setBookingStep("form")}
                        >
                            Edit
                        </Button>
                    }
                >
                    <div className="grid gap-5 text-sm md:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Primary guest
                            </p>
                            <p className="mt-1 font-semibold">
                                {watch("firstName")} {watch("lastName")}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Contact email
                            </p>
                            <p className="mt-1 break-words font-semibold">{watch("email")}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Phone number
                            </p>
                            <p className="mt-1 font-semibold">{watch("contactNo")}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Guest breakdown
                            </p>
                            <p className="mt-1 font-semibold">
                                {adultGuests} adults, {seniorGuests} seniors, {kidGuests} children
                            </p>
                        </div>
                    </div>
                    {specialRequest ? (
                        <>
                            <GuestDivider className="my-4" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Special request
                                </p>
                                <p className="mt-2 rounded-lg bg-muted/50 p-3 text-sm leading-6">
                                    {specialRequest}
                                </p>
                            </div>
                        </>
                    ) : null}
                </ReviewSection>

                <div className="grid gap-4 xl:grid-cols-2">
                    <ReviewSection
                        title="Add-on Services"
                        stretch
                        action={
                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-xs"
                                onClick={() => setBookingStep("add-on")}
                            >
                                Edit
                            </Button>
                        }
                    >
                        {addOnServices.length > 0 ? (
                            <div className="flex flex-1 flex-col">
                                <div className="space-y-2">
                                    {addOnServices.map((item) => {
                                        const price = item.price || 0;
                                        const lineTotal = price * item.quantity;

                                        return (
                                            <div
                                                key={item.addOnServiceId}
                                                className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 p-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">
                                                        {item.name || "Add-on service"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {formatPeso(price)} x {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="shrink-0 text-sm font-bold text-primary">
                                                    {formatPeso(lineTotal)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <GuestDivider className="mb-3 mt-auto pt-4" />
                                <SummaryLine label="Add-on subtotal" value={formatPeso(addOnSubTotal)} />
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col">
                                <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
                                    No add-ons selected.
                                </div>
                                <GuestDivider className="mb-3 mt-auto pt-4" />
                                <SummaryLine label="Add-on subtotal" value={formatPeso(addOnSubTotal)} />
                            </div>
                        )}
                    </ReviewSection>

                    <ReviewSection
                        title="Pre-orders"
                        stretch
                        action={
                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-xs"
                                onClick={() => setBookingStep("pre-order")}
                            >
                                Edit
                            </Button>
                        }
                    >
                        {preOrderItems.length > 0 && !menuItems ? (
                            <div className="flex flex-1 flex-col">
                                <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
                                    Loading pre-ordered items...
                                </div>
                                <GuestDivider className="mb-3 mt-auto pt-4" />
                                <SummaryLine label="Pre-order subtotal" value={formatPeso(preOrderSubTotal)} />
                            </div>
                        ) : preOrders.length > 0 ? (
                            <div className="flex flex-1 flex-col">
                                <div className="space-y-2">
                                    {preOrders.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 p-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold">{item.name}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {formatPeso(item.price)} x {item.quantity}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-sm font-bold text-primary">
                                                {formatPeso(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <GuestDivider className="mb-3 mt-auto pt-4" />
                                <SummaryLine label="Pre-order subtotal" value={formatPeso(preOrderSubTotal)} />
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col">
                                <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
                                    No pre-orders selected.
                                </div>
                                <GuestDivider className="mb-3 mt-auto pt-4" />
                                <SummaryLine label="Pre-order subtotal" value={formatPeso(preOrderSubTotal)} />
                            </div>
                        )}
                    </ReviewSection>
                </div>

                <ReviewSection title="Price Breakdown">
                    <div className="space-y-3">
                        <SummaryLine label="Accommodation" value={formatPeso(accommodationSubtotal)} />
                        <SummaryLine
                            label={accommodation.isGuestFeeWaived ? "Guest fees included" : "Guest fees"}
                            value={formatPeso(guestFeeSubTotal)}
                        />
                        <SummaryLine label="Add-ons" value={formatPeso(addOnSubTotal)} />
                        <SummaryLine label="Pre-orders" value={formatPeso(preOrderSubTotal)} />
                        <GuestDivider className="my-3" />
                        <SummaryLine label="Total" value={formatPeso(total)} emphasize />
                    </div>
                </ReviewSection>
            </div>

            <aside className="lg:sticky lg:top-4 lg:self-start">
                <GuestCard accent className="p-4 md:p-5">
                    <h3 className="text-lg font-bold tracking-normal">Final Summary</h3>
                    <GuestDivider className="my-4" />
                    <div className="space-y-3">
                        <SummaryLine label="Stay" value={stayType} />
                        <SummaryLine
                            label="Guests"
                            value={`${totalGuests} ${totalGuests === 1 ? "guest" : "guests"}`}
                        />
                        <SummaryLine label="Add-ons" value={formatPeso(addOnSubTotal)} />
                        <SummaryLine label="Pre-orders" value={formatPeso(preOrderSubTotal)} />
                    </div>
                    <GuestDivider className="my-4" />
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Total due</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Payment method and proof are next.
                            </p>
                        </div>
                        <p className="text-2xl font-extrabold text-primary">
                            {formatPeso(total)}
                        </p>
                    </div>
                    <div className="mt-5 space-y-2">
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => setBookingStep("payment")}
                        >
                            Proceed to Payment
                            <ArrowRight className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setBookingStep("pre-order")}
                        >
                            Back to Pre-order
                        </Button>
                    </div>
                </GuestCard>
            </aside>
        </div>
    );
};

export default ReviewForm;
