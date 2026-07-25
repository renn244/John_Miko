import { Button } from "@/components/ui/button";
import AdminEditPageLoading from "@/components/common/AdminEditPageLoading";
import AccommodationForm from "@/forms/Admin/Accommodation/AccommodationForm";
import { prepareAccommodationUpdatePayload } from "@/forms/Admin/Accommodation/accommodationStayOptionForm.util";
import { useGetAccommodationByIdQuery, useUpdateAccommodationMutation } from "@/hooks/admin/accommodation.hook";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const EditAccommodation = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: accommodation, isLoading, error } = useGetAccommodationByIdQuery(id);
    const { mutateAsync: updateAccommodation } = useUpdateAccommodationMutation(id || "");

    if (isLoading) return <AdminEditPageLoading />;

    if(!accommodation) return null;

    if(error) return null; 

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            
            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline">
                    <Link to="/admin/accommodation">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </Button>
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
            onsubmit={(data) => updateAccommodation(prepareAccommodationUpdatePayload(data))}
            oncancel={() => navigate("/admin/accommodation")}
            />
        </div>
    )
}

export default EditAccommodation
