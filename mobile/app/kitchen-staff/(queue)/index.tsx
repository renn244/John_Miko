import KitchenPreOrdersScreen from "@/components/pageComponents/Kitchen Staff/PreOrderList/KitchenPreOrdersScreen";
import { useRoleTourAutoStart } from "@/hooks/roleTours/useRoleTourAutoStart";

export default function KitchenStaffPreOrdersScreen() {
  useRoleTourAutoStart("KITCHEN_STAFF");
  return <KitchenPreOrdersScreen scope="active" />;
}
