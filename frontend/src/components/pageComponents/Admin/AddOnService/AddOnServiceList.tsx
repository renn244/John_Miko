import DataPagination from "@/components/common/DataPagination";
import { Button } from "@/components/ui/button";
import { useGetAddOnServicesQuery } from "@/hooks/admin/add-on-service.hook";
import { useAddOnServiceSearch } from "@/hooks/admin/add-on-service.search";
import { useAddOnServiceAdminStore } from "@/store/admin/addOnServiceAdmin.store";
import { Edit, Layers, Package, Trash2 } from "lucide-react";
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {services?.map((service) => (
                    <div
                    key={service.id}
                    className="bg-white rounded-xl border-2 hover:shadow-lg transition-all overflow-hidden group"
                    >
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                            <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <div className="p-4">
                            <div className="mb-2">
                                <h3 className="font-bold text-base leading-tight">{service.name}</h3>
                            </div>

                            {service.description && (
                                <p className="text-xs leading-relaxed mb-3 line-clamp-2 text-muted-foreground">
                                    {service.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between gap-2">
                                <span className="text-lg font-bold whitespace-nowrap text-primary">
                                    ₱{service.price.toLocaleString()}
                                </span>

                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                                    <Layers className="w-4 h-4" />
                                    {service.quantity} units
                                </span>
                            </div>
                        </div>

                        <div className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-3">
                                <Link to={`/admin/add-on-service/${service.id}/edit`}>
                                    <Button className="w-full" variant="outline">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => setDeleteId(service.id)}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                    <span className="text-destructive">Delete</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {!isLoading && services?.length === 0 && (
                    <div className="rounded-xl p-12 text-center col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4">
                        <Package className="w-16 h-16 mx-auto mb-4 text-muted" />
                        <h3 className="text-xl font-bold mb-2">No Services Found</h3>
                        <p className="text-sm mb-6 text-muted-foreground">
                            Try adjusting your search.
                        </p>
                    </div>
                )}
            </div>

            {meta && <DataPagination meta={meta} page={page} onPageChange={updatePage} />}
        </div>
    );
};

export default AddOnServiceList;
