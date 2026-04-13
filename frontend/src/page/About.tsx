import NavBar from "@/components/common/NavBar";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye, Handshake, Heart, Leaf, Shield, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router";

const coreValues = [
    {
        icon: Heart,
        title: 'Hospitality First',
        description: 'We treat every guest like family...',
        iconColor: 'text-orange-500',
        bgColor: 'bg-orange-500/15',
    },
    {
        icon: Shield,
        title: 'Quality & Safety',
        description: 'Maintaining the highest standards...',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-600/15',
    },
    {
        icon: Leaf,
        title: 'Sustainability',
        description: 'Committed to eco-friendly practices...',
        iconColor: 'text-emerald-600',
        bgColor: 'bg-emerald-600/15',
    },
    {
        icon: Handshake,
        title: 'Integrity',
        description: 'Honest, transparent service...',
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-600/15',
    },
];

const About = () => {

    return (
        <div className="min-h-screen">
            
            <NavBar />

            <section className="relative h-100 md:h-125 overflow-hidden">
                <img
                src="https://images.unsplash.com/photo-1641150557653-e4c409426e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzc1ODE1MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="John Miko's Place Resort Aerial View"
                className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
                        <div className="text-white max-w-4xl">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6">About Us</h1>
                            <p className="text-lg md:text-xl lg:text-2xl text-white/95">
                                Creating unforgettable coastal memories since 2014
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-3 md:space-y-4 text-base md:text-lg text-muted-foreground">
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

                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-2xl h-75 md:h-100">
                                <img
                                src="https://images.unsplash.com/photo-1716301149701-b1b0389b466f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZpbGlwaW5vJTIwZmFtaWx5JTIwYmVhY2h8ZW58MXx8fHwxNzc1ODE1MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Happy families at the resort"
                                className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                        <div className="relative overflow-hidden rounded-2xl border-2">
                            <div className="relative p-4 md:p-6 lg:p-8">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 bg-primary">
                                        <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">
                                        Our Mission
                                    </h3>
                                </div>
                                <p className="text-base md:text-lg leading-relaxed text-justify text-muted-foreground">
                                    To provide exceptional coastal hospitality that creates lasting memories for our guests
                                    through world-class facilities, genuine Filipino warmth, and a commitment to excellence in
                                    every detail. We strive to be the premier destination where families, friends, and
                                    celebrations come together.
                                </p>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border-2">
                            <div className="relative p-6 md:p-8 lg:p-10">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 bg-primary">
                                        <Eye className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                                        Our Vision
                                    </h3>
                                </div>
                                <p className="text-base md:text-lg leading-relaxed text-justify text-muted-foreground">
                                    To be recognized as the Philippines' most beloved coastal resort, setting the standard for
                                    sustainable tourism, innovative hospitality, and community engagement. We envision a future
                                    where every guest leaves not just satisfied, but transformed by the experience of Filipino
                                    coastal culture.
                                </p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 md:mb-12 lg:mb-16">
                        <div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                                Our Core Values
                            </h2>
                            <p className="text-base md:text-lg text-muted-foreground">
                                The principles that guide everything we do
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {coreValues.map((value) => {
                            const Icon = value.icon;

                            return (
                                <div key={value.title} className="text-center">
                                    <div
                                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center transform hover:scale-110 transition-transform ${value.bgColor}`}
                                    >
                                        <Icon className={`w-8 h-8 md:w-10 md:h-10 ${value.iconColor}`} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="rounded-2xl overflow-hidden shadow-2xl h-75 md:h-100">
                                <img
                                src="https://images.unsplash.com/photo-1718152220071-dc4396f654fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBzdGFmZiUyMHRlYW18ZW58MXx8fHwxNzc1ODE1MzI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Our dedicated team"
                                className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                                Our Commitment to You
                            </h2>
                            <div className="space-y-4 md:space-y-5">
                                <div className="flex items-start gap-3 md:gap-4">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-1 text-emerald-600" />
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
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-1 text-emerald-600" />
                                    <div>
                                        <h4 className="font-semibold mb-1 text-base md:text-lg">
                                            24/7 Chatbot Support
                                        </h4>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            Round-the-clock assistance to address inquiries and ensure transparenancy at all times.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 md:gap-4">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-1 text-emerald-600" />
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
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-1 text-emerald-600" />
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
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20 relative overflow-hidden">
                <img
                src="https://images.unsplash.com/photo-1673138703974-41568ad10596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNvcnQlMjBzdW5zZXR8ZW58MXx8fHwxNzc1ODE1MzI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Resort at sunset"
                className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/80" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                            Experience the Difference
                        </h2>
                        <p className="text-lg md:text-xl mb-8 md:mb-10 text-white/95">
                            Join thousands of satisfied guests who have made John Miko's Place their coastal home away from home.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">

                            <Link to="/accommodations">
                                <Button size="lg">
                                    Explore Accommodations
                                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About