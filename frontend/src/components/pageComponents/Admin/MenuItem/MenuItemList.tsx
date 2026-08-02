import DataPagination from "@/components/common/DataPagination";
import AdminAvailabilityBadge from "@/components/common/AdminAvailabilityBadge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetMenuItemsQuery } from "@/hooks/admin/menu-item.hook";
import { useMenuItemSearch } from "@/hooks/admin/menu-item.search";
import { formatPeso } from "@/lib/utils";
import { useMenuItemAdminStore } from "@/store/admin/menuItemAdmin.store";
import { CheckCircle, Edit, MoreVertical, Trash2, UtensilsCrossed, XCircle } from "lucide-react";
import { Link } from "react-router";

const MenuItemList = () => {
    const setDeleteId = useMenuItemAdminStore((state) => state.setDeleteId);
    const setAvailabilityConfirmationId = useMenuItemAdminStore((state) => state.setAvailabilityConfirmationId);

    const { search, category, availability, page, limit, updatePage } = useMenuItemSearch();
    const { data, isLoading } = useGetMenuItemsQuery({ search, category, availability, page, limit });

    const menuItems = data?.data ?? [];
    const meta = data?.meta;
    const hasFilters = Boolean(search || category || availability);
    const emptyMessage = hasFilters
        ? "No menu items found for the current filters."
        : "No menu items yet.";

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {!isLoading && menuItems.map((item) => (
                    <div
                        key={item.id}
                        className="group overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="relative h-44 overflow-hidden bg-muted/50">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute left-3 top-3">
                                <AdminAvailabilityBadge
                                    active={item.availability === "Available"}
                                    activeLabel="Available"
                                    inactiveLabel="Unavailable"
                                />
                            </div>

                            <div className="absolute right-3 top-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            className="text-muted-foreground"
                                            aria-label={`Actions for ${item.name}`}
                                        >
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link to={`/admin/menu-item/${item.id}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                    Edit Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setAvailabilityConfirmationId(item.id)}>
                                                {item.availability === "Available" ? (
                                                    <>
                                                        <XCircle className="h-4 w-4" />
                                                        <span>Mark Unavailable</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Mark Available</span>
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setDeleteId(item.id)} variant="destructive">
                                            <Trash2 className="h-4 w-4" />
                                            Delete Item
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <h3 className="flex-1 text-base font-bold leading-tight text-foreground">
                                    {item.name}
                                </h3>

                                <span className="whitespace-nowrap text-lg font-bold text-primary">
                                    {formatPeso(item.price)}
                                </span>
                            </div>

                            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                {item.description || "Guest-facing menu item description."}
                            </p>
                        </div>
                    </div>
                ))}

                {!isLoading && menuItems.length === 0 && (
                    <div className="col-span-1 rounded-xl border border-dashed border-border bg-white/70 p-10 text-center md:col-span-2 xl:col-span-3">
                        <UtensilsCrossed className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <h3 className="text-base font-semibold text-foreground">{emptyMessage}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {hasFilters ? "Try a different search, category, or availability filter." : "Create your first menu item to get started."}
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
    );
};

export default MenuItemList;
