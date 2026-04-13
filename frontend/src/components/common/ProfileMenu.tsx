import { useAuthContext } from "@/context/AuthContext";
import { BadgeCheckIcon, CreditCardIcon, FolderKanban, LogOutIcon } from "lucide-react";
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
                        {user.role !== "ADMIN" && <GuestMenu />}
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
                <DropdownMenuItem>
                    {/* For the Account Information */}
                    <BadgeCheckIcon />
                    Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                    {/* For the Settings and Privacy */}
                    <CreditCardIcon />
                    Settings
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
                <LogOutIcon />
                Sign Out
            </DropdownMenuItem>
        </>
    )
}

const AdminMenu = () => {
    const { handleLogout } = useAuthContext();

    return (
        <>
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    {/* For the Account Information */}
                    <BadgeCheckIcon />
                    Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                    {/* For the Settings and Privacy */}
                    <CreditCardIcon />
                    Settings
                </DropdownMenuItem>
                <Link to="/admin">
                    <DropdownMenuItem>
                        <FolderKanban />
                        Admin Dashboard
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