import Footer from "@/features/public/layout/components/Footer";
import NavBar from "@/features/public/layout/components/NavBar";
import {
    GuestCard,
    GuestContainer,
    GuestDivider,
    GuestInfoChip,
    GuestPageShell,
    GuestSection,
} from "@/features/public/layout/components/guest";
import Chatbot from "@/features/public/chatbot/components/Chatbot";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useGetAccommodationsQuery } from "@/features/shared/accommodations/hooks/useAccommodationQueries";
import { RESORT_OPERATIONAL_INFO } from "@/lib/constant/RESORT_OPERATIONAL_INFO.constant";
import { formatPeso } from "@/lib/utils";
import type { Accommodation } from "@/features/shared/accommodations/types/accommodation.type";
import {
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    Clock,
    CreditCard,
    HandPlatter,
    Info,
    ShieldCheck,
    Sparkles,
    Star,
    TicketCheck,
    Users,
    Utensils,
    Waves,
} from "lucide-react";
import { Link } from "react-router";

const heroImage =
    "https://images.unsplash.com/photo-1729707691048-722c1acf5c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzcyMDk4MDA5fDA&ixlib=rb-4.1.0&q=80&w=1600";

const fallbackAccommodations: Pick<
    Accommodation,
    "id" | "name" | "description" | "imageUrl" | "type" | "capacity" | "price" | "amenities" | "stayOptions"
>[] = [
    {
        id: "deluxe-villa",
        name: "Deluxe Villa",
        description:
            "Our premium offering featuring spacious living areas, a private terrace, and modern amenities designed for groups seeking a comfortable, elevated stay.",
        imageUrl:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        type: "Cottage",
        capacity: 8,
        price: 12500,
        amenities: ["Pool Access", "Kitchen", "Aircon"],
        stayOptions: [
            {
                id: "overnight",
                accommodationId: "deluxe-villa",
                code: "OVERNIGHT",
                label: "Overnight",
                sortOrder: 1,
                isActive: true,
                createdAt: "",
                updatedAt: "",
            },
        ],
    },
    {
        id: "poolside-cottage",
        name: "Poolside Cottage",
        description: "Perfect for quick getaways with direct access to the main resort pool area.",
        imageUrl:
            "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1000&q=80",
        type: "Cottage",
        capacity: 4,
        price: 4500,
        amenities: ["Pool Access", "Outdoor Seating"],
        stayOptions: [
            {
                id: "daystay",
                accommodationId: "poolside-cottage",
                code: "DAYSTAY",
                label: "DayStay",
                sortOrder: 1,
                isActive: true,
                createdAt: "",
                updatedAt: "",
            },
        ],
    },
    {
        id: "private-suite",
        name: "Private Suite",
        description: "An intimate, elegantly designed space ideal for couples seeking a quiet retreat.",
        imageUrl:
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80",
        type: "Room",
        capacity: 2,
        price: 6000,
        amenities: ["WiFi", "Aircon", "Private Bath"],
        stayOptions: [
            {
                id: "overnight-suite",
                accommodationId: "private-suite",
                code: "OVERNIGHT",
                label: "Overnight",
                sortOrder: 1,
                isActive: true,
                createdAt: "",
                updatedAt: "",
            },
        ],
    },
];

const foodItems = [
    {
        name: "Sinigang na Baboy",
        description: "Classic tamarind soup.",
        price: 450,
        imageUrl:
            "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=300&q=80",
    },
    {
        name: "Lechon Kawali",
        description: "Crispy pork belly strips.",
        price: 380,
        imageUrl:
            "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=300&q=80",
    },
    {
        name: "Halo-Halo Special",
        description: "Refreshing mixed dessert.",
        price: 180,
        imageUrl:
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80",
    },
];

const whyCards = [
    {
        title: "Easy Online Booking",
        description: "Reserve your preferred date and accommodation in just a few clicks.",
        icon: TicketCheck,
    },
    {
        title: "Clear Pricing & Policies",
        description: "No hidden fees. Upfront payment terms and clear house rules.",
        icon: ShieldCheck,
    },
    {
        title: "Family-Friendly Resort",
        description: "Safe, clean pools and amenities suitable for all age groups.",
        icon: Users,
    },
    {
        title: "Flexible Stay Options",
        description: "DayStay, overnight, 22-hour, and 12-hour options depending on availability.",
        icon: Clock,
    },
];

const bookingSteps = [
    { label: "Guest Information", icon: Users },
    { label: "Add-on Services", icon: Sparkles },
    { label: "Pre-order Items", icon: Utensils },
    { label: "Review Booking", icon: CheckCircle2 },
    { label: "Payment", icon: CreditCard },
];

const policies = [
    {
        title: "Check-in & Check-out",
        description: "DayStay and overnight schedules are shown before booking confirmation.",
        icon: Clock,
    },
    {
        title: "50% Down Payment",
        description: "Required to secure your reservation. Balance is due upon arrival.",
        icon: CreditCard,
    },
    {
        title: "Corkage Policy",
        description: "Outside food is allowed. Standard corkage fees apply for alcoholic beverages.",
        icon: HandPlatter,
    },
    {
        title: "Reservation Policy",
        description: "Weekend and holiday bookings are best reserved ahead of time.",
        icon: CalendarDays,
    },
    {
        title: "Capacity Limits",
        description: "Maximum capacity is enforced per accommodation for guest safety.",
        icon: Users,
    },
    {
        title: "Pool Safety",
        description: "Proper swimwear is required. Children must be supervised at all times.",
        icon: Waves,
    },
];

const faqs = [
    {
        question: "What are the details for overnight stays?",
        answer: "Overnight schedule and available time slots are shown during accommodation selection and booking.",
    },
    {
        question: "How much are the corkage fees?",
        answer: "Outside food is allowed. Standard corkage fees apply for alcoholic beverages brought onto the premises.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "Available payment methods are shown during checkout. A 50% down payment is required to confirm a booking.",
    },
    {
        question: "Can I reserve for the weekend?",
        answer: "Yes. Weekend and holiday bookings are encouraged to be made early because availability can fill quickly.",
    },
    {
        question: "Are there capacity limits per accommodation?",
        answer: "Yes. Each accommodation has its own maximum capacity, and the booking flow follows that limit.",
    },
    {
        question: "What are the pool rules?",
        answer: "Proper swimwear is required, children must be supervised, and posted resort safety rules should be followed.",
    },
];

const getStayLabels = (accommodation: Pick<Accommodation, "stayOptions">) =>
    accommodation.stayOptions?.filter((option) => option.isActive).map((option) => option.label) ?? [];

const Home = () => {
    const [dayUseHours, overnightHours] = RESORT_OPERATIONAL_INFO.operatingHours;
    const { data: accommodationsResponse } = useGetAccommodationsQuery({ page: 1, limit: 3 });
    const accommodations = accommodationsResponse?.data?.length
        ? accommodationsResponse.data.slice(0, 3)
        : fallbackAccommodations;

    const featuredAccommodation = accommodations[0];
    const sideAccommodations = accommodations.slice(1, 3);

    return (
        <GuestPageShell className="bg-background">
            <NavBar />

            <GuestContainer className="py-4 md:py-6">
                <section className="relative min-h-[460px] overflow-hidden rounded-xl border shadow-sm md:min-h-[560px]">
                    <img
                        src={heroImage}
                        alt="John Miko's Place Resort pool and cabanas"
                        className="absolute inset-0 size-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/45 to-black/10" />
                    <div className="relative z-10 flex min-h-[460px] items-end p-5 md:min-h-[560px] md:p-10">
                        <div className="max-w-3xl text-white">
                            <div className="mb-4 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                                    <Clock className="size-3.5" />
                                    DayStay {dayUseHours.checkIn} - {dayUseHours.checkOut}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                                    <CalendarDays className="size-3.5" />
                                    Overnight {overnightHours.checkIn} - {overnightHours.checkOut}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                    <CircleDollarSign className="size-3.5" />
                                    50% Down Payment
                                </span>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-normal md:text-6xl">
                                John Miko&apos;s Place Resort
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
                                Book a DayStay or Overnight getaway in minutes. Experience modern comfort
                                and authentic Filipino hospitality in a tranquil resort setting.
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="w-full sm:w-auto">
                                    <Link to="/accommodation">
                                        Browse Accommodations
                                        <ChevronRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                                    <Link to="/amenities">View Amenities</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </GuestContainer>

            <GuestContainer>
                <GuestSection compact className="grid gap-8 md:grid-cols-[1fr_1.35fr] md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-normal">Why John Miko&apos;s Place Resort?</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Escape the city hustle without the long travel. We provide a seamless booking
                            experience and a pristine, family-friendly environment while keeping the
                            authentic warmth of Filipino hospitality.
                        </p>
                        <Button asChild variant="link" className="mt-3 h-auto px-0">
                            <Link to="/about">
                                Learn More About Us
                                <ChevronRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {whyCards.map(({ title, description, icon: Icon }) => (
                            <GuestCard key={title} className="p-4">
                                <Icon className="mb-3 size-5 text-primary" />
                                <h3 className="text-sm font-semibold">{title}</h3>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                            </GuestCard>
                        ))}
                    </div>
                </GuestSection>

                <GuestSection
                    compact
                    title="Guest Rates & Entrance Fees"
                    description="Standard entrance fees for resort access."
                >
                    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
                        <GuestCard className="bg-primary p-5 text-primary-foreground md:p-6">
                            <GuestInfoChip className="border-white/20 bg-white/15 text-white">
                                Entrance
                            </GuestInfoChip>
                            <div className="mt-6 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold">Adults</h3>
                                    <p className="mt-1 text-sm text-white/80">Standard entrance fee</p>
                                </div>
                                <Users className="size-7 text-white/80" />
                            </div>
                            <p className="mt-6 text-3xl font-extrabold">{formatPeso(150)}</p>
                        </GuestCard>
                        <div className="grid gap-3">
                            <GuestCard className="flex items-center justify-between gap-4 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Users className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Children & Kids</p>
                                        <p className="text-xs text-muted-foreground">Ages 3-12</p>
                                    </div>
                                </div>
                                <p className="font-bold text-primary">{formatPeso(100)}</p>
                            </GuestCard>
                            <GuestCard className="flex items-center justify-between gap-4 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Star className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Senior Citizens</p>
                                        <p className="text-xs text-muted-foreground">With valid ID</p>
                                    </div>
                                </div>
                                <p className="font-bold text-primary">{formatPeso(120)}</p>
                            </GuestCard>
                            <p className="text-center text-xs italic text-muted-foreground">
                                Bring a valid ID for senior citizen rate.
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-center text-xs italic text-muted-foreground">
                        Rates may vary depending on stay type, accommodation, date, and resort policies.
                        Final pricing is shown during booking.
                    </p>
                </GuestSection>

                <GuestSection
                    compact
                    title="Accommodations"
                    description="Select the perfect space for your group. From intimate suites to expansive villas."
                    actions={
                        <Button asChild variant="outline" size="sm">
                            <Link to="/accommodation">View All</Link>
                        </Button>
                    }
                >
                    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
                        <AccommodationPreviewCard accommodation={featuredAccommodation} featured />
                        <div className="grid gap-4">
                            {sideAccommodations.map((accommodation, index) => (
                                <AccommodationPreviewCard
                                    key={accommodation.id}
                                    accommodation={accommodation}
                                    highlighted={index === 0}
                                />
                            ))}
                        </div>
                    </div>
                </GuestSection>
            </GuestContainer>

            <div className="bg-muted/45">
                <GuestContainer>
                    <GuestSection
                        compact
                        title="Pre-Order Filipino Favorites"
                        description="Skip the wait. Pre-order our signature dishes prepared fresh for your arrival."
                    >
                        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
                            <div className="relative min-h-[300px] overflow-hidden rounded-xl border shadow-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=1200&q=80"
                                    alt="Filipino feast platter"
                                    className="absolute inset-0 size-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" />
                                <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-5 text-white">
                                    <GuestInfoChip className="w-fit border-primary bg-primary text-primary-foreground">
                                        Chef&apos;s Special Combo
                                    </GuestInfoChip>
                                    <h3 className="mt-3 text-2xl font-bold">Feast Platter</h3>
                                    <p className="mt-1 max-w-md text-sm text-white/85">
                                        A generous serving of crispy pata, kare-kare, and adobo. Perfect for
                                        sharing with the group.
                                    </p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <p className="font-bold">{formatPeso(1850)}</p>
                                        <Button asChild size="sm" variant="outline">
                                            <Link to="/accommodation">Add to Stay</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-3">
                                {foodItems.map((item) => (
                                    <GuestCard key={item.name} className="flex items-center gap-4 p-3">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="size-20 rounded-md object-cover"
                                            loading="lazy"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-semibold">{item.name}</h3>
                                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                {item.description}
                                            </p>
                                            <p className="mt-2 text-sm font-bold">{formatPeso(item.price)}</p>
                                        </div>
                                        <Info className="size-4 text-primary" />
                                    </GuestCard>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <GuestCard className="flex items-start gap-3 p-4">
                                <Info className="mt-0.5 size-4 text-primary" />
                                <div>
                                    <h3 className="text-sm font-semibold">Outside Food & Corkage</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Bringing outside food is allowed. A standard corkage fee applies for
                                        alcoholic beverages.
                                    </p>
                                </div>
                            </GuestCard>
                            <GuestCard className="flex items-start gap-3 p-4">
                                <Clock className="mt-0.5 size-4 text-primary" />
                                <div>
                                    <h3 className="text-sm font-semibold">Pre-Order Timing</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Please finalize food pre-orders at least 24 hours before check-in to
                                        ensure availability.
                                    </p>
                                </div>
                            </GuestCard>
                        </div>
                    </GuestSection>
                </GuestContainer>
            </div>

            <GuestContainer>
                <GuestSection
                    compact
                    title="Simple Booking Process"
                    description="After choosing your accommodation, the booking flow guides you through the exact details needed to confirm."
                >
                    <GuestCard className="overflow-hidden rounded-lg border-border/80 p-0 shadow-none">
                        <div className="flex flex-col gap-1.5 border-b bg-background/80 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                    Booking Flow Preview
                                </p>
                                <h3 className="text-base font-bold">Complete Your Booking</h3>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">Step 3 of 5</p>
                        </div>
                        <div className="px-4 py-4 md:px-5 md:py-5">
                            <div className="relative">
                                <div className="absolute left-0 right-0 top-4 hidden h-1 rounded-full bg-muted md:block" />
                                <div className="booking-flow-preview-progress absolute left-0 top-4 hidden h-1 rounded-full bg-primary md:block" />
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-3">
                                    {bookingSteps.map(({ label, icon: Icon }, index) => {
                                        const stepNumber = index + 1;
                                        const isComplete = stepNumber < 3;
                                        const isCurrent = stepNumber === 3;

                                        return (
                                            <div
                                                key={label}
                                                className="relative flex items-center gap-3 md:flex-col md:gap-2 md:text-center"
                                            >
                                                <div
                                                    className={
                                                        isComplete || isCurrent
                                                            ? "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm"
                                                            : "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-bold text-muted-foreground"
                                                    }
                                                >
                                                    {isComplete ? (
                                                        <CheckCircle2 className="size-5" />
                                                    ) : (
                                                        stepNumber
                                                    )}
                                                    {isCurrent ? (
                                                        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/25" />
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0">
                                                    <Icon
                                                        className={
                                                            isComplete || isCurrent
                                                                ? "hidden size-4 text-primary md:mx-auto md:block"
                                                                : "hidden size-4 text-muted-foreground md:mx-auto md:block"
                                                        }
                                                    />
                                                    <p
                                                        className={
                                                            isCurrent
                                                                ? "text-sm font-semibold text-primary md:text-xs"
                                                                : "text-sm font-medium text-foreground md:text-xs"
                                                        }
                                                    >
                                                        {label}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </GuestCard>
                </GuestSection>

                <GuestSection compact title="Important Policies" description="Key information to know before you book.">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {policies.map(({ title, description, icon: Icon }) => (
                            <GuestCard key={title} accent className="p-4">
                                <Icon className="mb-3 size-5 text-primary" />
                                <h3 className="text-sm font-semibold">{title}</h3>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                            </GuestCard>
                        ))}
                    </div>
                </GuestSection>

                <GuestSection compact title="Frequently Asked Questions" className="pb-12">
                    <GuestCard className="mx-auto max-w-3xl p-2">
                        <Accordion type="single" collapsible>
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={faq.question}
                                    value={`faq-${index}`}
                                    className="border-b last:border-b-0"
                                >
                                    <AccordionTrigger className="rounded-md px-4 py-3 text-left text-sm font-medium hover:bg-muted/60 hover:no-underline">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </GuestCard>
                </GuestSection>
            </GuestContainer>

            <Footer />
            <Chatbot />
        </GuestPageShell>
    );
};

type AccommodationPreviewCardProps = {
    accommodation: Pick<
        Accommodation,
        "id" | "name" | "description" | "imageUrl" | "type" | "capacity" | "price" | "amenities" | "stayOptions"
    >;
    featured?: boolean;
    highlighted?: boolean;
};

const AccommodationPreviewCard = ({
    accommodation,
    featured = false,
    highlighted = false,
}: AccommodationPreviewCardProps) => {
    const stayLabels = getStayLabels(accommodation);

    return (
        <GuestCard
            padded={false}
            className={
                highlighted
                    ? "overflow-hidden bg-primary text-primary-foreground"
                    : featured
                      ? "h-full overflow-hidden"
                      : "overflow-hidden"
            }
        >
            <div className={featured ? "flex h-full flex-col" : undefined}>
                <div className={featured ? "relative min-h-72 flex-1" : "relative min-h-52"}>
                    <img
                        src={accommodation.imageUrl}
                        alt={accommodation.name}
                        className="absolute inset-0 size-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        {stayLabels.slice(0, 2).map((label) => (
                            <GuestInfoChip
                                key={label}
                                className={
                                    highlighted
                                        ? "border-white/20 bg-white text-primary"
                                        : "bg-background/90 backdrop-blur"
                                }
                            >
                                {label}
                            </GuestInfoChip>
                        ))}
                    </div>
                </div>
                <div className={featured ? "flex min-h-64 flex-col p-4 md:p-5" : "flex flex-col p-4"}>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <span className={highlighted ? "text-white/80" : "text-muted-foreground"}>
                            {accommodation.type === "EventHall" ? "Event Hall" : accommodation.type}
                        </span>
                        <span className={highlighted ? "text-white/80" : "text-muted-foreground"}>
                            Up to {accommodation.capacity} guests
                        </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold">{accommodation.name}</h3>
                    <p
                        className={
                            highlighted
                                ? "mt-2 line-clamp-3 text-sm leading-6 text-white/85"
                                : "mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground"
                        }
                    >
                        {accommodation.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {accommodation.amenities.slice(0, featured ? 3 : 2).map((amenity) => (
                            <GuestInfoChip
                                key={amenity}
                                className={
                                    highlighted
                                        ? "border-white/20 bg-white/15 text-white"
                                        : "border bg-background"
                                }
                            >
                                {amenity}
                            </GuestInfoChip>
                        ))}
                    </div>
                    <GuestDivider className={highlighted ? "my-4 border-white/20" : "my-4"} />
                    <div className="mt-auto flex items-end justify-between gap-4">
                        <div>
                            <p className={highlighted ? "text-xs text-white/75" : "text-xs text-muted-foreground"}>
                                Starting from
                            </p>
                            <p className="text-xl font-extrabold">
                                {formatPeso(accommodation.price)}
                                <span className={highlighted ? "ml-1 text-xs font-normal text-white/75" : "ml-1 text-xs font-normal text-muted-foreground"}>
                                    /{accommodation.type === "EventHall" ? "day" : "stay"}
                                </span>
                            </p>
                        </div>
                        <Button asChild size="sm" variant={highlighted ? "secondary" : "outline"}>
                            <Link to={`/accommodation/${accommodation.id}`}>
                                {featured ? "Details" : "Book"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </GuestCard>
    );
};

export default Home;
