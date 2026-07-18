import type { StaffRole } from "@/types/auth.type";

export const roleRoutes: Record<StaffRole, "/resort-staff" | "/kitchen-staff" | "/maintenance-staff"> = {
  RESORT_STAFF: "/resort-staff",
  KITCHEN_STAFF: "/kitchen-staff",
  MAINTENANCE_STAFF: "/maintenance-staff",
};

export const getRoleRoute = (role: StaffRole) => roleRoutes[role];
