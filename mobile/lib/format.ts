import { KitchenOrder } from "../types/kitchenOrder.type";

export const formatStayLabel = (timeSlot?: KitchenOrder["timeSlot"]) => {
  if (!timeSlot) return undefined;

  return timeSlot.replace(/([a-z])([A-Z])/g, "$1 $2");
};