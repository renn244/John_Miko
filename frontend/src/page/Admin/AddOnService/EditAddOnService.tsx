import { Button } from "@/components/ui/button";
import AddOnServiceForm from "@/forms/Admin/AddOnService/AddOnServiceForm";
import { useGetAddOnServiceById, useUpdateAddOnServiceMutation } from "@/hooks/admin/add-on-service.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const EditAddOnService = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: service, isLoading, error } = useGetAddOnServiceById(id);
    const { mutateAsync: updateService } = useUpdateAddOnServiceMutation(id || "");

    if (isLoading) return null;
    
    if (!service) return null;

    if (error) return null;

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/add-on-service">
                    <Button size="icon" variant="outline">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Edit Service</h1>
                    <p className="text-sm text-muted-foreground mt-1">Update the details below to modify the add-on service</p>
                </div>
            </div>

            <AddOnServiceForm
            isUpdate
            initialData={{
                imageUrl: service.imageUrl,
                name: service.name,
                description: service.description || "",
                price: service.price,
                quantity: service.quantity,
            }}
            onsubmit={updateService}
            oncancel={() => navigate("/admin/add-on-service")}
            />
        </div>
    );
};

export default EditAddOnService;
