import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import PasswordInput from "@/components/ui/passwordInput"
import { Lock } from "lucide-react"

const ChangePasswordForm = () => {
    return (
        <form onSubmit={() => undefined} className="space-y-5">

            <div className="grid gap-2">
                <Label htmlFor="newPassword">
                    New Password
                </Label>
                <PasswordInput />
            </div>


            <div className="grid gap-2">
                <Label htmlFor="confirmPassword">
                    Confirm Password
                </Label>
                <PasswordInput />
            </div>

            <Button type="submit" className="w-full">
                <Lock className="w-5 h-5" />
                Reset Password
            </Button>
        </form>
    )
}

export default ChangePasswordForm