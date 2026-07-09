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
import { cn, formatPeso } from "@/lib/utils";
import { useAddOnServiceAdminStore } from "@/store/admin/addOnServiceAdmin.store";
import { Edit, Layers, MoreVertical, Package, Power, RotateCcw } from "lucide-react";
import { Link } from "react-router";

const AddOnServiceList = () => {
    const setDeleteId = useAddOnServiceAdminStore((state) => state.setDeleteId);

    const { search, page, limit, updatePage } = useAddOnServiceSearch();
    const { data, isLoading } = useGetAddOnServicesQuery({ search, page, limit });
    const services = data?.data ?? [];
    const meta = data?.meta;
    const emptyMessage = search
        ? "No add-on services found for the current search."
        : "No add-on services yet.";

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {!isLoading && services.map((service) => (
                    <div
                        key={service.id}
                        className="group overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="relative h-44 overflow-hidden bg-muted/50">
                            <img
                                src={service.imageUrl}
                                alt={service.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute right-3 top-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-white "
                                        >
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
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

                        <div className="space-y-4 p-4">
                            <div className="space-y-1.5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground">
                                            {service.name}
                                        </h3>
                                    </div>

                                    <span className="whitespace-nowrap text-base font-semibold text-primary">
                                        {formatPeso(service.price)}
                                    </span>
                                </div>

                                <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                                    {service.description || "Optional guest service available during booking."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Layers className="h-4 w-4 text-muted-foreground" />
                                    {service.quantity} {service.quantity === 1 ? "unit" : "units"} available
                                </span>

                                <span
                                className={cn(
                                    "inline-flex rounded-md px-2 py-1 text-xs font-medium",
                                    service.isActive
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-600",
                                )}
                                >
                                    {service.isActive ? "Available" : "Unavailable"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {!isLoading && services.length === 0 && (
                    <div className="col-span-1 rounded-xl border border-dashed border-border bg-white/70 p-10 text-center md:col-span-2 xl:col-span-3">
                        <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <h3 className="text-base font-semibold text-foreground">{emptyMessage}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {search ? "Try a different service name." : "Create your first add-on service to get started."}
                        </p>
                    </div>
                )}
            </div>

            {meta && <DataPagination meta={meta} page={page} onPageChange={updatePage} />}
        </div>
    );
};

export default AddOnServiceList;
