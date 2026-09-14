import { type StaffNavigationItem } from "@/features/staff/layout/components/StaffDesktopSidebar";
import StaffWorkspaceLayout from "@/features/staff/layout/components/StaffWorkspaceLayout";
import { staffRoleLabels } from "@/features/staff/layout/components/staffRoleLabels";
import { ClipboardList, House, Plus, Settings2 } from "lucide-react";

const resortNavigationItems: readonly StaffNavigationItem[] = [
  { label: "Dashboard", path: "/staff/resort/dashboard", icon: House },
  { label: "New Report", path: "/staff/resort/new-report", icon: Plus },
  { label: "My Reports", path: "/staff/resort/reports", icon: ClipboardList },
  { label: "Settings", path: "/staff/resort/settings", icon: Settings2 },
] as const;

const ResortLayout = () => (
  <StaffWorkspaceLayout
    roleLabel={staffRoleLabels.resort}
    navigationItems={resortNavigationItems}
  />
);

export default ResortLayout;
