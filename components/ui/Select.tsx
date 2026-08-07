import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  error?: string;
}

export default function Select({
  label,
  id,
  error,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          "w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2",
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
            : "border-gray-200 focus:border-primary focus:ring-primary/30",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
