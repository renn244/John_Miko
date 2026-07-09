import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetFeedbackOverviewQuery } from "@/hooks/admin/feedback.hook";
import { formatToSmartDate } from "@/lib/date.util";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Link } from "react-router";
import {
    EmptyState,
    SectionHeader,
    getOverviewFeedbackTone,
    surfaceClassName,
} from "./Overview.shared";

const OverviewFeedbackRow = ({
    item,
}: {
    item: NonNullable<
        ReturnType<typeof useGetFeedbackOverviewQuery>["data"]
    >["recentFeedback"][number];
}) => {
    const tone = getOverviewFeedbackTone(item.rating);

    return (
        <Link
            to="/admin/feedback"
            className={cn(
                "relative block overflow-hidden rounded-lg border px-3 py-3 pl-4 transition-colors hover:shadow-sm",
                tone.containerClassName,
            )}
        >
            <span
                className={cn(
                    "absolute inset-y-0 left-0 w-1 rounded-l-lg",
                    tone.accentClassName,
                )}
            />
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-primary text-sm font-semibold text-white">
                        {item.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {item.user.name}
                        </p>
                        <p
                            className={cn(
                                "mt-1 line-clamp-2 text-xs leading-5",
                                tone.commentClassName,
                            )}
                        >
                            {item.comment || "No comment provided."}
                        </p>
                    </div>
                </div>
                <div className="flex h-full shrink-0 flex-col items-end justify-between self-stretch text-right">
                    <div
                        className={cn(
                            "flex items-center justify-end gap-1.5 text-xs font-semibold",
                            tone.ratingClassName,
                        )}
                    >
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, index) => (
                                <Star
                                    key={`${item.id}-overview-star-${index}`}
                                    className={cn(
                                        "size-3 fill-current",
                                        index < item.rating
                                            ? tone.ratingClassName
                                            : "text-muted-foreground/20",
                                    )}
                                />
                            ))}
                        </div>
                        {item.rating}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatToSmartDate(item.createdAt)}
                    </p>
                </div>
            </div>
        </Link>
    );
};

const OverviewRecentFeedbackCard = ({
    selectedDate,
}: {
    selectedDate: string;
}) => {
    const feedbackOverview = useGetFeedbackOverviewQuery(selectedDate);
    const feedback = feedbackOverview.data?.recentFeedback ?? [];
    const averageRating = feedbackOverview.data?.averageRating ?? 0;

    return (
        <div className={`${surfaceClassName} p-4`}>
            <SectionHeader
                title="Recent Feedback"
                linkTo="/admin/feedback"
                linkLabel="View all"
            />
            <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-amber-600">
                <Star className="size-4 fill-current" />
                {averageRating.toFixed(1)} average
            </div>
            <div className="mt-4">
                {feedbackOverview.isLoading ? (
                    <LoadingSpinner
                        className="size-5"
                        containerClassName="justify-start"
                    />
                ) : feedback.length ? (
                    <div className="space-y-2">
                        {feedback.map((item) => (
                            <OverviewFeedbackRow key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <EmptyState message="No recent feedback available." />
                )}
            </div>
        </div>
    );
};

export default OverviewRecentFeedbackCard;
