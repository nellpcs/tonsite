import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "discount" | "success" | "neutral" | "primary" | "accent";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  discount: "bg-secondary text-white",
  success: "bg-accent/10 text-green-700",
  neutral: "bg-gray-100 text-gray-700",
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-green-700",
};

export default function Badge({
  variant = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
