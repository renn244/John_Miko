import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router";
import { Button } from "../ui/button";
import ProfileMenu from "./ProfileMenu";

const NavBar = () => {
    const { user } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className="w-full bg-white border-b sticky top-0 z-50">
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
                                    <Link to="/login">
                                        <Button>Login</Button>
                                    </Link>
                                )}
                            </div>

                            {/* Burger */}
                            <button 
                                className="md:hidden"
                                onClick={() => setIsOpen(true)}
                            >
                                <Menu />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* BACKDROP */}
            <div 
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setIsOpen(false)}
            />

            {/* SIDE DRAWER */}
            {/* FULL SCREEN DRAWER */}
            <div className={`fixed top-0 right-0 h-full w-full bg-white z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "translate-x-full"}
            `}>

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="font-semibold text-lg">Menu</span>
                    <button onClick={() => setIsOpen(false)}>
                        <X />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col p-6 space-y-6 text-lg">

                    <NavLink 
                        to="/amenities" 
                        onClick={() => setIsOpen(false)}
                        className="font-medium"
                    >
                        Amenities
                    </NavLink>

                    <NavLink 
                        to="/virtual-tour" 
                        onClick={() => setIsOpen(false)}
                        className="font-medium"
                    >
                        Virtual Tour
                    </NavLink>

                    <NavLink 
                        to="/accommodation" 
                        onClick={() => setIsOpen(false)}
                        className="font-medium"
                    >
                        Accommodation
                    </NavLink>

                    <NavLink 
                        to="/menu" 
                        onClick={() => setIsOpen(false)}
                        className="font-medium"
                    >
                        Menu
                    </NavLink>

                    <NavLink 
                        to="/about" 
                        onClick={() => setIsOpen(false)}
                        className="font-medium"
                    >
                        About
                    </NavLink>

                    <div className="pt-6 border-t">
                        {user ? <ProfileMenu /> : (
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <Button className="w-full">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavBar;
