import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export default function Input({
  label,
  id,
  error,
  leftSlot,
  rightSlot,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftSlot && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {leftSlot}
          </div>
        )}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-200"
              : "border-gray-200 focus:border-primary focus:ring-primary/30",
            Boolean(leftSlot) && "pl-10",
            Boolean(rightSlot) && "pr-10",
            className
          )}
          {...props}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
