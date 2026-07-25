import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import {
    GuestCard,
    GuestContainer,
    GuestInfoChip,
    GuestPageShell,
    GuestSection,
} from "@/components/guest";
import { Button } from "@/components/ui/button";
import {
    CalendarCheck,
    CheckCircle2,
    Eye,
    Heart,
    MapPin,
    MessageSquare,
    ShieldCheck,
    Sparkles,
    Target,
    Users,
} from "lucide-react";
import { Link } from "react-router";

const coreValues = [
    {
        icon: Heart,
        title: "Hospitality First",
        description: "Genuine care and attention to every guest's needs.",
    },
    {
        icon: ShieldCheck,
        title: "Quality & Safety",
        description: "Clean, maintained spaces prepared for comfortable stays.",
    },
    {
        icon: MessageSquare,
        title: "Clear Communication",
        description: "Transparent pricing, policies, and booking expectations.",
    },
    {
        icon: Sparkles,
        title: "Continuous Improvement",
        description: "Guest feedback helps us keep improving the experience.",
    },
];

const reasons = [
    {
        icon: CalendarCheck,
        title: "Easy Online Booking",
        description: "Reserve your stay through a clear and simple booking flow.",
    },
    {
        icon: ShieldCheck,
        title: "Clear Pricing & Policies",
        description: "No hidden fees. Important rules are shown before booking.",
    },
    {
        icon: Sparkles,
        title: "Flexible Stay Options",
        description: "DayStay, Overnight, 22 Hours, and 12 Hours depending on availability.",
    },
    {
        icon: Users,
        title: "Family & Group Friendly",
        description: "Built for quick getaways, bonding, reunions, and small celebrations.",
    },
];

const About = () => {
    return (
        <GuestPageShell className="bg-background">
            <NavBar />

            <GuestContainer className="py-8 md:py-10">
                <div className="space-y-8 md:space-y-10">
                    <section className="max-w-4xl">
                        <h1 className="mt-2 text-4xl font-bold tracking-normal md:text-5xl">
                            About John Miko&apos;s Place
                        </h1>
                        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                            A welcoming local resort for family bonding, staycations, quick getaways, and small
                            celebrations, built around clear booking, comfortable facilities, and Filipino hospitality.
                        </p>
                    </section>

                    <section className="grid gap-5 lg:grid-cols-[1fr_420px] lg:items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-normal">Our Story</h2>
                            <div className="mt-4 max-w-3xl space-y-3 text-base leading-7 text-muted-foreground">
                                <p>
                                    John Miko&apos;s Place began with a simple vision: to create a welcoming haven
                                    where families and friends can gather, relax, and create lasting memories without
                                    straying too far from home.
                                </p>
                                <p>
                                    Built on genuine Filipino hospitality, our resort focuses on comfort, convenience,
                                    and a warm guest experience. Whether you&apos;re planning a quick weekend getaway,
                                    a family reunion, or a quiet retreat, we aim to make every stay easy and memorable.
                                </p>
                            </div>
                        </div>

                        <GuestCard padded={false} className="overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1100&q=80"
                                alt="Poolside resort view"
                                className="h-56 w-full object-cover md:h-64"
                                loading="lazy"
                            />
                        </GuestCard>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <GuestCard accent className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Target className="size-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-normal">Our Mission</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-[15px]">
                                        Provide comfortable, high-quality resort experiences that serve as the perfect
                                        backdrop for family memories while maintaining clean, guest-ready facilities.
                                    </p>
                                </div>
                            </div>
                        </GuestCard>

                        <GuestCard accent className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Eye className="size-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-normal">Our Vision</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-[15px]">
                                        Become a trusted local resort known for simple online booking, transparent
                                        pricing, and consistently excellent staycation experiences.
                                    </p>
                                </div>
                            </div>
                        </GuestCard>
                    </section>

                    <GuestSection
                        compact
                        title="Core Values"
                        description="The principles that guide our service and help shape every guest stay."
                    >
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {coreValues.map(({ icon: Icon, title, description }) => (
                                <GuestCard key={title}>
                                    <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10">
                                        <Icon className="size-5 text-primary" />
                                    </div>
                                    <h3 className="text-base font-semibold">{title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {description}
                                    </p>
                                </GuestCard>
                            ))}
                        </div>
                    </GuestSection>

                    <GuestSection
                        compact
                        title="Why Guests Choose Us"
                    >
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {reasons.map(({ icon: Icon, title, description }) => (
                                <GuestCard key={title} accent>
                                    <Icon className="mb-3 size-5 text-primary" />
                                    <h3 className="text-base font-semibold">{title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {description}
                                    </p>
                                </GuestCard>
                            ))}
                        </div>
                    </GuestSection>

                    <section className="space-y-4">
                        <h2 className="text-center text-3xl font-bold tracking-normal">Visit Us</h2>
                        <GuestCard padded={false} className="grid overflow-hidden md:grid-cols-[320px_1fr]">
                            <div className="space-y-4 p-4 md:p-5">
                                <div className="flex gap-3">
                                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold">Location</p>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Pulong Yantok, Norzagaray, Bulacan, Philippines
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold">Open Daily</p>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Booking availability depends on selected date and stay option.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <GuestInfoChip>Pool access</GuestInfoChip>
                                    <GuestInfoChip>Food pre-orders</GuestInfoChip>
                                    <GuestInfoChip>Parking</GuestInfoChip>
                                </div>
                            </div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2173.7788647223433!2d121.01468827929318!3d14.905257715337752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397a9bfaeb13b33%3A0x46457edc695c2db1!2sJohn%20Miko&#39;s%20Place%20Resort!5e1!3m2!1sen!2sph!4v1776763760595!5m2!1sen!2sph"
                                className="h-72 w-full border-0 md:h-full"
                                loading="lazy"
                                title="John Miko's Place Resort map"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </GuestCard>
                    </section>

                    <GuestCard className="text-center">
                        <h2 className="text-2xl font-bold tracking-normal">Ready to plan your stay?</h2>
                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                            Experience the comfort and joy of John Miko&apos;s Place. Book your next family getaway
                            or celebration today.
                        </p>
                        <Button asChild className="mt-5">
                            <Link to="/accommodation">Browse Accommodations</Link>
                        </Button>
                    </GuestCard>
                </div>
            </GuestContainer>

            <Footer />
        </GuestPageShell>
    );
};

export default About;
