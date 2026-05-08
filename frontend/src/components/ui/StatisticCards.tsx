import { cn } from "@/lib/utils";
import LoadingSpinner from "./loadingSpinner";

type StatisticCardsProps = {
    title: string;
    stat: number;
    format?: (value: number) => string;
    Icon: React.ReactNode;
    isLoading: boolean;
    className?: string
}

const StatisticCards = ({ title, stat, format, Icon, isLoading, className }: StatisticCardsProps) => {
    return (
        <div className={cn("bg-white p-4 rounded-xl shadow-sm border-2", className)}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {title}
                </span>
                {Icon}
            </div>
            {isLoading ? (
                <LoadingSpinner className="w-5 h-5" containerClassName="justify-baseline" />
            ) : (
                <p className="text-3xl font-bold">{format ? format(stat) : stat}</p>
            )}
        </div>
    )
}

export default StatisticCards