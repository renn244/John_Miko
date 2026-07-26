import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AdminAvailabilityBadgeProps = {
    active: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
    className?: string;
};

const AdminAvailabilityBadge = ({
    active,
    activeLabel = "Active",
    inactiveLabel = "Inactive",
    className,
}: AdminAvailabilityBadgeProps) => (
    <Badge
        variant="outline"
        className={cn(
            "shadow-none",
            active
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-700",
            className,
        )}
    >
        {active ? activeLabel : inactiveLabel}
    </Badge>
);

export default AdminAvailabilityBadge;
