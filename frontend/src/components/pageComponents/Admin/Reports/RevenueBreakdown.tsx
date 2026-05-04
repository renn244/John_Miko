import { useGetPaymentReports } from "@/hooks/admin/payment.hook"
import { Home, Users, UtensilsCrossed } from "lucide-react"

const RevenueBreakdown = () => {
    const { data, isLoading } = useGetPaymentReports();

    if(isLoading) return

    if(!data) return

    const totalRevenue = data.paidOnBooking + data.paidOnCash

    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-5 text-foreground">
                Revenue Breakdown
            </h3>

            <div className="space-y-3">

                <RevenueItem
                label="Accommodation Fee"
                value={data.accommodationFee}
                icon={Home}
                color="text-primary bg-primary/20"
                />

                <RevenueItem
                label="Guests Fee"
                value={data.guestFee}
                icon={Users}
                color="text-emerald-600 bg-emerald-100"
                />

                <RevenueItem
                label="Pre-order"
                value={data.preOrderFee}
                icon={UtensilsCrossed}
                color="text-amber-600 bg-amber-100"
                />

                <div className="grid grid-cols-2 gap-3">
                    <MiniStat
                    label="Paid on Booking"
                    value={data.paidOnBooking}
                    />
                    <MiniStat
                    label="Paid on Cash"
                    value={data.paidOnCash}
                    />
                </div>

                <div className="p-4 rounded-lg bg-emerald-100">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                            Total Revenue
                        </span>
                        <span className="text-xl font-bold text-emerald-600">
                            ₱{totalRevenue.toLocaleString()}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}

type RevenueItemProps = {
    label: string
    value: number
    icon: React.ElementType
    color: string
}

const RevenueItem = ({ label, value, icon: Icon, color }: RevenueItemProps) => {
    const [textColor, bgColor] = color.split(" ")

    return (
        <div className="p-4 rounded-lg border border-border bg-muted/40">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
                        <Icon className={`w-5 h-5 ${textColor}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                        {label}
                    </span>
                </div>

                <span className="font-bold text-foreground">
                    ₱{value.toLocaleString()}
                </span>
            </div>
        </div>
    )
}

const MiniStat = ({ label, value }: { label: string; value: number }) => {
    return (
        <div className="p-3 rounded-lg border border-border">
            <div className="text-xs mb-1 text-muted-foreground">
                {label}
            </div>
            <div className="text-sm font-bold text-foreground">
                ₱{value.toLocaleString()}
            </div>
        </div>
    )
}

export default RevenueBreakdown