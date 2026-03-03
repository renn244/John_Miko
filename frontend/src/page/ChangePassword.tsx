import ChangePasswordForm from "@/forms/ChangePasswordForm";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const ChangePassword = () => {
    const [isSubmitted, setIsSubmitted] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F1F5F9' }}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

                <HeaderImage />

                <div className="p-6">
                    {!isSubmitted ? (
                        <div>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold mb-2">
                                    Reset Your Password
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Create a strong password for your account
                                </p>
                            </div>

                            <ChangePasswordForm />

                            <div className="mt-6 text-center">
                                <Link to="/login" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <ChangedPasswordMessage />
                    )}
                </div>
            </div>
        </div>
    );
}

const HeaderImage = () => {
    return (
        <div className="relative h-40 overflow-hidden">
            <img
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHN1bnNldCUyMG9jZWFufGVufDF8fHx8MTczMzA5ODAwOXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Beach Sunset"
            className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60" />
            
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-1">
                        John Miko's Place
                    </h1>   
                    <p className="text-sm text-white/90">Beach Resort</p>
                </div>
            </div>
        </div>
    );
}

const ChangedPasswordMessage = () => {
    return (
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-green-100">
                <CheckCircle className="w-10 h-10 text-green-600"  />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Password Reset Successfully
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
                Your password has been changed. You can now log in with your new password.
            </p>

            <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                    Redirecting to login page in 3 seconds...
                </p>
                <Link 
                to="/login"
                className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go to Login
                </Link>
            </div>
        </div>
    );
}

export default ChangePassword