import DataPagination from "@/components/common/DataPagination";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAddOnServicesQuery } from "@/hooks/admin/add-on-service.hook";
import { useAddOnServiceSearch } from "@/hooks/admin/add-on-service.search";
import { cn } from "@/lib/utils";
import { useAddOnServiceAdminStore } from "@/store/admin/addOnServiceAdmin.store";
import { Edit, Layers, MoreVertical, Package, Power, RotateCcw } from "lucide-react";
import { Link } from "react-router";

const AddOnServiceList = () => {
    const setDeleteId = useAddOnServiceAdminStore((state) => state.setDeleteId);

    const { search, page, limit, updatePage } = useAddOnServiceSearch();
    const { data, isLoading } = useGetAddOnServicesQuery({ search, page, limit });

    if (isLoading) return null;

    const services = data?.data;
    const meta = data?.meta;

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services?.map((service) => (
                    <div
                        key={service.id}
                        className="group overflow-hidden rounded-xl border-2 bg-white transition-all hover:shadow-lg"
                    >
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                            <img
                                src={service.imageUrl}
                                alt={service.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute left-2 top-2">
                                <span
                                    className={cn(
                                        "rounded-full px-2.5 py-1 text-xs font-bold shadow-sm",
                                        service.isActive
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-muted text-muted-foreground",
                                    )}
                                >
                                    {service.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <div className="absolute right-2 top-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <Link to={`/admin/add-on-service/${service.id}/edit`}>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 text-primary" />
                                                    Edit Details
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem onClick={() => setDeleteId(service.id)}>
                                                {service.isActive ? (
                                                    <>
                                                        <Power className="h-4 w-4 text-amber-700" />
                                                        <span className="text-amber-700">Deactivate</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <RotateCcw className="h-4 w-4 text-emerald-700" />
                                                        <span className="text-emerald-700">Reactivate</span>
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <h3 className="flex-1 text-base font-bold leading-tight">{service.name}</h3>
                                <span className="whitespace-nowrap text-lg font-bold text-primary">
                                    PHP {service.price.toLocaleString()}
                                </span>
                            </div>

                            {service.description && (
                                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                    {service.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                                    <Layers className="h-4 w-4" />
                                    {service.quantity} units
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {!isLoading && services?.length === 0 && (
                    <div className="col-span-1 rounded-xl p-12 text-center sm:col-span-2 md:col-span-3 xl:col-span-4">
                        <Package className="mx-auto mb-4 h-16 w-16 text-muted" />
                        <h3 className="mb-2 text-xl font-bold">No Services Found</h3>
                        <p className="mb-6 text-sm text-muted-foreground">Try adjusting your search.</p>
                    </div>
                )}
            </div>

            {meta && <DataPagination meta={meta} page={page} onPageChange={updatePage} />}
        </div>
    );
};

export default AddOnServiceList;
