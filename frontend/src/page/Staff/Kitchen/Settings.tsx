import StaffSettings from "@/components/pageComponents/Staff/StaffSettings";
import { staffRoleLabels } from "@/components/pageComponents/Staff/staffRoleLabels";

const KitchenSettings = () => (
  <StaffSettings roleLabel={staffRoleLabels.kitchen} />
);

export default KitchenSettings;
