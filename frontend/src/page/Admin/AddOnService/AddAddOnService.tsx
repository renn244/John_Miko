import { Button } from "@/components/ui/button";
import AddOnServiceForm from "@/forms/Admin/AddOnService/AddOnServiceForm";
import { useCreateAddOnServiceMutation } from "@/hooks/admin/add-on-service.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

const AddAddOnService = () => {
    const navigate = useNavigate();
    const { mutateAsync: createService } = useCreateAddOnServiceMutation();

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline" aria-label="Back to add-on services">
                    <Link to="/admin/add-on-service">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Add New Service
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Fill in the details below to create a new add-on service
                    </p>
                </div>
            </div>

            <AddOnServiceForm 
            onsubmit={createService} 
            oncancel={() => navigate("/admin/add-on-service")} 
            />
        </div>
    );
};

export default AddAddOnService;
