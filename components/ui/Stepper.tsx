import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

export default function Stepper({
  currentStep,
  totalSteps = 3,
  className,
}: StepperProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {Array.from({ length: totalSteps }, (_, index) => index + 1).map(
        (step) => {
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          return (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  isActive || isDone
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                {isDone ? <CheckIcon className="h-4 w-4" /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={cn(
                    "h-0.5 w-10 rounded",
                    isDone ? "bg-primary" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        }
      )}
    </div>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
