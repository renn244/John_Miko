import { useAuthContext } from "@/context/AuthContext";
import { TreePalm } from "lucide-react";
import { Link, NavLink } from "react-router";
import { Button } from "../ui/button";
import ProfileMenu from "./ProfileMenu";

const NavBar = () => {
    const { user } = useAuthContext();

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to='/' className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary">
                            <TreePalm className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-lg">John Miko's Place</h1>
                            <p className="text-xs">Private Resort</p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-6">
                        <NavLink to={'/amenities'} className={({ isActive }) => `font-medium text-sm border-b-2 pb-1  ${isActive ? 'border-primary text-primary' : 'border-transparent'}`}>
                            Amenities
                        </NavLink>
                        <NavLink to={'/accommodation'} className={({ isActive }) => `font-medium text-sm border-b-2 pb-1 ${isActive ? 'border-primary text-primary' : 'border-transparent'}`}>
                            Accommodation
                        </NavLink>
                        <NavLink to={'/about'} className={({ isActive }) => `font-medium text-sm border-b-2 pb-1 ${isActive ? 'border-primary text-primary' : 'border-transparent'}`}>
                            About
                        </NavLink>
                        <NavLink to={'/contact'} className={({ isActive }) => `font-medium text-sm border-b-2 pb-1 ${isActive ? 'border-primary text-primary' : 'border-transparent'}`}>
                            Contact
                        </NavLink>
                    </div>

                    <div>
                        {user ? (
                            <ProfileMenu />
                        ) : (
                            <Link to="/login">
                                <Button>
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default NavBar