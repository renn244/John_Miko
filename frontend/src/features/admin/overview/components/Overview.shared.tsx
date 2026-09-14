import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Link, type To } from "react-router";

export const surfaceClassName =
    "rounded-xl border border-border/70 bg-card shadow-sm";

export type AttentionItem = {
    id: string;
    kind: "payment" | "maintenance" | "report" | "feedback";
    title: string;
    context: string;
    meta: string;
    badgeLabel: string;
    to: To;
};

type SectionHeaderProps = {
    title: string;
    linkTo?: To;
    linkLabel?: string;
};

export const SectionHeader = ({
    title,
    linkTo,
    linkLabel,
}: SectionHeaderProps) => (
    <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {linkTo && linkLabel ? (
            <Button asChild variant="link" size="sm" className="-mr-2 shrink-0 px-2 text-xs">
                <Link to={linkTo}>{linkLabel}</Link>
            </Button>
        ) : null}
    </div>
);

export const EmptyState = ({ message }: { message: string }) => (
    <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
        {message}
    </div>
);

const statusToneClassName: Record<string, string> = {
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Confirmed: "border-blue-200 bg-blue-50 text-blue-700",
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Rejected: "border-rose-200 bg-rose-50 text-rose-700",
    Cancelled: "border-rose-200 bg-rose-50 text-rose-700",
    InProgress: "border-blue-200 bg-blue-50 text-blue-700",
    Closed: "border-slate-200 bg-slate-50 text-slate-700",
    High: "border-rose-200 bg-rose-50 text-rose-700",
    Medium: "border-amber-200 bg-amber-50 text-amber-700",
    Low: "border-slate-200 bg-slate-50 text-slate-700",
};

export const formatBadgeLabel = (value?: string | null) =>
    value ? value.replace(/([a-z])([A-Z])/g, "$1 $2") : "Unknown";

export const StatusBadge = ({ value }: { value?: string | null }) => (
    <Badge
        variant="outline"
        className={cn(
            value
                ? statusToneClassName[value] ?? "border-border text-muted-foreground"
                : "border-border text-muted-foreground",
        )}
    >
        {formatBadgeLabel(value)}
    </Badge>
);

export const formatDate = (value: string) =>
    format(new Date(value), "MMM dd, yyyy");

export const getOverviewFeedbackTone = (rating: number) => {
    switch (true) {
        case rating >= 5:
            return {
                accentClassName: "bg-emerald-500",
                containerClassName: "border-border/70 bg-background hover:bg-muted/30",
                ratingClassName: "text-emerald-700",
                commentClassName: "text-foreground/85",
            };
        case rating >= 4:
            return {
                accentClassName: "bg-lime-500",
                containerClassName: "border-border/70 bg-background hover:bg-muted/30",
                ratingClassName: "text-lime-700",
                commentClassName: "text-foreground/85",
            };
        case rating >= 3:
            return {
                accentClassName: "bg-amber-500",
                containerClassName: "border-border/70 bg-background hover:bg-muted/30",
                ratingClassName: "text-amber-700",
                commentClassName: "text-foreground/85",
            };
        default:
            return {
                accentClassName: "bg-rose-500",
                containerClassName: "border-border/70 bg-background hover:bg-muted/30",
                ratingClassName: "text-rose-700",
                commentClassName: "text-foreground/85",
            };
    }
};

export const attentionToneClassName: Record<
    AttentionItem["kind"],
    {
        accent: string;
        badge: string;
    }
> = {
    payment: {
        accent: "bg-amber-500",
        badge: "border-amber-200 bg-amber-50 text-amber-700",
    },
    maintenance: {
        accent: "bg-rose-500",
        badge: "border-rose-200 bg-rose-50 text-rose-700",
    },
    report: {
        accent: "bg-blue-500",
        badge: "border-blue-200 bg-blue-50 text-blue-700",
    },
    feedback: {
        accent: "bg-orange-500",
        badge: "border-orange-200 bg-orange-50 text-orange-700",
    },
};
