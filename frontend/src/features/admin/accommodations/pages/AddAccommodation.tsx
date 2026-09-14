import { Button } from "@/components/ui/button";
import AccommodationForm from "@/features/admin/accommodations/forms/AccommodationForm";
import { prepareAccommodationCreatePayload } from "@/features/admin/accommodations/forms/accommodationStayOptionForm.util";
import { useCreateAccommodationMutation } from "@/features/admin/accommodations/hooks/useAccommodationAdmin";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

const AddAccommodation = () => {
    const navigate = useNavigate();
    const { mutateAsync: createAccommodation } = useCreateAccommodationMutation();

    return (
        <div className="mx-auto max-w-7xl space-y-6">

            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline" aria-label="Back to accommodations">
                    <Link to="/admin/accommodation">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </Button>
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
            onsubmit={(data) => createAccommodation(prepareAccommodationCreatePayload(data))}
            oncancel={() => navigate("/admin/accommodation")}
            />
        </div>
    )
}

export default AddAccommodation
