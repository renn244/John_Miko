import StaffSettings from "@/features/staff/layout/components/StaffSettings";
import { staffRoleLabels } from "@/features/staff/layout/components/staffRoleLabels";

const KitchenSettings = () => (
  <StaffSettings roleLabel={staffRoleLabels.kitchen} />
);

export default KitchenSettings;
