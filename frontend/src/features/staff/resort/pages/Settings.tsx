import StaffSettings from "@/features/staff/layout/components/StaffSettings";
import { staffRoleLabels } from "@/features/staff/layout/components/staffRoleLabels";

const ResortSettings = () => (
  <StaffSettings roleLabel={staffRoleLabels.resort} />
);

export default ResortSettings;
