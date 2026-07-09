const OverviewHeader = ({
    overviewDateLabel,
}: {
    overviewDateLabel: string;
}) => (
    <header className="space-y-1">
        <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Overview
            </h1>
            <p className="text-sm text-muted-foreground">
                Operational snapshot for {overviewDateLabel}.
            </p>
        </div>
    </header>
);

export default OverviewHeader;
