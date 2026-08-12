import StaffSettings from "@/components/pageComponents/Staff/StaffSettings";
import { staffRoleLabels } from "@/components/pageComponents/Staff/staffRoleLabels";

const ResortSettings = () => (
  <StaffSettings roleLabel={staffRoleLabels.resort} />
);

export default ResortSettings;
