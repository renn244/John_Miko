import { Button } from "@/components/ui/button";
import { formatFeedbackRelativeTime } from "@/lib/date.util";
import { cn } from "@/lib/utils";
import type { FeedbackWithUser } from "@/types/feedback.types";
import { format } from "date-fns";
import { Calendar, Star } from "lucide-react";

type FeedbackCardProps = {
    feedback: FeedbackWithUser;
    onView: () => void;
}

const FeedbackCard = ({ feedback, onView }: FeedbackCardProps) => {
    const tone = getFeedbackTone(feedback.rating);

    return (
        <article className={cn(
            "overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
            tone.accentClass,
        )}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full border bg-primary/10 text-sm font-semibold text-primary">
                            {feedback.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-base font-semibold text-foreground">
                                {feedback.user.name}
                            </h3>
                            <p className="truncate text-xs text-muted-foreground">
                                {feedback.user.email}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="shrink-0 text-xs text-muted-foreground">
                    {formatFeedbackRelativeTime(feedback.createdAt)}
                </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                        <Star
                        key={`${feedback.id}-star-${index}`}
                        className={cn(
                            "size-4",
                            index < feedback.rating ? "text-amber-500" : "text-muted-foreground/30",
                        )}
                        fill={index < feedback.rating ? "currentColor" : "none"}
                        />
                    ))}
                </div>

                <span className={cn("text-sm font-medium", tone.textClass)}>
                    {tone.label}
                </span>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/85 min-h-0 md:min-h-18">
                {feedback.comment || "No written comment provided."}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3">
                <div className="min-w-0 space-y-1 text-xs text-muted-foreground">
                    <p className="truncate">
                        {feedback.booking?.referenceCode || feedback.id}
                    </p>
                    <div className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        <span>{format(new Date(feedback.createdAt), "MMM d, yyyy")}</span>
                    </div>
                </div>

                <Button
                variant="ghost"
                className="h-auto px-0 text-sm text-primary hover:bg-transparent hover:text-primary/80"
                onClick={onView}
                >
                    View
                </Button>
            </div>
        </article>
    )
}

const getFeedbackTone = (rating: number) => {
    switch (true) {
        case rating >= 5:
            return {
                label: "Excellent",
                accentClass: "border-t-2 border-t-emerald-500",
                textClass: "text-emerald-600",
            };
        case rating >= 4:
            return {
                label: "Great",
                accentClass: "border-t-2 border-t-lime-500",
                textClass: "text-lime-600",
            };
        case rating >= 3:
            return {
                label: "Okay",
                accentClass: "border-t-2 border-t-amber-500",
                textClass: "text-amber-600",
            };
        default:
            return {
                label: "Needs Attention",
                accentClass: "border-t-2 border-t-rose-500",
                textClass: "text-rose-600",
            };
    }
}

export default FeedbackCard
