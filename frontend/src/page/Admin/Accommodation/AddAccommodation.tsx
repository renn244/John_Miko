import { Button } from "@/components/ui/button";
import AccommodationForm from "@/forms/Admin/Accommodation/AccommodationForm";
import { useCreateAccommodationMutation } from "@/hooks/admin/accommodation.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

const AddAccommodation = () => {
    const navigate = useNavigate();
    const { mutateAsync: createAccommodation } = useCreateAccommodationMutation();

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            <div className="flex items-center gap-4">
                <Link to="/admin/accommodation">
                    <Button size="icon" variant="outline">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Add New Accommodation
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Fill in the details below to create a new accommodation
                    </p>
                </div>
            </div>
    
            <AccommodationForm 
            onsubmit={createAccommodation}
            oncancel={() => navigate("/admin/accommodation")}
            />
        </div>
    )
}

export default AddAccommodation