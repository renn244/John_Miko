import { Facebook, Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router"

const Footer = () => {
    return (
        <footer className="bg-white border-t-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="md:col-span-1">
                        <h3 className="text-xl font-bold mb-4 text-primary">
                            John Miko's Place
                        </h3>
                        <p className="text-sm mb-4 text-muted-foreground">
                            Your perfect coastal paradise for unforgettable memories.
                        </p>
                        <div className="flex gap-3">
                            <Link
                            to="https://www.facebook.com/johnmikoplaceresort"
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/30"
                            >
                                <Facebook className="w-5 h-5 text-primary" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                to="/"
                                className="text-sm transition-colors text-muted-foreground"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                to="/about"
                                className="text-sm transition-colors text-muted-foreground"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                to="/accommodation"
                                className="text-sm transition-colors text-muted-foreground"
                                >
                                    Accommodations
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* <div>
                        <h4 className="font-bold mb-4">
                            More
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                to="/menu"
                                className="text-sm transition-colors text-muted-foreground"
                                >
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link
                                to="/information"
                                className="text-sm transition-colors text-muted-foreground"
                                >
                                    Information
                                </Link>
                            </li>
                            <li>
                                <Link
                                to="/contact"
                                className="text-sm transition-colors text-muted-foreground"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div> */}

                    <div>
                        <h4 className="font-bold mb-4">
                            Contact Us
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                    Coastal Paradise Drive, Beach Resort Area
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                    +63 123 456 7890
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                    info@johnmikosplace.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2026 John Miko's Place Resort. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                        <a href="#" className="text-sm text-muted-foreground">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-muted-foreground">
                            Terms of Service
                        </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer