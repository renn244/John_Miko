import CustomSafeArea from "@/components/common/CustomSafeArea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { useLoginMutation } from "@/hooks/auth.hook";
import { handleNestError, ValidationError } from "@/utils/handleNestError";
import { zodResolver } from "@hookform/resolvers/zod/dist/index.js";
import { useRouter } from "expo-router";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from "react-native";
import { toast } from "sonner-native";
import { z } from 'zod';

const LoginSchema = z.object({
    role: z.enum(['RESORT_STAFF, KITCHEN_STAFF'], { message: "role must be Resort Staff  or Kitchen Staff" }),
    email: z.email().nonempty({ message: 'email is required!' }),
    password: z.string().nonempty({ message: 'password is required' })
})

export type loginSchema = z.infer<typeof LoginSchema>

export default function Login() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { 
        control,
        handleSubmit,
        setError,
    } = useForm<loginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
        criteriaMode: "all"
    })

    const { mutateAsync } = useLoginMutation()
    const router = useRouter();

    const onSubmit = async (data: loginSchema) => {
        setIsLoading(true)
        try {
            await mutateAsync(data);

            // redirect to proper dashboard if user is resort staff, kitchen staff, external maintenance
            router.push('/')
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError)
            }
            
            toast.error(error.message || "Unexpected Error!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <CustomSafeArea>
            <View className="flex-1 items-center justify-center">
                
                {/* John Miko's Logo */}

                <View className="space-y-4">

                    {/* Select role */}
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                <SelectItem label="Kitchen Staff" value="KITCHEN_STAFF">Kitchen Staff</SelectItem>
                                <SelectItem label="Resort Staff" value="RESORT_STAFF">Resort Staff</SelectItem>
                                <SelectItem label="Maintenance" value="MAINTENANCE">Maintenance Staff</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* email input */}
                    <Input 
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoComplete="email"
                    placeholder="Email"
                    />

                    {/* password input */}
                    <PasswordInput
                    textContentType="password" 
                    autoComplete="password"
                    placeholder="Password"
                    />

                </View>

                <Button className="w-full">
                    <Text>Login</Text>
                </Button>

            </View>
        </CustomSafeArea>
    )
}