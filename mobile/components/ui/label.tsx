import { ComponentProps, ComponentRef, forwardRef } from "react";
import { Text } from "react-native";
import { tv } from "tailwind-variants";

const label = tv({
    base: "font-sans-semibold font-semibold",
    variants: {
        color: {
            default: "text-neutral-grey-1",
            destructive: "text-red-500",
        },
        size: {
            default: "text-xl leading-5",
            medium: "text-lg leading-4",
            small: "text-base leading-4",
        },
    },
    defaultVariants: {
        color: "default",
        size: "default",
    }
})

type LabelProps = {
    className?: string;
    variant?: keyof typeof label.variants.color;
    size?: keyof typeof label.variants.size;
};

const Label = forwardRef<
    ComponentRef<typeof Text>,
    LabelProps & ComponentProps<typeof Text>
>(({ className, variant, size, ...props }, ref) => {
    
    return (
        <Text 
        ref={ref}
        className={label({ color: variant, size, className })}
        {...props}
        />
    )
})
Label.displayName = "Label";

export { Label, label, LabelProps };
