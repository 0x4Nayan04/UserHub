import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-2 shadow-sm hover:shadow-md active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/70 hover:shadow-lg dark:shadow-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 hover:border-destructive/70 hover:shadow-lg dark:shadow-destructive/20",
        outline:
          "border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/30 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:bg-accent/80 hover:shadow-lg",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80 hover:border-secondary/70 hover:shadow-lg dark:shadow-secondary/20",
        ghost: "border-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent/20 dark:hover:bg-accent/80 hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
