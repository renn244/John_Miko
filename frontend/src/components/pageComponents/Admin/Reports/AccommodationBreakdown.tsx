import { useGetAccommodationReportQuery } from "@/hooks/admin/accommodation.hook";

const AccommodationBreakdown = () => {
    const { data, isLoading } = useGetAccommodationReportQuery();
    
    if(isLoading) return

    if(!data) return
    
    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-5 text-foreground">
                Accommodation Breakdown
            </h3>

            <div className="space-y-3">

                <AccommodationItem
                label="Rooms"
                data={data.room}
                color="bg-primary"
                />

                <AccommodationItem
                label="Cottages"
                data={data.cottages}
                color="bg-green-500"
                />

                <AccommodationItem
                label="Event Halls"
                data={data.eventHalls}
                color="bg-red-500"
                />

                <div className="grid grid-cols-2 gap-3">
                    <MiniStat
                    label="Occupancy Rate"
                    value={`${data.occupancyRate}%`}
                    valueColor="text-green-600"
                    />
                    <MiniStat
                    label="Total Capacity"
                    value={`${data.totalCapacity} units`}
                    />
                </div>

                <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-muted-foreground">
                            Total remaining free
                        </span>
                        <span className="text-sm font-bold text-foreground">
                            {data.totalFree} remaining
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}

type AccommodationItemProps = {
    label: string
    data: {
        occupied: number
        free: number
        total: number
    }
    color: string
}

const AccommodationItem = ({ label, data, color }: AccommodationItemProps) => {
    return (
        <div className="p-4 rounded-lg border border-border bg-muted/40">
            <div className="flex items-center justify-between mb-2">
                
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm font-medium text-foreground">
                        {label}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground">
                        {data.occupied} occupied
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {data.free} free
                    </span>
                </div>
            </div>

            <div className="text-xs text-muted-foreground">
                Total capacity: {data.total} units
            </div>
        </div>
    )
}

type MiniStatProps = {
    label: string
    value: string
    valueColor?: string
}

const MiniStat = ({ label, value, valueColor }: MiniStatProps) => {
    return (
        <div className="p-3 rounded-lg border border-border">
            <div className="text-xs mb-1 text-muted-foreground">
                {label}
            </div>
            <div className={`text-sm font-bold ${valueColor || "text-foreground"}`}>
                {value}
            </div>
        </div>
    )
}

export default AccommodationBreakdown