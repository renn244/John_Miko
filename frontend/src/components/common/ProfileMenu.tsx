import { useAuthContext } from "@/context/AuthContext";
import { useClosureAdminStore } from "@/store/admin/closureAdmin.store";
import { CreditCardIcon, FolderKanban, History, Lock, LogOutIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

const ProfileMenu = () => {
    const { user } = useAuthContext();

    return (
        <div>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounde-full focus-visible:rounded-full">
                            <UserAvatar avatarUrl={""} name={user.name || user.email} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {user.role === "ADMIN" && <AdminMenu />}
                        {user.role === "GUEST" && <GuestMenu />}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link to="/login">
                    <Button>
                        Login
                    </Button>
                </Link>
            )}
        </div>
    )
}

const GuestMenu = () => {
    const { handleLogout } = useAuthContext();

    return (
        <>
            <DropdownMenuGroup>
                <Link to="/my-bookings">
                    <DropdownMenuItem>
                        <History />
                        My Bookings
                    </DropdownMenuItem>
                </Link>
                <Link to="/settings">
                    <DropdownMenuItem>
                        <CreditCardIcon />
                        Settings
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
                <LogOutIcon />
                Log Out
            </DropdownMenuItem>
        </>
    )
}

const AdminMenu = () => {
    const { handleLogout } = useAuthContext();
    const setClosureOpen = useClosureAdminStore((s) => s.setClosureOpen);

    return (
        <>
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setClosureOpen(true, null)}>
                    <Lock />
                    Resort Closure
                </DropdownMenuItem>
                <Link to="/admin">
                    <DropdownMenuItem>
                        <FolderKanban />
                        Admin Dashboard
                    </DropdownMenuItem>
                </Link>
                <Link to="/admin/settings">
                    <DropdownMenuItem>
                        <CreditCardIcon />
                        Settings
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
                <LogOutIcon />
                Sign Out
            </DropdownMenuItem>
        </>
    )
}

export default ProfileMenu
