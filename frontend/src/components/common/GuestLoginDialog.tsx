import { useState, type ReactElement } from "react";
import { ArrowLeft, LockKeyhole, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "@/forms/LoginForm";

type GuestLoginDialogProps = {
    trigger: ReactElement;
};

type LoginStep = "choice" | "guest-form";

const GuestLoginDialog = ({ trigger }: GuestLoginDialogProps) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<LoginStep>("choice");

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            setStep("choice");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[420px]">
                <DialogTitle className="sr-only">Account login</DialogTitle>
                <DialogDescription className="sr-only">
                    Choose guest login or continue to the internal portal.
                </DialogDescription>

                <div className="overflow-hidden">
                    {step === "choice" ? (
                        <LoginChoicePanel
                            onGuestLogin={() => setStep("guest-form")}
                            onInternalLogin={() => {
                                setOpen(false);
                                navigate("/login");
                            }}
                        />
                    ) : (
                        <GuestLoginPanel onBack={() => setStep("choice")} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

type LoginChoicePanelProps = {
    onGuestLogin: () => void;
    onInternalLogin: () => void;
};

const LoginChoicePanel = ({ onGuestLogin, onInternalLogin }: LoginChoicePanelProps) => (
    <section className="animate-in fade-in-0 slide-in-from-left-3 duration-200 p-5 sm:p-6">
        <div>
            <p className="text-lg font-bold">Log in</p>
            <p className="mt-1 text-sm text-muted-foreground">
                Choose the right sign-in space for your account.
            </p>
        </div>

        <div className="mt-5 space-y-2">
            <Button className="w-full" onClick={onGuestLogin}>
                <UserRound data-icon="inline-start" />
                Log in as Guest
            </Button>
            <Button className="w-full" variant="outline" onClick={onInternalLogin}>
                <LockKeyhole data-icon="inline-start" />
                Internal Login
            </Button>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
            Internal access is for authorized resort staff only.
        </p>
    </section>
);

const GuestLoginPanel = ({ onBack }: { onBack: () => void }) => (
    <section className="animate-in fade-in-0 slide-in-from-right-3 duration-200 p-5 sm:p-6">
        <div>
            <p className="text-lg font-bold">Guest Login</p>
            <p className="mt-1 text-sm text-muted-foreground">
                Sign in to manage your bookings and reservations.
            </p>
        </div>

        <div className="mt-5">
            <LoginForm mode="guest" showAccountContext={false} />
        </div>

        <Button variant="outline" className="mt-3 w-full" onClick={onBack}>
            <ArrowLeft data-icon="inline-start" />
            Back
        </Button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup-guest" className="font-medium text-primary hover:underline">
                Register as Guest
            </Link>
        </p>
    </section>
);

export default GuestLoginDialog;
