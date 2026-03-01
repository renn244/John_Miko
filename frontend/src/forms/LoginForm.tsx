import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PasswordInput from "@/components/ui/passwordInput"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, LogIn, User } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"

const LoginForm = () => {
    const [userRole, setUserRole] = useState('guest');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password, userRole });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
                
            {/* User Role Selection */}
            <div className='grid gap-2'>
                <Label htmlFor="role">
                    Login As
                </Label>
                <Select value={userRole} onValueChange={setUserRole}>
                    <SelectTrigger id="role" className="w-full">
                        <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="guest" className="flex items-center gap-2">
                            <User className="w-4 h-4" style={{ color: '#1E73BE' }} />
                            <span>Guest</span>
                        </SelectItem>
                        <SelectItem value="staff" className="flex items-center gap-2">
                            <User className="w-4 h-4" style={{ color: '#1E73BE' }} />
                            <span>Staff</span>
                        </SelectItem>
                        <SelectItem value="admin" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" style={{ color: '#1E73BE' }} />
                            <span>Administrator</span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Email Input */}
            <div className='grid gap-2'>
                <Label htmlFor="email">
                    Email
                </Label>
                <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                />
            </div>

            {/* Password Input */}
            <div className='grid gap-2'>
                <Label htmlFor="password">
                Password
                </Label>
                <PasswordInput 
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
                <FieldGroup className='w-56'>
                    <Field orientation="horizontal">
                        <Checkbox id='remember-me' />
                        <FieldLabel htmlFor='remember-me'>
                        Remember me
                        </FieldLabel>
                    </Field>
                </FieldGroup>

                <Link
                to="/forgot-password"
                className="text-primary font-medium hover:underline underline-offset-2"
                >
                Forgot Password?
                </Link>
            </div>

            {/* Login Button */}
            <Button
            className='w-full'
            type="submit"
            variant="default"
            >
                <LogIn className="w-5 h-5" />
                Sign In
            </Button>
        </form>
    )
}

export default LoginForm