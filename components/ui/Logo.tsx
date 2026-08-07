import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="inline-flex rounded-lg bg-primary/10 p-1.5 text-primary">
        <LogoIcon className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold text-gray-900">Tonsite</span>
    </div>
  );
}

function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  );
}
