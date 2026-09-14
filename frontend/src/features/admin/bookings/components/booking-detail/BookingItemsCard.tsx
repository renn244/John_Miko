import { Card } from "@/components/ui/card";
import { formatPeso } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type BookingLineItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};
type BookingItemsCardProps = {
    title: string;
    emptyMessage: string;
    subtotalLabel: string;
    subtotal: number;
    icon: LucideIcon;
    items: BookingLineItem[];
};

const BookingItemsCard = ({
    title,
    emptyMessage,
    subtotalLabel,
    subtotal,
    icon: Icon,
    items,
}: BookingItemsCardProps) => (
    <Card className="h-full gap-0 rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground md:text-lg">
                {title}
            </h2>
        </div>
        <div className="flex flex-1 flex-col">
            {items.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
                    {emptyMessage}
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {item.name}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatPeso(item.price)} x{" "}
                                        {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <span className="shrink-0 text-sm font-semibold text-foreground">
                                {formatPeso(item.price * item.quantity)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-auto flex items-center justify-between border-t pt-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {subtotalLabel}
                </span>
                <span className="text-sm font-semibold text-foreground">
                    {formatPeso(subtotal)}
                </span>
            </div>
        </div>
    </Card>
);

export default BookingItemsCard;
