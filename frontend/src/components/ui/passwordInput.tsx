import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Input } from "./input";

type PasswordInputProps = {
    containerClassName?: string;
} & ComponentProps<"input"> 

const PasswordInput = ({ containerClassName, className, ...props }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <div className={cn("relative", className)}>
            <Input {...props} type={showPassword ? "text" : "password"} 
            className={cn(containerClassName, "pr-7")} />
            {
                showPassword ? (
                    <Eye className={cn('absolute h-5 w-5 right-2 top-2 cursor-pointer text-muted-foreground')} 
                    onClick={() => setShowPassword(false)} />
                ) : (
                    <EyeOff className={cn('absolute h-5 w-5 right-2 top-2 cursor-pointer text-muted-foreground')} 
                    onClick={() => setShowPassword(true)} />
                )
            }
        </div>
    )
}

export default PasswordInput;