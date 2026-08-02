import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type DecisionTone = "success" | "warning" | "destructive";

type AdminDecisionNoticeProps = {
    tone: DecisionTone;
    icon: LucideIcon;
    title: string;
    description: string;
};

const toneClassName: Record<
    DecisionTone,
    { container: string; icon: string; title: string; description: string }
> = {
    success: {
        container: "border-emerald-200 bg-emerald-50",
        icon: "text-emerald-600",
        title: "text-emerald-800",
        description: "text-emerald-900",
    },
    warning: {
        container: "border-amber-200 bg-amber-50",
        icon: "text-amber-600",
        title: "text-amber-800",
        description: "text-amber-900",
    },
    destructive: {
        container: "border-destructive/50 bg-destructive/10",
        icon: "text-destructive",
        title: "text-destructive",
        description: "text-destructive",
    },
};

const AdminDecisionNotice = ({
    tone,
    icon: Icon,
    title,
    description,
}: AdminDecisionNoticeProps) => {
    const styles = toneClassName[tone];

    return (
        <div className={cn("flex items-start gap-4 rounded-lg border-2 p-4", styles.container)}>
            <Icon className={cn("mt-0.5 size-6 shrink-0", styles.icon)} aria-hidden />
            <div>
                <h3 className={cn("mb-1 text-sm font-bold", styles.title)}>{title}</h3>
                <p className={cn("text-sm", styles.description)}>{description}</p>
            </div>
        </div>
    );
};

export default AdminDecisionNotice;
