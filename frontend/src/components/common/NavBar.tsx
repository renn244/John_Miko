import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import SetClosureDialog from "../pageComponents/Admin/Closure/SetClosureDialog";
import ProfileMenu, { MobileProfileMenu } from "./ProfileMenu";

const NavBar = () => {
    const { user } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className="w-full bg-background border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <Link to='/' className="flex shrink-0 items-center">
                            <img
                                src="/logo/JMPort_With_MarkDown.png"
                                alt="JMPort"
                                className="h-6 w-auto max-w-[96px] object-contain sm:h-7 sm:max-w-[112px]"
                            />
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            <NavLink to="/amenities" className={({ isActive }) =>
                                `font-medium text-sm border-b-2 pb-1 ${isActive ? 'border-primary text-primary' : 'border-transparent'}`
                            }>
                                Amenities
                            </NavLink>
                            <NavLink to="/virtual-tour" className={({ isActive }) =>
                                `font-medium text-sm border-b-2 pb-1 ${isActive ? 'border-primary text-primary' : 'border-transparent'}`
                            }>
                                Virtual Tour
                            </NavLink>
                            <NavLink to="/accommodation" className={({ isActive }) =>
                                `font-medium text-sm border-b-2 pb-1 ${isActive ? 'border-primary text-primary' : 'border-transparent'}`
                            }>
                                Accommodation
                            </NavLink>
                            <NavLink to="/menu" className={({ isActive }) =>
                                `font-medium text-sm border-b-2 pb-1 ${isActive ? 'border-primary text-primary' : 'border-transparent'}`
                            }>
                                Menu
                            </NavLink>
                            <NavLink to="/about" className={({ isActive }) =>
                                `font-medium text-sm border-b-2 pb-1 ${isActive ? 'border-primary text-primary' : 'border-transparent'}`
                            }>
                                About
                            </NavLink>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block">
                                {user ? <ProfileMenu /> : (
                                    <Button asChild>
                                        <Link to="/login">Login</Link>
                                    </Button>
                                )}
                            </div>

                            <div className="md:hidden">
                                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon-lg"
                                            className="size-11"
                                            aria-label="Open navigation menu"
                                        >
                                            <Menu />
                                        </Button>
                                    </SheetTrigger>

                                    <SheetContent
                                        side="right"
                                        className="w-full gap-0 p-0 sm:max-w-sm"
                                        showCloseButton={false}
                                    >
                                        <SheetHeader className="flex-row items-center justify-between border-b p-4 text-left">
                                            <div>
                                                <SheetTitle className="text-lg">Menu</SheetTitle>
                                                <SheetDescription className="sr-only">
                                                    Site navigation and account actions
                                                </SheetDescription>
                                            </div>
                                            <SheetClose asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-lg"
                                                    className="size-11"
                                                    aria-label="Close navigation menu"
                                                >
                                                    <X />
                                                </Button>
                                            </SheetClose>
                                        </SheetHeader>

                                        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-5" aria-label="Mobile navigation">
                                            <NavLink to="/amenities" onClick={() => setIsOpen(false)} className="flex min-h-11 items-center rounded-md px-3 text-base font-medium hover:bg-accent">
                                                Amenities
                                            </NavLink>
                                            <NavLink to="/virtual-tour" onClick={() => setIsOpen(false)} className="flex min-h-11 items-center rounded-md px-3 text-base font-medium hover:bg-accent">
                                                Virtual Tour
                                            </NavLink>
                                            <NavLink to="/accommodation" onClick={() => setIsOpen(false)} className="flex min-h-11 items-center rounded-md px-3 text-base font-medium hover:bg-accent">
                                                Accommodation
                                            </NavLink>
                                            <NavLink to="/menu" onClick={() => setIsOpen(false)} className="flex min-h-11 items-center rounded-md px-3 text-base font-medium hover:bg-accent">
                                                Menu
                                            </NavLink>
                                            <NavLink to="/about" onClick={() => setIsOpen(false)} className="flex min-h-11 items-center rounded-md px-3 text-base font-medium hover:bg-accent">
                                                About
                                            </NavLink>

                                            <div className="mt-4">
                                                {user ? <MobileProfileMenu onSelect={() => setIsOpen(false)} /> : (
                                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                                        <Button className="h-11 w-full">Login</Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </nav>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {user?.role === "ADMIN" ? <SetClosureDialog /> : null}
        </>
    );
};

export default NavBar;
