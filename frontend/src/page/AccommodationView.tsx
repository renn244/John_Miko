import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import {
    GuestCard,
    GuestContainer,
    GuestDivider,
    GuestInfoChip,
    GuestPageShell,
} from "@/components/guest";
import AccommodationSideBooking from "@/components/pageComponents/Accommodation/AccommodationSideBooking";
import Chatbot from "@/components/pageComponents/Chatbot";
import { Button } from "@/components/ui/button";
import { useGetAccommodationByIdQuery } from "@/hooks/admin/accommodation.hook";
import { formatStayOptionRange } from "@/lib/stayOptionTime";
import { formatPeso } from "@/lib/utils";
import { BedDouble, CheckCircle2, Home, ParkingCircle, Utensils, Users, Waves } from "lucide-react";
import { Link, useParams } from "react-router";

const AccommodationView = () => {
    const { id } = useParams<{ id: string }>();
    const { data: accommodation, isLoading, error } = useGetAccommodationByIdQuery(id);

    if (isLoading) {
        return (
            <GuestPageShell className="bg-background">
                <NavBar />
                <GuestContainer className="py-8">
                    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                        <div className="space-y-4">
                            <div className="h-[420px] animate-pulse rounded-lg bg-muted" />
                            <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                            <div className="h-24 animate-pulse rounded bg-muted" />
                        </div>
                        <GuestCard className="h-96 animate-pulse" />
                    </div>
                </GuestContainer>
            </GuestPageShell>
        );
    }

    if (error || !accommodation) {
        return (
            <GuestPageShell className="bg-background">
                <NavBar />
                <GuestContainer className="py-12">
                    <GuestCard className="mx-auto max-w-xl text-center">
                        <BedDouble className="mx-auto size-10 text-muted-foreground" />
                        <h1 className="mt-4 text-2xl font-bold">
                            {error ? "Unable to load accommodation" : "Accommodation not found"}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Please go back to accommodations and choose another stay.
                        </p>
                        <Button asChild className="mt-5">
                            <Link to="/accommodation">Back to Accommodations</Link>
                        </Button>
                    </GuestCard>
                </GuestContainer>
            </GuestPageShell>
        );
    }

    const activeStayOptions = accommodation.stayOptions.filter((stayOption) => stayOption.isActive);

    return (
        <GuestPageShell className="bg-background">
            <NavBar />

            <GuestContainer className="py-5 md:py-6">
                <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-start">
                    <div className="space-y-5">
                        <section className="space-y-2">
                            <div className="relative min-h-[300px] overflow-hidden rounded-lg border bg-muted md:min-h-[420px]">
                                <img
                                    src={accommodation.imageUrl}
                                    alt={accommodation.name}
                                    className="absolute inset-0 size-full object-cover"
                                />
                            </div>
                        </section>

                        <section>
                            <h1 className="text-3xl font-bold tracking-normal">
                                {accommodation.name}
                            </h1>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <GuestInfoChip>
                                    <Home className="size-3.5" />
                                    {accommodation.type === "EventHall" ? "Event Hall" : accommodation.type}
                                </GuestInfoChip>
                                <GuestInfoChip>
                                    <Users className="size-3.5" />
                                    Up to {accommodation.capacity} guests
                                </GuestInfoChip>
                                {activeStayOptions.map((stayOption) => (
                                    <GuestInfoChip key={stayOption.id} active={stayOption.sortOrder === 1}>
                                        {stayOption.label}
                                    </GuestInfoChip>
                                ))}
                            </div>
                        </section>

                        <GuestDivider />

                        <section>
                            <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
                                {accommodation.description}
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h2 className="text-lg font-bold tracking-normal">
                                Amenities
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {accommodation.amenities.map((amenity) => (
                                    <GuestInfoChip key={amenity} className="rounded-md px-4">
                                        <CheckCircle2 className="size-3.5 text-primary" />
                                        {amenity}
                                    </GuestInfoChip>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold tracking-normal">
                                Available Stay Options & Rates
                            </h2>
                            <div className="grid gap-3 md:grid-cols-3">
                                {activeStayOptions.map((stayOption, index) => (
                                    <GuestCard
                                        key={stayOption.id}
                                        className={
                                            index === 0
                                                ? "border-primary bg-primary/10"
                                                : "shadow-none"
                                        }
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="text-lg font-bold">{stayOption.label}</h3>
                                            <CheckCircle2
                                                className={
                                                    index === 0
                                                        ? "size-5 text-primary"
                                                        : "size-5 text-muted-foreground"
                                                }
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {formatStayOptionRange(stayOption)}
                                        </p>
                                        <GuestDivider className="my-4" />
                                        <p className="text-2xl font-extrabold">
                                            {formatPeso(accommodation.price)}
                                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                                                /stay
                                            </span>
                                        </p>
                                    </GuestCard>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold tracking-normal">
                                Resort Facilities
                            </h2>
                            <div className="grid gap-3 md:grid-cols-3">
                                {[
                                    {
                                        label: "Food Pre-orders",
                                        description: "Choose meals during the booking flow.",
                                        icon: Utensils,
                                    },
                                    {
                                        label: "Pool Access",
                                        description: "Enjoy resort pool access during your stay.",
                                        icon: Waves,
                                    },
                                    {
                                        label: "Guest Parking",
                                        description: "Parking is available for resort guests.",
                                        icon: ParkingCircle,
                                    },
                                ].map(({ label, description, icon: Icon }) => (
                                    <GuestCard key={label} accent className="p-4">
                                        <Icon className="mb-3 size-5 text-primary" />
                                        <h3 className="text-sm font-semibold">{label}</h3>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            {description}
                                        </p>
                                    </GuestCard>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-24">
                        <AccommodationSideBooking
                            accommodation={{
                                id: accommodation.id,
                                price: accommodation.price,
                                stayOptions: accommodation.stayOptions,
                            }}
                        />
                    </aside>
                </div>
            </GuestContainer>

            <Footer />
            <Chatbot />
        </GuestPageShell>
    );
};

export default AccommodationView;
