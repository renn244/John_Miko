import { ComponentProps, ComponentRef, forwardRef } from "react";
import { Text } from "react-native";
import { tv } from "tailwind-variants";

const labelStyles = tv({
  base: "font-sans-semibold",
  variants: {
    variant: {
      default: "text-neutral-dark-1",
      muted: "text-neutral-grey-1",
      destructive: "text-system-red",
    },
    size: {
      default: "text-lg",
      sm: "text-base",
      xs: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type LabelProps = {
  className?: string;
  variant?: keyof typeof labelStyles.variants.variant;
  size?: keyof typeof labelStyles.variants.size;
} & ComponentProps<typeof Text>;

const Label = forwardRef<ComponentRef<typeof Text>, LabelProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Text ref={ref} className={labelStyles({ variant, size, className })} {...props} />
    );
  }
);
Label.displayName = "Label";

export { Label, LabelProps, labelStyles };
