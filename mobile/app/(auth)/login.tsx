import CustomSafeArea from "@/components/ui/CustomSafeAreaView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";
import CustomSelect from "@/components/ui/Picker";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from "react-native";
import { z } from 'zod';
import { useLoginMutation } from "@/hooks/auth.hook";

const LoginSchema = z.object({
    role: z.enum(['RESORT_STAFF', 'KITCHEN_STAFF'], { message: "role must be Resort Staff or Kitchen Staff" }),
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
            
            // toast.error(error.message || "Unexpected Error!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <CustomSafeArea>
            <View className="flex-1 flex justify-center p-4 gap-8">
                
                {/* John Miko's Logo */}
                <View className="w-30 h-30 rounded-full bg-primary self-center" />

                <View className="space-y-4">
                    {/* Select role */}
                    <CustomSelect 
                    options={[
                        { label: "Resort Staff", value: "RESORT_STAFF" },
                        { label: "Kitchen Staff", value: "KITCHEN_STAFF" }
                    ]}
                    />

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
                    <Text className="text-white font-semibold">Login</Text>
                </Button>

            </View>
        </CustomSafeArea>
    )
}
