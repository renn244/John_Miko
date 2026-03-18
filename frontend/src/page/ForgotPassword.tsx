import { Card } from '@/components/ui/card'
import ForgotPasswordForm, { type forgotPasswordSchemaType } from '@/forms/ForgotPasswordForm'
import { useResendForgotPasswordMutation } from '@/hooks/auth.hook'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const [resendTimer, setResendTimer] = useState(30)
    const [isResendAllowed, setIsResendAllowed] = useState(false)

    const { 
        mutateAsync: resendForgotPassword, 
        isPending: isResending, 
    } = useResendForgotPasswordMutation();

    const handleChangeSendEmail = (data: forgotPasswordSchemaType) => {
        setEmail(data.email)
        setIsSubmitted(true)

        setIsResendAllowed(false)
        setResendTimer(30)
    }

    const handleResend = async () => {
        await resendForgotPassword({ email }, {
            onSuccess: () => {
                setIsResendAllowed(false)
                setResendTimer(30)
            }
        })
    }
    
    useEffect(() => {
        if (!isSubmitted) return
        if (resendTimer === 0) {
            setIsResendAllowed(true)
            return
        }

        const timer = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setIsResendAllowed(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isSubmitted, resendTimer])

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">

            <Card className="w-full max-w-md bg-white shadow-2xl overflow-hidden py-0 gap-0">

                <div className="relative h-40 overflow-hidden">
                    <img
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19"
                    className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60" />

                    <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                        <div>
                            <h1 className="text-2xl font-bold">John Miko's Place</h1>
                            <p className="text-sm">Beach Resort</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">

                    {!isSubmitted ? (
                        <>
                            <div className="text-center mb-3">
                                <h2 className="text-2xl font-bold">Forgot Password?</h2>
                                <p className="text-sm text-muted-foreground">
                                    We'll send reset instructions
                                </p>
                            </div>

                            <ForgotPasswordForm handleChangeSendEmail={handleChangeSendEmail} />

                            <div className="mt-6 text-center">
                                <Link
                                to="/login"
                                className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">

                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-green-100">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>

                            <h2 className="text-2xl font-bold mb-2">
                                Check Your Email
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Reset instructions sent to
                            </p>

                            <p className="font-semibold text-blue-600 mb-6">
                                {email}
                            </p>

                            <p className="text-sm text-muted-foreground mb-2">
                                Didn't receive the email?
                            </p>

                            {isResendAllowed ? (
                                <button
                                disabled={!isResendAllowed || isResending}
                                onClick={handleResend}
                                className="text-blue-600 font-medium underline"
                                >
                                    Resend Email
                                </button>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Resend in {resendTimer}s
                                </p>
                            )}

                            <div className="mt-8">
                                <Link
                                to="/login"
                                className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>

                        </div>
                    )}

                </div>

            </Card>

        </div>
    )
}