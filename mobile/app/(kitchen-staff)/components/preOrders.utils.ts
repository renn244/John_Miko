import type { KitchenOrder } from "@/types/kitchenOrder.type";
import { format, parseISO } from "date-fns";

export const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const formatBookingDate = (raw: string) => {
  const date = parseISO(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return format(date, "MMM dd, yyyy");
};

export const toDateOnly = (raw: string) => {
  const date = parseISO(raw);
  if (Number.isNaN(date.getTime())) return null;
  return format(date, "yyyy-MM-dd");
};

export const getTotalItems = (order: KitchenOrder) =>
  (order.items ?? []).reduce((total, item) => total + (item.quantity || 0), 0);
