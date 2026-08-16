import { type StaffNavigationItem } from "@/components/pageComponents/Staff/StaffDesktopSidebar";
import StaffWorkspaceLayout from "@/components/pageComponents/Staff/StaffWorkspaceLayout";
import { staffRoleLabels } from "@/components/pageComponents/Staff/staffRoleLabels";
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
