import { Eye, EyeOff } from "lucide-react-native";
import { ComponentProps, ComponentRef, forwardRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { withUniwind } from "uniwind";
import { Input, InputProps } from "./input";

type PasswordInputProps = {
  containerClassName?: string;
} & InputProps &
  ComponentProps<typeof TextInput>;

const PasswordInput = forwardRef<
  ComponentRef<typeof TextInput>,
  PasswordInputProps
>(({ containerClassName, className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const StyledEye = withUniwind(Eye);
  const StyledEyeOff = withUniwind(EyeOff);

  return (
    <View className={twMerge("relative w-full", className)}>
      <Input
        ref={ref}
        secureTextEntry={!showPassword}
        className={twMerge("pr-10", containerClassName)}
        {...props}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        onPress={() => setShowPassword((prev) => !prev)}
        className="absolute bottom-0 right-3 top-0 justify-center"
        hitSlop={8}
      >
        {showPassword ? (
          <StyledEye className="text-neutral-grey-2" width={20} height={20} />
        ) : (
          <StyledEyeOff className="text-neutral-grey-2" width={20} height={20} />
        )}
      </Pressable>
    </View>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput, PasswordInputProps };

