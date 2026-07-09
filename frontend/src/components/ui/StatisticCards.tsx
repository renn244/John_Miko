import { cn } from "@/lib/utils";
import LoadingSpinner from "./loadingSpinner";

type StatisticCardsProps = {
    title: string;
    stat: number | string;
    format?: (value: number) => string;
    Icon: React.ReactNode;
    isLoading: boolean;
    className?: string;
    accentClassName?: string;
    iconContainerClassName?: string;
};

const StatisticCards = ({
    title,
    stat,
    format,
    Icon,
    isLoading,
    className,
    accentClassName = "border-l-primary",
    iconContainerClassName = "bg-primary",
}: StatisticCardsProps) => {
    const displayValue =
        typeof stat === "number" && format ? format(stat) : String(stat);

    return (
        <div
            className={cn(
                "relative overflow-hidden flex justify-between rounded-xl border border-l-3 bg-white px-3 py-3 shadow-md",
                accentClassName,
                className
            )}
        >
            <div className="flex flex-col items-start justify-between gap-1">
                <span className="min-w-0 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {title}
                </span>
                
                {isLoading ? (
                    <LoadingSpinner
                        className="mt-1.5 size-4.5"
                        containerClassName="justify-start"
                    />
                ) : (
                    <p className="text-[1.35rem] font-semibold tracking-tight text-foreground sm:text-[1.70rem]">
                        {displayValue}
                    </p>
                )}
            </div>
            <div>
                <div
                    className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-sm [&_svg]:size-5 [&_svg]:text-white",
                        iconContainerClassName,
                    )}
                >
                    {Icon}
                </div>
            </div>
        </div>
    );
};

export default StatisticCards;
