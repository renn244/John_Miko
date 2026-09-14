import { type StaffNavigationItem } from "@/features/staff/layout/components/StaffDesktopSidebar";
import StaffWorkspaceLayout from "@/features/staff/layout/components/StaffWorkspaceLayout";
import { staffRoleLabels } from "@/features/staff/layout/components/staffRoleLabels";
import { ClipboardCheck, History, Settings2 } from "lucide-react";

const maintenanceNavigationItems: readonly StaffNavigationItem[] = [
  {
    label: "Assigned",
    path: "/staff/maintenance/assigned",
    icon: ClipboardCheck,
  },
  { label: "History", path: "/staff/maintenance/history", icon: History },
  { label: "Settings", path: "/staff/maintenance/settings", icon: Settings2 },
] as const;

const StaffLayout = () => (
  <StaffWorkspaceLayout
    roleLabel={staffRoleLabels.maintenance}
    navigationItems={maintenanceNavigationItems}
  />
);

export default StaffLayout;
