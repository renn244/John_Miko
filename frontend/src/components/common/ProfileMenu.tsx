import { useAuthContext } from "@/context/AuthContext";
import { useClosureAdminStore } from "@/store/admin/closureAdmin.store";
import { FolderKanban, History, Lock, LogOutIcon, Settings } from "lucide-react";
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
                        <Button variant="ghost" size="icon" className="rounded-full focus-visible:rounded-full">
                            <UserAvatar avatarUrl={""} name={user.name || user.email} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {user.role === "ADMIN" && <AdminMenu />}
                        {user.role === "GUEST" && <GuestMenu />}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild>
                    <Link to="/login">Login</Link>
                </Button>
            )}
        </div>
    )
}

type MobileProfileMenuProps = {
    onSelect: () => void;
};

export const MobileProfileMenu = ({ onSelect }: MobileProfileMenuProps) => {
    const { user, handleLogout } = useAuthContext();
    const setClosureOpen = useClosureAdminStore((s) => s.setClosureOpen);

    if (!user) {
        return (
            <Button asChild className="h-11 w-full">
                <Link to="/login" onClick={onSelect}>Login</Link>
            </Button>
        );
    }

    const isAdmin = user.role === "ADMIN";
    const accountLabel = isAdmin ? "Administrator" : "Guest account";
    const itemClassName = "h-11 w-full justify-start";

    const handleLogoutClick = () => {
        handleLogout();
        onSelect();
    };

    const handleResortClosure = () => {
        setClosureOpen(true, null);
        onSelect();
    };

    return (
        <section className="border-t pt-5" aria-label="Account">
            <div className="flex items-center gap-3 px-1">
                <UserAvatar avatarUrl="" name={user.name || user.email} />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                        {user.name || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{accountLabel}</p>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-1">
                {isAdmin ? (
                    <>
                        <Button variant="ghost" className={itemClassName} onClick={handleResortClosure}>
                            <Lock data-icon="inline-start" />
                            Resort Closure
                        </Button>
                        <Button variant="ghost" className={itemClassName} asChild>
                            <Link to="/admin" onClick={onSelect}>
                                <FolderKanban data-icon="inline-start" />
                                Admin Dashboard
                            </Link>
                        </Button>
                        <Button variant="ghost" className={itemClassName} asChild>
                            <Link to="/admin/settings" onClick={onSelect}>
                                <Settings data-icon="inline-start" />
                                Settings
                            </Link>
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" className={itemClassName} asChild>
                            <Link to="/my-bookings" onClick={onSelect}>
                                <History data-icon="inline-start" />
                                My Bookings
                            </Link>
                        </Button>
                        <Button variant="ghost" className={itemClassName} asChild>
                            <Link to="/settings" onClick={onSelect}>
                                <Settings data-icon="inline-start" />
                                Settings
                            </Link>
                        </Button>
                    </>
                )}
                <Button variant="ghost" className={itemClassName} onClick={handleLogoutClick}>
                    <LogOutIcon data-icon="inline-start" />
                    Sign Out
                </Button>
            </div>
        </section>
    );
};

const GuestMenu = () => {
    const { handleLogout } = useAuthContext();

    return (
        <>
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link to="/my-bookings">
                        <History />
                        My Bookings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/settings">
                        <Settings />
                        Settings
                    </Link>
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
    const setClosureOpen = useClosureAdminStore((s) => s.setClosureOpen);

    return (
        <>
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setClosureOpen(true, null)}>
                    <Lock />
                    Resort Closure
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/admin">
                        <FolderKanban />
                        Admin Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/admin/settings">
                        <Settings />
                        Settings
                    </Link>
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

export default ProfileMenu
