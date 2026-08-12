import type { KitchenOrder } from "@/types/staff/kitchen-order.type";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { getOrderItemPreview, kitchenStatusClassName } from "./kitchenDisplay";
import { KitchenOrderMeta } from "./KitchenOrderMeta";

const KitchenOrderCard = ({
  order,
  variant = "list",
}: {
  order: KitchenOrder;
  variant?: "list" | "board";
}) => {
  const completed = order.kitchenStatus === "Completed";
  const preview = getOrderItemPreview(order);
  return (
    <Link
      to={`/staff/kitchen/order/${order.bookingId}`}
      className="group relative block overflow-hidden rounded-xl border bg-card shadow-sm transition-colors hover:bg-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          completed ? "bg-emerald-500" : "bg-amber-400",
        )}
      />
      <div
        className={cn(
          "space-y-3 p-4 pl-5",
          variant === "board" && "lg:min-h-[180px]",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-foreground">
              {order.guestName}
            </h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              Booking reference: {order.referenceCode}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${kitchenStatusClassName[order.kitchenStatus]}`}
            >
              {order.kitchenStatus}
            </span>
            <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
        <KitchenOrderMeta order={order} />
        {preview ? (
          <p className="rounded-md bg-muted/60 px-3 py-2 text-sm leading-5 text-foreground">
            {preview}
          </p>
        ) : null}
      </div>
    </Link>
  );
};

export default KitchenOrderCard;
