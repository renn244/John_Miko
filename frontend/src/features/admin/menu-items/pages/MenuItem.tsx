import AvailabilityConfirmationDialog from "@/features/admin/menu-items/components/AvailabilityConfirmationDialog";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import DeleteMenuItemDialog from "@/features/admin/menu-items/components/DeleteMenuItemDialog";
import MenuItemFilter from "@/features/admin/menu-items/components/MenuItemFilter";
import MenuItemList from "@/features/admin/menu-items/components/MenuItemList";
import MenuItemStatistics from "@/features/admin/menu-items/components/MenuItemStatistics";
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
