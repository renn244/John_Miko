import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="mt-auto border-t bg-background">
            <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <img
                            src="/logo/JMPort_With_MarkDown.png"
                            alt="JMPort"
                            className="mb-3 h-8 w-auto max-w-[132px] object-contain"
                        />
                        <p className="mb-3 max-w-xs text-sm leading-6 text-muted-foreground">
                            Your perfect coastal paradise for unforgettable memories.
                        </p>
                        <a
                            href="https://www.facebook.com/johnmikoplaceresort"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Visit John Miko's Place Resort on Facebook"
                            className="flex size-8 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/15"
                        >
                            <Facebook className="size-4 text-primary" />
                        </a>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-bold">Quick Links</h4>
                        <ul className="space-y-1.5">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/accommodation"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Accommodations
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/menu"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Menu
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-bold">Contact Us</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span className="text-sm leading-5 text-muted-foreground">
                                    Coastal Paradise Drive, Beach Resort Area
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span className="text-sm leading-5 text-muted-foreground">
                                    +63 123 456 7890
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span className="text-sm leading-5 text-muted-foreground">
                                    info@johnmikosplace.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 border-t pt-4">
                    <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
                        <p className="text-xs text-muted-foreground">
                            &copy; 2026 John Miko&apos;s Place Resort. All rights reserved.
                        </p>
                        <div className="flex gap-5">
                            <a href="#" className="text-xs text-muted-foreground hover:text-primary">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-xs text-muted-foreground hover:text-primary">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
