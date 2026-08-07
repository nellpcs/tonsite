import type { ButtonHTMLAttributes, ReactNode, SVGProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "whatsapp" | "outline" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp/90",
  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary/5",
  ghost: "text-primary bg-transparent hover:bg-primary/10",
  danger: "border border-red-200 text-red-600 bg-transparent hover:bg-red-50",
};

export default function Button({
  variant = "primary",
  className,
  children,
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    className
  );
  const content = (
    <>
      {variant === "whatsapp" && <WhatsAppIcon className="h-4 w-4" />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.347-.397.52-.595.174-.199.232-.348.348-.58.116-.232.058-.435-.03-.635-.075-.174-.688-1.653-.94-2.264-.24-.58-.485-.502-.66-.51h-.567c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.48s1.065 2.876 1.213 3.075c.149.198 2.052 3.13 4.972 4.263 2.921 1.132 2.921.756 3.448.71.528-.05 1.758-.72 2.005-1.414.248-.694.248-1.29.174-1.414-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.973.566 3.815 1.545 5.386L2 22l4.735-1.514a9.94 9.94 0 0 0 5.269 1.518h.004c5.518 0 10.004-4.486 10.004-10.004C22.012 6.486 17.526 2 12.004 2zm.001 18.164h-.003a8.14 8.14 0 0 1-4.147-1.137l-.297-.177-3.13.999.999-3.05-.194-.313a8.13 8.13 0 0 1-1.257-4.478c0-4.497 3.665-8.161 8.164-8.161 2.18 0 4.229.851 5.77 2.393a8.106 8.106 0 0 1 2.392 5.775c-.001 4.498-3.666 8.148-8.297 8.148z" />
    </svg>
  );
}
