import type { KitchenOrder } from "@/features/staff/kitchen/types/staffKitchen.type";
import { CalendarDays, Clock3, ShoppingBag } from "lucide-react";
import { formatKitchenDate } from "./kitchenDisplay";

export const KitchenOrderMeta = ({ order }: { order: KitchenOrder }) => {
  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <CalendarDays className="size-4" />
        {formatKitchenDate(order.bookingDate)}
      </span>
      {order.timeSlot ? (
        <span className="flex items-center gap-1.5">
          <Clock3 className="size-4" />
          {order.timeSlot}
        </span>
      ) : null}
      <span className="flex items-center gap-1.5">
        <ShoppingBag className="size-4" />
        {totalItems} item{totalItems === 1 ? "" : "s"}
      </span>
    </div>
  );
};
