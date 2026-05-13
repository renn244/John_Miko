import { ComponentProps, ComponentRef, forwardRef } from "react"
import { Pressable } from "react-native"
import { tv } from "tailwind-variants"

const button = tv({
  base: "flex-row items-center justify-center gap-2",
  variants: {
    color: {
      default: "bg-primary text-white",
      destructive: "bg-system-red text-white",
      outline: "bg-transparent border border-gray-300 text-gray-700",
    },
    size: {
      default: "w-full h-12 px-5 py-3 rounded-xl",
      medium: "w-full h-10 px-5 py-2 rounded-l",
      small: "w-full h-8 px-4 py-2 rounded-[10px]"
    }
  },
  defaultVariants: {
    color: "default",
    size: "default"
  }
})

type ButtonProps = {
  className?: string;
  variant?: keyof typeof button["variants"]["color"];
  size?: keyof typeof button["variants"]["size"];
} & ComponentProps<typeof Pressable>

const Button = forwardRef<
  ComponentRef<typeof Pressable>,
  ButtonProps
>(
  (
    { className, variant, size, ...props },
    ref
  ) => {
    return (
      <Pressable
        ref={ref}
        className={button({ color: variant, size, className })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button"

export { Button, button, ButtonProps }
