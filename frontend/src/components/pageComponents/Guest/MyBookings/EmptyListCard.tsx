import type { StateSelectedStatus } from "@/types/booking.types";
import type { LucideIcon } from "lucide-react";

type EmptyListCardProps = {
    icon: LucideIcon;
    status: StateSelectedStatus;
    message: string;
}

const EmptyListCard = ({ status, message, icon: Icon }: EmptyListCardProps) => (
    <div className="text-center py-16 bg-white rounded-xl border-2">
        <Icon className="w-16 h-16 mx-auto mb-4 text-muted" />
        <h3 className="text-xl font-bold mb-2">
            No <span className="capitalize">{status}</span> Bookings
        </h3>
        <p className="text-muted-foreground">
            {message}
        </p>
    </div>
)

export default EmptyListCard