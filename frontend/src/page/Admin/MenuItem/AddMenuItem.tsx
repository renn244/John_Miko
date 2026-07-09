import { Button } from "@/components/ui/button"
import MenuItemForm from "@/forms/Admin/MenuItem/MenuItemForm"
import { useCreateMenuItemMutation } from "@/hooks/admin/menu-item.hook"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router"

const AddMenuItem = () => {
    const navigate = useNavigate();
    const { mutateAsync: createMenuItem } = useCreateMenuItemMutation();

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/menu-item">
                    <Button size="icon" variant="outline">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Add New Menu Item
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Fill in the details below to create a new menu item
                    </p>
                </div>
            </div>

            <MenuItemForm 
            onsubmit={createMenuItem}
            oncancel={() => navigate('/admin/menu-item')}
            />
        </div>
    )
}

export default AddMenuItem
