import { ComponentProps, ComponentRef, forwardRef } from "react";
import { Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const buttonVariants = tv({
  base: "flex-row items-center justify-center gap-2 rounded-md",
  variants: {
    variant: {
      default: "bg-primary text-white",
      destructive: "bg-system-red text-white",
      outline: "border border-neutral-soft-grey-1 bg-transparent text-neutral-dark-1",
      secondary: "bg-neutral-soft-grey-2 text-neutral-dark-1",
      ghost: "bg-transparent text-neutral-dark-1",
      link: "bg-transparent text-primary underline",
    },
    size: {
      default: "h-12 px-5",
      sm: "h-10 px-4",
      lg: "h-14 px-6",
      icon: "h-12 w-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = {
  className?: string;
  variant?: keyof typeof buttonVariants["variants"]["variant"];
  size?: keyof typeof buttonVariants["variants"]["size"];
} & ComponentProps<typeof Pressable>;

const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, disabled, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={twMerge(
          buttonVariants({ variant, size }),
          disabled ? "opacity-50" : "",
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, ButtonProps, buttonVariants };

