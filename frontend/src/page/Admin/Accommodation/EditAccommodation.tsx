import { Button } from "@/components/ui/button";
import AccommodationForm from "@/forms/Admin/Accommodation/AccommodationForm";
import { useGetAccommodationByIdQuery, useUpdateAccommodationMutation } from "@/hooks/admin/accommodation.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const EditAccommodation = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: accommodation, isLoading, error } = useGetAccommodationByIdQuery(id);
    const { mutateAsync: updateAccommodation } = useUpdateAccommodationMutation(id || "");

    if(isLoading) return null;

    if(!accommodation) return null;

    if(error) return null; 

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
                        Edit Accommodation
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Update the details below to modify the accommodation
                    </p>
                </div>
            </div>

            <AccommodationForm 
            isUpdate
            initialData={accommodation}
            onsubmit={updateAccommodation}
            oncancel={() => navigate("/admin/accommodation")}
            />
        </div>
    )
}

export default EditAccommodation