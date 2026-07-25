import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import ResetPasswordForm from "@/forms/ResetPasswordForm";
import { CheckCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const token = searchParams.get("token");

    return (
        <RecoveryShell>
            {!isSubmitted ? (
                <div className="space-y-3">
                    <AuthHeader
                        title="Reset Password"
                        description="Create a new password for your John Miko's Place account."
                    />

                    <ResetPasswordForm
                        token={token || ""}
                        onSuccess={() => setIsSubmitted(true)}
                    />

                    <BackToLogin />
                </div>
            ) : (
                <ChangedPasswordMessage />
            )}
        </RecoveryShell>
    );
};

type RecoveryShellProps = {
    children: ReactNode;
};

const RecoveryShell = ({ children }: RecoveryShellProps) => (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4 text-foreground md:p-6">
        <section className="w-full max-w-md rounded-xl border bg-card p-5 shadow-sm sm:p-7">
            {children}
        </section>
    </main>
);

type AuthHeaderProps = {
    title: string;
    description: string;
};

const AuthHeader = ({ title, description }: AuthHeaderProps) => (
    <div className="mb-6">
        <img
            src="/logo/JMPort_With_MarkDown.png"
            alt="JMPort"
            className="h-8 w-auto max-w-[132px] object-contain"
        />
        <h1 className="mt-4 text-3xl font-bold tracking-normal text-foreground">
            {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
        </p>
    </div>
);

const BackToLogin = () => (
    <Button asChild variant="outline" className="w-full">
        <Link to="/login">Back to Login</Link>
    </Button>
);

const ChangedPasswordMessage = () => {
    const navigate = useNavigate();
    const [timer, setTimer] = useState(3);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        const redirectTimer = setTimeout(() => {
            navigate("/login");
        }, 3000);

        return () => {
            clearInterval(countdown);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <div className="text-center">
            <div className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="size-7 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold tracking-normal text-foreground">
                Password Updated
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your password has been reset. You can now sign in with your new password.
            </p>

            <div className="mt-6 space-y-3">
                {timer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Redirecting to login in {timer} second{timer > 1 ? "s" : ""}...
                    </p>
                ) : (
                    <LoadingSpinner className="mx-auto size-5" />
                )}
                <BackToLogin />
            </div>
        </div>
    );
};

export default ResetPassword;
