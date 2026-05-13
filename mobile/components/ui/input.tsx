import { ComponentProps, ComponentRef, forwardRef, useState } from "react";
import { TextInput, View } from "react-native";
import { tv } from "tailwind-variants";

const input = tv({
    base: "w-full bg-[#F5F6F7]",
    variants: {
        color: {
            default: "",
            destructive: "border-2 border-red-500",
        },
        size: {
            default: "w-full h-12 px-4 text-xl rounded-xl",
            medium: "w-full h-10 px-3 text-lg rounded-lg",
            small: "w-full h-8 px-2 text-md rounded-md",
        },
        focused: {
            true: "border-2 border-system-blue bg-white",
            false: "border-2 border-neutral-soft-grey-1",
        },
    },
    defaultVariants: {
        color: "default",
        size: "default",
    }
});

const ring = tv({
    variants: {
        size: {
            default: "rounded-[14px]",
            medium: "rounded-[10px]",
            small: "rounded-[8px]",
        },
        focused: {
            true: "border-2 border-system-blue/30",
            false: "border-2 border-transparent",
        },
    },
    defaultVariants: {
        size: "default",
        focused: false,
    }
});

type InputProps = {
    className?: string;
    variant?: keyof typeof input.variants.color;
    size?: keyof typeof input.variants.size;
};

const Input = forwardRef<
    ComponentRef<typeof TextInput>,
    InputProps & ComponentProps<typeof TextInput>
>(({ className, variant, size, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
        <View className={ring({ focused, size })}>
            <TextInput
            ref={ref}
            className={input({ color: variant, size, focused: focused, className })}
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
Input.displayName = "Input";

export { Input, input, InputProps, ring };

