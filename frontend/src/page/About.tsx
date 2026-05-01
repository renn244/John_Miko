import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    ChevronRight,
    Clock,
    Eye,
    Handshake,
    Heart,
    Leaf,
    Mail,
    MapPin,
    Phone,
    Shield,
    Target,
} from "lucide-react";
import { Link } from "react-router";

const coreValues = [
    {
        icon: Heart,
        title: 'Hospitality First',
        description: "Warm, thoughtful service from check-in to check-out—so your stay feels easy and welcoming.",
    },
    {
        icon: Shield,
        title: 'Quality & Safety',
        description: "We keep facilities clean, maintained, and guest-ready, with safety and comfort as our priority.",
    },
    {
        icon: Leaf,
        title: 'Sustainability',
        description: "Simple eco-friendly habits that help protect the place we all enjoy—today and for the future.",
    },
    {
        icon: Handshake,
        title: 'Integrity',
        description: "Clear policies and honest communication—so you can book and plan with confidence.",
    },
];

const About = () => {
    return (
        <div className="min-h-screen relative bg-background text-foreground">
            <NavBar />

            <section className="relative h-175 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1641150557653-e4c409426e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzc1ODE1MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="John Miko's Place Resort Aerial View"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/45 to-black/75" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent" />

                <div className="absolute inset-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="w-full text-white">
                            <div className="max-w-3xl">
                                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
                                    About John Miko&apos;s Place
                                </h1>
                                <p className="mt-5 text-lg sm:text-xl md:text-2xl text-white/90 font-light">
                                    Creating unforgettable coastal memories since 2014
                                </p>

                                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <Link to="/accommodation" className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full sm:w-auto">
                                            Browse Accommodations
                                            <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </Link>
                                    <Link to="/amenities" className="w-full sm:w-auto">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10"
                                        >
                                            View Amenities
                                            <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7">
                            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">About</p>
                            <h2 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Our Story</h2>
                            <div className="mt-5 space-y-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                                <p>
                                    Founded in 2014, John Miko's Place Resort began as a dream to create a coastal sanctuary
                                    where families and friends could escape the hustle of city life and reconnect with nature
                                    and each other.
                                </p>
                                <p>
                                    Named after our founder's beloved son, John Miko, the resort embodies the warmth, joy, and
                                    genuine Filipino hospitality that we want every guest to experience. What started as a small
                                    beachfront property has grown into a premier destination for celebrations, relaxation, and
                                    unforgettable memories.
                                </p>
                                <p>
                                    Today, we continue to honor our roots by providing exceptional service, maintaining pristine
                                    facilities, and treating every guest like family. Our commitment to excellence has made us a
                                    trusted name in coastal hospitality.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="rounded-3xl border bg-muted/20 p-5 md:p-6">
                                <div className="rounded-2xl overflow-hidden border bg-card shadow-md h-75 md:h-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1716301149701-b1b0389b466f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZpbGlwaW5vJTIwZmFtaWx5JTIwYmVhY2h8ZW58MXx8fHwxNzc1ODE1MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                        alt="Happy families at the resort"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-muted/20 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">About</p>
                        <h2 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Mission & Vision</h2>
                    </div>

                    <div className="mt-10 rounded-3xl flex border bg-card overflow-hidden">
                        <div className="p-6 md:p-8 transition-colors hover:bg-muted/30">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-primary/15">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Our Mission</h3>
                                    <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                                        To provide exceptional coastal hospitality that creates lasting memories for our guests
                                        through world-class facilities, genuine Filipino warmth, and a commitment to excellence in
                                        every detail. We strive to be the premier destination where families, friends, and
                                        celebrations come together.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-l" />

                        <div className="p-6 md:p-8 transition-colors hover:bg-muted/30">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-primary/15">
                                    <Eye className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Our Vision</h3>
                                    <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                                        To be recognized as the Philippines' most beloved coastal resort, setting the standard for
                                        sustainable tourism, innovative hospitality, and community engagement. We envision a future
                                        where every guest leaves not just satisfied, but transformed by the experience of Filipino
                                        coastal culture.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-background relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Values</p>
                        <h2 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Our Core Values</h2>
                        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 md:auto-rows-fr">
                        {coreValues.map((value, index) => {
                            const Icon = value.icon;
                            const isWideCard = index === 0 || index === coreValues.length - 1;

                            return (
                                <div
                                    key={value.title}
                                    className={
                                        `rounded-3xl p-6 md:p-7 border bg-card transition-colors hover:bg-muted/30 ${isWideCard ? "md:col-span-2" : ""}`
                                    }
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-primary/15">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{value.title}</h3>
                                            <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-muted/20 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7">
                            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Commitment</p>
                            <h2 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Our Commitment to You</h2>
                            <div className="mt-6 space-y-4 md:space-y-5 rounded-3xl border bg-card p-6 md:p-7">
                                <div className="flex items-start gap-3 md:gap-4">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-1 text-primary" />
                                    <div>
                                        <h4 className="font-semibold mb-1 text-base md:text-lg">
                                            Trained & Professional Staff
                                        </h4>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            Our team undergoes regular training to ensure the highest service standards and safety protocols.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 md:gap-4">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-1 text-primary" />
                                    <div>
                                        <h4 className="font-semibold mb-1 text-base md:text-lg">
                                            24/7 Chatbot Support
                                        </h4>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            Round-the-clock assistance to address inquiries and ensure transparency at all times.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 md:gap-4">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-1 text-primary" />
                                    <div>
                                        <h4 className="font-semibold mb-1 text-base md:text-lg">
                                            Continuous Improvement
                                        </h4>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            We actively listen to feedback and constantly upgrade our facilities and services.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 md:gap-4">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-1 text-primary" />
                                    <div>
                                        <h4 className="font-semibold mb-1 text-base md:text-lg">
                                            Sustainable Practices
                                        </h4>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            Environmentally conscious operations that protect our coastal paradise for future generations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="rounded-3xl border bg-muted/20 p-5 md:p-6">
                                <div className="rounded-2xl overflow-hidden border bg-card shadow-md h-75 md:h-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1718152220071-dc4396f654fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBzdGFmZiUyMHRlYW18ZW58MXx8fHwxNzc1ODE1MzI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                        alt="Our dedicated team"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-background relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Support</p>
                        <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Visit Us</h2>
                        <p className="mt-4 text-muted-foreground">
                            Find us at our beautiful coastal location
                        </p>
                    </div>

                    <div className="mt-10 space-y-5">
                        <div className="rounded-3xl overflow-hidden border bg-card">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2173.7788647223433!2d121.01468827929318!3d14.905257715337752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397a9bfaeb13b33%3A0x46457edc695c2db1!2sJohn%20Miko&#39;s%20Place%20Resort!5e1!3m2!1sen!2sph!4v1776763760595!5m2!1sen!2sph"
                                className="w-full h-87.5 md:h-146"
                                loading="lazy"
                                title="John Miko's Place Resort map"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        <div className="rounded-3xl border bg-card p-6 md:p-7 transition-colors hover:bg-muted/30">
                            <h3 className="font-bold text-lg">Get In Touch</h3>
                            <p className="mt-2 text-sm md:text-base text-muted-foreground">
                                We're here to help with your booking and answer any questions about our resort.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link to="/accommodation">
                                    <Button>
                                        Browse Accommodations
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/amenities">
                                    <Button variant="outline">
                                        See Amenities
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="rounded-3xl border bg-card p-6 transition-colors hover:bg-muted/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/15 shrink-0">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Location</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Pulong Yantok Norzagaray
                                            <br />
                                            Bulacan Philippines
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border bg-card p-6 transition-colors hover:bg-muted/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/15 shrink-0">
                                        <Phone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Phone</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            +63 123 456 7890
                                            <br />
                                            +63 987 654 3210
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border bg-card p-6 transition-colors hover:bg-muted/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/15 shrink-0">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Email</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            info@johnmikosplace.com
                                            <br />
                                            reservations@johnmikosplace.com
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border bg-card p-6 transition-colors hover:bg-muted/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/15 shrink-0">
                                        <Clock className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Hours</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            24/7 Guest Support
                                            <br />
                                            Open Daily
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default About