import type { VirtualTourSceneStatus } from "@/types/admin/virtual-tour.type";

export const virtualTourSceneStatusStyles: Record<
  VirtualTourSceneStatus,
  string
> = {
  DRAFT: "bg-amber-100 text-amber-800",
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  HIDDEN: "bg-slate-100 text-slate-700",
};
