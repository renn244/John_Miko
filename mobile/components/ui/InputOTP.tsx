import { ComponentProps, ComponentRef, forwardRef, useState } from "react";
import { TextInput, View } from "react-native";
import { tv } from "tailwind-variants";

const input = tv({
    base: "w-full bg-[#F5F6F7] text-center p-2 font-sans-semibold",
    variants: {
        color: {
            default: "",
            destructive: "border-2 border-red-500",
        },
        size: {
            default: "h-12 w-10 text-xl rounded-lg",
        },
        focused: {
            true: "border-2 border-system-blue bg-white",
            false: "border-2 border-neutral-soft-grey-1",
        }
    },
    defaultVariants: {
        color: "default",
        size: "default",
    }
})

const ring = tv({
    variants: {
        size: {
            default: "rounded-[10px]",
        },
        focused: {
            true: "border-2 border-system-blue/30",
            false: "border-2 border-transparent",
        }
    },
    defaultVariants: {
        size: "default",
        focused: false,
    }
})

type InputProps = {
    className?: string;
    variant?: keyof typeof input.variants.color;
    size?: keyof typeof input.variants.size;
}

const InputOTP = forwardRef<
    ComponentRef<typeof TextInput>,
    InputProps & ComponentProps<typeof TextInput>
>(({ className, variant, size, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
        <View className={ring({ size, focused })}>
            <TextInput
                ref={ref}
                className={input({ color: variant, size, focused, className })}
                onFocus={(e) => {
                    setFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setFocused(false);
                    props.onBlur?.(e);
                }}
                placeholderTextColor="#9CA3AF"
                {...props}
            />
        </View>
    );
});
InputOTP.displayName = "InputOTP";

export { InputOTP };
