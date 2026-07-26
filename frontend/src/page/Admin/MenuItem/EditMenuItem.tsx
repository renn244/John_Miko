import { Button } from "@/components/ui/button"
import AdminEditPageState from "@/components/common/AdminEditPageState"
import AdminEditPageLoading from "@/components/common/AdminEditPageLoading"
import ErrorDialog from "@/components/common/dialog/ErrorDialog"
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog"
import MenuItemForm from "@/forms/Admin/MenuItem/MenuItemForm"
import { useGetMenuItemById, useUpdateMenuItemMutation } from "@/hooks/admin/menu-item.hook"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router"

const EditMenuItem = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: menuItem, isLoading, error, refetch, isRefetching } = useGetMenuItemById(id);
    const { mutateAsync: updateMenuItem } = useUpdateMenuItemMutation(id || "");

    if (isLoading) return <AdminEditPageLoading />;

    if (error) {
        return <AdminEditPageState><ErrorDialog onBack={() => navigate("/admin/menu-item")} onRetry={refetch} retryLoading={isRefetching} /></AdminEditPageState>;
    }

    if (!menuItem) {
        return <AdminEditPageState><NotFoundDialog title="Menu Item Not Found" onBack={() => navigate("/admin/menu-item")} onRetry={refetch} retryLoading={isRefetching} /></AdminEditPageState>;
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline" aria-label="Back to menu items">
                    <Link to="/admin/menu-item">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </Button>
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
