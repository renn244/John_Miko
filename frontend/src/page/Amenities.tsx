import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import {
    GuestCard,
    GuestContainer,
    GuestInfoChip,
    GuestPageShell,
} from "@/components/guest";
import {
    Car,
    CheckCircle2,
    ConciergeBell,
    ShieldCheck,
    Utensils,
    Waves,
} from "lucide-react";

const heroHighlights = [
    {
        icon: Waves,
        title: "Pool Access",
        description: "Crystal clear pools for all guests.",
    },
    {
        icon: Utensils,
        title: "Food Pre-orders",
        description: "Delicious meals ready on arrival.",
    },
    {
        icon: Car,
        title: "Parking",
        description: "Secure on-site slots for guests.",
    },
    {
        icon: ConciergeBell,
        title: "Family Friendly",
        description: "Perfect for groups and reunions.",
    },
];

const amenityTiles = [
    {
        title: "Swimming Pool",
        description: "Clean, refreshing pool access for day tours and overnight guests.",
        image: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1200&q=80",
        className: "md:col-span-2 md:row-span-2",
    },
    {
        title: "Food Options",
        description: "Pre-order meals during booking or bring food with corkage.",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80",
    },
    {
        title: "Accommodations",
        description: "Rooms, cottages, and event spaces for different group sizes.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    },
    {
        title: "Parking",
        description: "On-site parking subject to available space.",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    },
    {
        title: "Events & Gatherings",
        description: "Great for birthdays, reunions, and small celebrations.",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    },
];

const safetyRules = [
    "Children must be supervised at all times.",
    "Follow staff instructions and signage.",
    "No glassware near the pool area.",
    "Adhere to maximum capacity limits.",
];

const arrivalTips = [
    "Bring swimwear, towels, and extra clothes for pool use.",
    "Prepare a valid ID for check-in and booking confirmation.",
    "Book early for weekends, holidays, and larger groups.",
    "Review corkage, capacity, and pool rules before arrival.",
];

const Amenities = () => {
    return (
        <GuestPageShell className="bg-background">
            <NavBar />

            <section className="relative border-b bg-background pt-4">
                <GuestContainer>
                    <div className="relative min-h-[320px] overflow-hidden rounded-xl border bg-muted md:min-h-[380px]">
                        <img
                            src="https://images.unsplash.com/photo-1729707691048-722c1acf5c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzcyMDk4MDA5fDA&ixlib=rb-4.1.0&q=80&w=1600"
                            alt="Resort amenities at John Miko's Place"
                            className="absolute inset-0 size-full object-cover"
                            loading="eager"
                            fetchPriority="high"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/15" />
                        <div className="relative z-10 flex min-h-[320px] max-w-2xl flex-col justify-end p-5 text-white md:min-h-[380px] md:p-8">
                            <div className="mb-4 flex flex-wrap gap-2">
                                <GuestInfoChip className="border-white/25 bg-white/15 text-white backdrop-blur">
                                    Pool access
                                </GuestInfoChip>
                                <GuestInfoChip className="border-white/25 bg-white/15 text-white backdrop-blur">
                                    Food pre-orders
                                </GuestInfoChip>
                            </div>
                            <h1 className="text-4xl font-bold tracking-normal md:text-5xl">
                                Amenities
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/90 md:text-base">
                                Everything you need for a relaxing day tour, overnight stay, or small celebration.
                            </p>
                        </div>
                    </div>
                </GuestContainer>

                <GuestContainer className="-mt-10 pb-4">
                    <div className="relative z-10 mx-2 grid gap-3 md:mx-4 md:grid-cols-4">
                        {heroHighlights.map(({ icon: Icon, title, description }) => (
                            <GuestCard key={title} className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <Icon className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-semibold">{title}</h2>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            </GuestCard>
                        ))}
                    </div>
                </GuestContainer>
            </section>

            <GuestContainer className="py-9 md:py-12">
                <div className="space-y-12 md:space-y-14">
                    <section>
                        <div className="mb-5">
                            <h2 className="text-3xl font-bold tracking-normal">What You Can Enjoy</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Curated facilities designed for your comfort and enjoyment.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4 md:auto-rows-[170px]">
                            {amenityTiles.map(({ title, description, image, className }) => (
                                <article
                                    key={title}
                                    className={`group relative min-h-[190px] overflow-hidden rounded-lg border bg-muted ${className ?? ""}`}
                                >
                                    <img
                                        src={image}
                                        alt={title}
                                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/5" />
                                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                                        <h3 className="text-base font-bold">{title}</h3>
                                        <p className="mt-1 max-w-md text-xs leading-5 text-white/90">
                                            {description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-5 lg:grid-cols-[1fr_430px] lg:items-center">
                        <div>
                            <h2 className="text-2xl font-bold tracking-normal">Dining at John Miko&apos;s Place</h2>
                            <div className="mt-3 max-w-2xl space-y-3 text-sm leading-6 text-muted-foreground">
                                <p>
                                    We want your meals to be as delightful as your stay. You can pre-order Filipino
                                    dishes during booking so they are ready when you arrive.
                                </p>
                                <p>
                                    Outside food and drinks are allowed, with corkage fees applied to help maintain
                                    resort cleanliness and service quality.
                                </p>
                            </div>
                        </div>

                        <GuestCard className="p-5">
                            <h3 className="text-base font-bold text-primary">Corkage Fees</h3>
                            <div className="mt-4 space-y-3 text-sm">
                                <div className="flex items-center justify-between gap-4 border-b pb-3">
                                    <span className="text-muted-foreground">Outside food</span>
                                    <span className="font-bold">P200<span className="text-xs font-normal text-muted-foreground"> /dish</span></span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">Outside drinks</span>
                                    <span className="font-bold">P150<span className="text-xs font-normal text-muted-foreground"> /bottle</span></span>
                                </div>
                            </div>
                        </GuestCard>
                    </section>

                    <GuestCard accent className="p-5">
                        <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="size-6 text-primary" />
                                <h2 className="text-lg font-bold tracking-normal">
                                    Pool & Safety Guidelines
                                </h2>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    To ensure everyone has a safe and enjoyable time, please observe the following:
                                </p>
                                <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                                    {safetyRules.map((rule) => (
                                        <div key={rule} className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                            <span>{rule}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </GuestCard>

                    <section>
                        <div className="mb-5">
                            <h2 className="text-2xl font-bold tracking-normal">Before You Arrive</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                A few quick reminders to help your visit feel smooth from the start.
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                            {arrivalTips.map((tip) => (
                                <GuestCard key={tip} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {tip}
                                        </p>
                                    </div>
                                </GuestCard>
                            ))}
                        </div>
                    </section>
                </div>
            </GuestContainer>

            <Footer />
        </GuestPageShell>
    );
};

export default Amenities;
