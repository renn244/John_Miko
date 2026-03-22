import LoadingSpinner from "./loadingSpinner";

type StatisticCardsProps = {
    title: string;
    stat: number;
    Icon: React.ReactNode;
    isLoading: boolean;
}

const StatisticCards = ({ title, stat, Icon, isLoading }: StatisticCardsProps) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {title}
                </span>
                {Icon}
            </div>
            {isLoading ? <LoadingSpinner className="w-5 h-5" containerClassName="justify-baseline" /> : <p className="text-3xl font-bold">{stat}</p>}
        </div>
    )
}

export default StatisticCards