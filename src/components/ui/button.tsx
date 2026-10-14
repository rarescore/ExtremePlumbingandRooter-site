import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-md font-sans text-[0.72rem] font-semibold tracking-[0.14em] uppercase transition-[transform,background-color,color,border-color] duration-150 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand text-cream hover:bg-brand-dark",
        navy: "bg-navy text-cream hover:bg-navy-mid",
        ghost:
          "border border-cream/40 bg-navy/20 text-cream hover:bg-cream hover:text-navy",
        outline: "border border-navy/15 bg-cream text-navy hover:border-navy/40",
        invert: "bg-cream text-navy hover:bg-paper",
      },
      size: {
        default: "min-h-11 px-5",
        lg: "min-h-12 px-6",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
