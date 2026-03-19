
type StatisticCardsProps = {
    title: string;
    stat: number;
    Icon: React.ReactNode;
}

const StatisticCards = ({ title, stat, Icon }: StatisticCardsProps) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {title}
                </span>
                {Icon}
            </div>
            <p className="text-3xl font-bold">
                {stat}
            </p>
        </div>
    )
}

export default StatisticCards