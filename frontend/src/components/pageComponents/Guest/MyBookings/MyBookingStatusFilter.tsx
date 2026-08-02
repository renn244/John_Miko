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
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {statusOptions.map((option) => (
                <Button
                key={option.label}
                type="button"
                size="sm"
                variant={option.value === selectedStatus ? "default" : "outline"}
                onClick={() => setSelectedStatus(option.value)}
                className="shrink-0"
                >
                    {option.label}
                </Button>
            ))}
        </div>
    )
}

export default MyBookingStatusFilter
