import type {
  KitchenOrder,
  KitchenOrderStatus,
} from "@/types/staff/kitchen-order.type";

export const kitchenStatusClassName: Record<KitchenOrderStatus, string> = {
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const formatKitchenDate = (value?: string | null) => {
  if (!value) return "Date not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not set"
    : new Intl.DateTimeFormat("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(date);
};

export const getOrderItemPreview = (order: KitchenOrder) => {
  const preview = order.items
    .slice(0, 2)
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(" \u00B7 ");
  const remaining = order.items.length - 2;
  return remaining > 0 ? `${preview} \u00B7 +${remaining} more` : preview;
};
