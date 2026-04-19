import { Button } from "@/components/ui/button";
import statusOptions from "@/lib/constant/MY_BOOKING_STATUS.constants";
import type { StateSelectedStatus } from "@/types/booking.types";
import type { Dispatch, SetStateAction } from "react";

type MyBookingStatusFilterProps = {
    selectedStatus: StateSelectedStatus;
    setSelectedStatus: Dispatch<SetStateAction<StateSelectedStatus>>;
}

const MyBookingStatusFilter = ({
    selectedStatus, setSelectedStatus
}: MyBookingStatusFilterProps) => {
    return (
        <div className="flex gap-2 mb-4 overflow-x-auto">
            {statusOptions.map((option) => (
                <Button 
                key={option.label} 
                variant={option.value === selectedStatus ? "default" : "outline"} 
                onClick={() => setSelectedStatus(option.value)}
                >
                    {option.label}
                </Button>
            ))}
        </div>
    )
}

export default MyBookingStatusFilter