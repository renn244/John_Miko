import DataPagination from "@/components/common/DataPagination"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGetMenuItemsQuery } from "@/hooks/admin/menu-item.hook"
import { useMenuItemSearch } from "@/hooks/admin/menu-item.search"
import { cn } from "@/lib/utils"
import { useMenuItemAdminStore } from "@/store/admin/menuItemAdmin.store"
import { CheckCircle, Edit, MoreVertical, Trash2, UtensilsCrossed, XCircle } from "lucide-react"
import { Link } from "react-router"

const MenuItemList = () => {
    const setDeleteId = useMenuItemAdminStore((state) => state.setDeleteId);
    const setAvailabilityConfirmationId = useMenuItemAdminStore((state) => state.setAvailabilityConfirmationId);

    const { search, category, availability, page, limit, updatePage } = useMenuItemSearch();

    const { data, isLoading } = useGetMenuItemsQuery({ search, category, availability, page, limit });

    if(isLoading) return 

    const menuItems = data?.data;
    const meta = data?.meta;

    return (
       <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {menuItems?.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border-2 hover:shadow-lg transition-all overflow-hidden group">
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                            <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            
                            <div className="absolute top-2 left-2">
                                <span
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-bold shadow-sm", 
                                    item.availability === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                )}
                                >
                                    {item.availability}
                                </span>
                            </div>
                            
                            <div className="absolute top-2 right-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">
                                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <Link to={`/admin/menu-item/${item.id}/edit`}>
                                                <DropdownMenuItem>
                                                    <Edit className="w-4 h-4 text-primary" />
                                                    Edit Details
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem onClick={() => setAvailabilityConfirmationId(item.id)}>
                                                {item.availability === 'Available' ? (
                                                    <>
                                                        <XCircle className="w-4 h-4 text-amber-700" />
                                                        <span className="text-amber-700">Mark Unavailable</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 text-emerald-700" />
                                                        <span className="text-emerald-700">Mark Available</span>
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setDeleteId(item.id)} variant="destructive">
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                            Delete Item
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="p-4">

                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-base leading-tight flex-1">
                                    {item.name}
                                </h3>
                                <span className="text-lg font-bold whitespace-nowrap text-primary">
                                    ₱{item.price.toLocaleString()}
                                </span>
                            </div>

                            <p className="text-xs leading-relaxed mb-3 line-clamp-2 text-muted-foreground">
                                {item.description}
                            </p>

                        </div>
                    </div>
                ))}

                {!isLoading && menuItems?.length === 0 && (
                    <div className="rounded-xl p-12 text-center col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4">
                        <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-muted" />
                        <h3 className="text-xl font-bold mb-2">
                            No Menu Items Found
                        </h3>
                        <p className="text-sm mb-6 text-muted-foreground">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
            
            {meta && (
                <DataPagination 
                meta={meta}
                page={page}
                onPageChange={updatePage}
                />
            )}
       </div>
    )
}

export default MenuItemList