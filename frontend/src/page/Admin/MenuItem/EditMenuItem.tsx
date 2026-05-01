import { Button } from "@/components/ui/button"
import MenuItemForm from "@/forms/Admin/MenuItem/MenuItemForm"
import { useGetMenuItemById, useUpdateMenuItemMutation } from "@/hooks/admin/menu-item.hook"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router"

const EditMenuItem = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: menuItem, isLoading, error } = useGetMenuItemById(id);
    const { mutateAsync: updateMenuItem } = useUpdateMenuItemMutation(id || "");

    if(isLoading) return null;

    if(!menuItem) return null;

    if(error) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/menu-item">
                    <Button size="icon" variant="outline">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Edit Menu Item
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Update the details below to modify the menu item
                    </p>
                </div>
            </div>

            <MenuItemForm 
            isUpdate
            initialData={menuItem}
            onsubmit={updateMenuItem}
            oncancel={() => navigate('/admin/menu-item')}
            />
        </div>
    )
}

export default EditMenuItem