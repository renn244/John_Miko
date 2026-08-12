import StaffSettings from "@/components/pageComponents/Staff/StaffSettings";
import { staffRoleLabels } from "@/components/pageComponents/Staff/staffRoleLabels";

const MaintenanceSettings = () => (
  <StaffSettings roleLabel={staffRoleLabels.maintenance} />
);

export default MaintenanceSettings;
