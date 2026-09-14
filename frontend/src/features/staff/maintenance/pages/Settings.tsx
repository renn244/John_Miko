import StaffSettings from "@/features/staff/layout/components/StaffSettings";
import { staffRoleLabels } from "@/features/staff/layout/components/staffRoleLabels";

const MaintenanceSettings = () => (
  <StaffSettings roleLabel={staffRoleLabels.maintenance} />
);

export default MaintenanceSettings;
