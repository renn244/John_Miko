import { Eye, EyeOff, Lock } from "lucide-react-native";
import { ComponentProps, ComponentRef, forwardRef, useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native/Libraries/Components/TextInput/TextInput";
import { withUniwind } from "uniwind";
import { Input, InputProps } from "./input";

type passwordInputProps = {

} & InputProps & ComponentProps<typeof TextInput>;

const PasswordInput = forwardRef<
    ComponentRef<typeof TextInput>,
    passwordInputProps
>(({ ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const StyledLock = withUniwind(Lock);
    const StyledEye = withUniwind(Eye);
    const StyledEyeOff = withUniwind(EyeOff);

    return (
        <View className='relative w-full'>

            <Input 
            ref={ref}
            id='password'
            style={{ paddingRight: 40 }}
            placeholder='Password'
            secureTextEntry={showPassword === false}
            {...props}
            />

            {
                showPassword 
                ? (
                    <StyledEye 
                    onPress={() => setShowPassword(false)}
                    className="absolute right-4 top-3.5 z-99"
                    width={24} height={24} color="#9BA1A8" 
                    /> 
                )
                : (
                    <StyledEyeOff
                    onPress={() => setShowPassword(true)}
                    className="absolute right-4 top-3.5 z-99"
                    width={24} height={24} color="#9BA1A8" 
                    />
                )
            }
        </View>
    )
})
PasswordInput.displayName = "PasswordInput";

export { PasswordInput, passwordInputProps };
