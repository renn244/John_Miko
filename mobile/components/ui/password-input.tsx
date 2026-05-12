import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react-native'; // Standard in RN Reusables
import React, { ComponentProps, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Input } from './input';

type PasswordInputProps = {
    className?: string;
    defaultSecure?: boolean; 
} & Omit<ComponentProps<typeof Input>, 'secureTextEntry'>;

export function PasswordInput({
    className,
    defaultSecure = true,
    ...props
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(defaultSecure);

    return (
        <View className="relative">
            <Input
            secureTextEntry={!showPassword}
            className={cn("pr-12", className)}
            {...props}
            />

            <Pressable 
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3" 
            >
                {showPassword ? (
                    <EyeOff size={20} className="text-muted-foreground" />
                ) : (
                    <Eye size={20} className="text-muted-foreground" />
                )}
            </Pressable>
        </View>
    );
}