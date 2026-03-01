import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Password reset request for:', email);

        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F1F5F9' }}>
            <Card className="w-full max-w-md bg-white shadow-2xl overflow-hidden py-0 gap-0">
                
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

                <div className="p-6">
                    {/* <AnimatePresence mode="wait"> */}
                    {!isSubmitted ? (
                        <div>
                            <div className="text-center mb-3">
                                <h2 className="text-2xl font-bold mb-1">
                                    Forgot Password?
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    No worries, we'll send you reset instructions
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className='grid gap-2'>
                                    <Label htmlFor="email">
                                        Email
                                    </Label>
                                    <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    <Send className="w-5 h-5" />
                                    Send Reset Link
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link to="/login" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-green-100">
                                <CheckCircle className="w-10 h-10 text-green-600"  />
                            </div>

                            <h2 className="text-2xl font-bold mb-2">
                                Check Your Email
                            </h2>
                            <p className="text-sm mb-1 text-muted-foreground">
                                We've sent password reset instructions to
                            </p>
                            <p className="font-semibold mb-6 text-blue-600">
                                {email}
                            </p>

                            <div className="space-y-3">
                                <p className="text-xs text-muted-foreground">
                                    Didn't receive the email? Check your spam folder or
                                </p>
                                <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail('');
                                }}
                                className="text-sm text-blue-600 font-medium hover:underline"
                                >
                                    Try another email address
                                </button>
                            </div>

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
                {/* </AnimatePresence> */}
                </div>
            </Card>
        </div>
    );
}