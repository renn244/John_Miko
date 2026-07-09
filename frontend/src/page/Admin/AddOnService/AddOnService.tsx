import AddOnServiceFilter from "@/components/pageComponents/Admin/AddOnService/AddOnServiceFilter";
import AddOnServiceList from "@/components/pageComponents/Admin/AddOnService/AddOnServiceList";
import AddOnServiceStatistics from "@/components/pageComponents/Admin/AddOnService/AddOnServiceStatistics";
import DeleteAddOnServiceDialog from "@/components/pageComponents/Admin/AddOnService/DeleteAddOnServiceDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const AddOnService = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Add-on Services</h1>
                    <p className="text-sm mt-1 text-muted-foreground">Manage optional guest services, pricing, and availability.</p>
                </div>

                <Link to="/admin/add-on-service/add">
                    <Button>
                        Add Service
                        <Plus className="w-5 h-5 text-white" />
                    </Button>
                </Link>
            </div>

            <AddOnServiceStatistics />

            <AddOnServiceFilter />

            <AddOnServiceList />

            <DeleteAddOnServiceDialog />
        </div>
    );
};

export default AddOnService;
