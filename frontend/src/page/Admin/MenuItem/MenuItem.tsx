import AvailabilityConfirmationDialog from "@/components/pageComponents/Admin/MenuItem/AvailabilityConfirmationDialog";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import DeleteMenuItemDialog from "@/components/pageComponents/Admin/MenuItem/DeleteMenuItemDialog";
import MenuItemFilter from "@/components/pageComponents/Admin/MenuItem/MenuItemFilter";
import MenuItemList from "@/components/pageComponents/Admin/MenuItem/MenuItemList";
import MenuItemStatistics from "@/components/pageComponents/Admin/MenuItem/MenuItemStatistics";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const MenuItem = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Menu Items"
        description="Manage restaurant menu items, pricing, and availability."
        actions={
          <Button asChild>
            <Link to="/admin/menu-item/add">
              Add Menu Item
              <Plus className="size-4" />
            </Link>
          </Button>
        }
      />

      <MenuItemStatistics />

      <MenuItemFilter />

      <MenuItemList />

      <DeleteMenuItemDialog />

      <AvailabilityConfirmationDialog />
    </div>
  );
};

export default MenuItem;
