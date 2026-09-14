import { type StaffNavigationItem } from "@/features/staff/layout/components/StaffDesktopSidebar";
import StaffWorkspaceLayout from "@/features/staff/layout/components/StaffWorkspaceLayout";
import { staffRoleLabels } from "@/features/staff/layout/components/staffRoleLabels";
import { CookingPot, Settings2 } from "lucide-react";

const kitchenNavigationItems: readonly StaffNavigationItem[] = [
  { label: "Order queue", path: "/staff/kitchen/dashboard", icon: CookingPot },
  { label: "Settings", path: "/staff/kitchen/settings", icon: Settings2 },
] as const;

const KitchenLayout = () => (
  <StaffWorkspaceLayout
    roleLabel={staffRoleLabels.kitchen}
    navigationItems={kitchenNavigationItems}
  />
);

export default KitchenLayout;
