import type { CSSProperties, SVGProps } from "react";
import { cn } from "@/lib/utils";

export interface ColorOption {
  name: string;
  hex: string;
}

interface ColorSwatchPickerProps {
  options: ColorOption[];
  selected: string[];
  onToggle: (name: string) => void;
  className?: string;
  /**
   * Couleur de l'anneau de sélection (hex). Par défaut, utilise le violet
   * de la charte (ring-primary). À fournir quand la page doit refléter une
   * couleur de thème dynamique (ex: boutique.themePrimary).
   */
  ringColor?: string;
}

export default function ColorSwatchPicker({
  options,
  selected,
  onToggle,
  className,
  ringColor,
}: ColorSwatchPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {options.map((color) => {
        const isSelected = selected.includes(color.name);
        return (
          <button
            key={color.name}
            type="button"
            onClick={() => onToggle(color.name)}
            aria-label={color.name}
            aria-pressed={isSelected}
            className={cn(
              "relative h-9 w-9 rounded-full border border-gray-200 transition-shadow",
              isSelected && (ringColor ? "ring-2 ring-offset-2" : "ring-2 ring-primary ring-offset-2")
            )}
            style={{
              backgroundColor: color.hex,
              ...(isSelected && ringColor
                ? ({ "--tw-ring-color": ringColor } as CSSProperties)
                : {}),
            }}
          >
            {isSelected && (
              <CheckIcon
                className={cn(
                  "absolute inset-0 m-auto h-4 w-4",
                  isLightColor(color.hex) ? "text-gray-900" : "text-white"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function isLightColor(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
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
