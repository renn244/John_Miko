import { Button } from "@/components/ui/button";
import ForgotPasswordForm, { type forgotPasswordSchemaType } from "@/forms/ForgotPasswordForm";
import { useResendForgotPasswordMutation } from "@/hooks/auth.hook";
import { CheckCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [resendTimer, setResendTimer] = useState(30);
    const [isResendAllowed, setIsResendAllowed] = useState(false);

    const {
        mutateAsync: resendForgotPassword,
        isPending: isResending,
    } = useResendForgotPasswordMutation();

    const handleChangeSendEmail = (data: forgotPasswordSchemaType) => {
        setEmail(data.email);
        setIsSubmitted(true);

        setIsResendAllowed(false);
        setResendTimer(30);
    };

    const handleResend = async () => {
        await resendForgotPassword({ email }, {
            onSuccess: () => {
                setIsResendAllowed(false);
                setResendTimer(30);
            },
        });
    };

    useEffect(() => {
        if (!isSubmitted) return;
        if (resendTimer === 0) {
            setIsResendAllowed(true);
            return;
        }

        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsResendAllowed(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted, resendTimer]);

    return (
        <RecoveryShell>
            {!isSubmitted ? (
                <div className="space-y-3">
                    <AuthHeader
                        title="Forgot Password?"
                        description="Enter your email address and we'll send reset instructions."
                    />

                    <ForgotPasswordForm handleChangeSendEmail={handleChangeSendEmail} />

                    <BackToLogin />
                </div>
            ) : (
                <div className="text-center">
                    <div className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="size-7 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-normal text-foreground">
                        Check Your Email
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        If an account exists for this email, reset instructions have been sent.
                    </p>
                    <p className="mt-2 font-semibold text-primary">{email}</p>

                    <div className="mt-6 space-y-3">
                        {isResendAllowed ? (
                            <Button
                                type="button"
                                className="w-full"
                                disabled={!isResendAllowed || isResending}
                                onClick={handleResend}
                            >
                                {isResending ? "Sending..." : "Resend Email"}
                            </Button>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Resend available in {resendTimer}s
                            </p>
                        )}

                        <BackToLogin />
                    </div>
                </div>
            )}
        </RecoveryShell>
    );
}

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
