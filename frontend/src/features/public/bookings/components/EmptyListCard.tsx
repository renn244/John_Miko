import type { StateSelectedStatus } from "@/features/shared/bookings/types/booking.type";
import type { LucideIcon } from "lucide-react";

type EmptyListCardProps = {
    icon: LucideIcon;
    status: StateSelectedStatus;
    message: string;
}

const EmptyListCard = ({ status, message, icon: Icon }: EmptyListCardProps) => (
    <div className="rounded-xl border bg-card px-4 py-14 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-7" />
        </div>
        <h3 className="mb-2 text-xl font-bold">
            No <span className="capitalize">{status}</span> Bookings
        </h3>
        <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
            {message}
        </p>
    </div>
)

export default EmptyListCard
