import NavBar from "@/components/common/NavBar"
import AccommodationCardView from "@/components/pageComponents/Accommodation/AccommodationCardView"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetAccommodationsQuery } from "@/hooks/admin/accommodation.hook"
import type { Accommodation } from "@/types/admin/accommodation.type"
import { AlertTriangle, BedDouble, Loader2, RefreshCcw } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

const AccommodationList = () => {
    const [selectedType, setSelectedType] = useState<Accommodation['type'] | "All">("All")

    const navigate = useNavigate()

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetAccommodationsQuery({
        type: selectedType === "All" ? undefined : selectedType,
        availability: "Available",
        page: 1, limit: 100
    })

    const accommodations = data?.data ?? []

    const typeOptions: Array<{ value: Accommodation['type'] | "All"; label: string }> = [
        { value: "All", label: "All" },
        { value: "Room", label: "Room" },
        { value: "Cottage", label: "Cottage" },
        { value: "EventHall", label: "Event Hall" },
    ]

    const resultsLabel = `${accommodations.length} ${accommodations.length === 1 ? "result" : "results"}`

    return (
        <div className="min-h-screen bg-muted/30">
            <NavBar />

            <main className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6">
                <header className="space-y-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                        Our Accommodations
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl font-medium text-muted-foreground">
                        Discover your perfect home away from home at John Miko's Place Resort
                    </p>
                </header>

                <Tabs
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as Accommodation['type'] | "All")}
                className="w-full sm:w-auto"
                >
                    <TabsList className="w-full sm:w-auto h-auto flex-wrap justify-start">
                        {typeOptions.map((t) => (
                            <TabsTrigger key={t.value} value={t.value} className="px-3">
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {isError ? (
                    <div className="rounded-xl border bg-background p-6">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <AlertTriangle className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>Something went wrong</EmptyTitle>
                                <EmptyDescription>
                                    {(error as Error)?.message || "We couldn’t load accommodations right now."}
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button onClick={() => refetch()}>
                                    <RefreshCcw className="h-4 w-4" />
                                    Retry
                                </Button>
                            </EmptyContent>
                        </Empty>
                    </div>
                ) : isLoading && !data ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm animate-pulse"
                            >
                                <div className="aspect-16/10 bg-muted" />
                                <div className="p-6 space-y-3">
                                    <div className="h-5 w-2/3 rounded bg-muted" />
                                    <div className="h-4 w-full rounded bg-muted" />
                                    <div className="h-4 w-5/6 rounded bg-muted" />
                                    <div className="h-9 w-full rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : accommodations.length === 0 ? (
                    <div className="rounded-xl border bg-background p-6">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <BedDouble className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>No accommodations found</EmptyTitle>
                                <EmptyDescription>
                                    Try selecting a different type.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {accommodations.map((accommodation) => (
                            <AccommodationCardView
                            key={accommodation.id}
                            name={accommodation.name}
                            imageUrl={accommodation.imageUrl}
                            type={accommodation.type}
                            price={accommodation.price}
                            description={accommodation.description}
                            capacity={accommodation.capacity}
                            viewDetailsClick={() => navigate(`/accommodation/${accommodation.id}`)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default AccommodationList