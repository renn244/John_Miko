import AvailabilityConfirmationDialog from "@/components/pageComponents/Admin/MenuItem/AvailabilityConfirmationDialog"
import DeleteMenuItemDialog from "@/components/pageComponents/Admin/MenuItem/DeleteMenuItemDialog"
import MenuItemFilter from "@/components/pageComponents/Admin/MenuItem/MenuItemFilter"
import MenuItemList from "@/components/pageComponents/Admin/MenuItem/MenuItemList"
import MenuItemStatistics from "@/components/pageComponents/Admin/MenuItem/MenuItemStatistics"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router"

const MenuItem = () => {
    return (
        <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Menu Items
                    </h1>
                    <p className="text-sm mt-1 text-muted-foreground">
                        Manage restaurant menu items, pricing, and availability.
                    </p>
                </div>
                <Link to='/admin/menu-item/add'>
                    <Button>
                        Add Menu Item
                        <Plus className="w-5 h-5 text-white" />
                    </Button>
                </Link>
            </div>

            <MenuItemStatistics />

            <MenuItemFilter />

            <MenuItemList />

            <DeleteMenuItemDialog />

            <AvailabilityConfirmationDialog />
        </div>
    )
}

export default MenuItem
