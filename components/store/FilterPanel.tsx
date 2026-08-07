"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import Button from "@/components/ui/Button";
import ColorSwatchPicker from "@/components/ui/ColorSwatchPicker";
import Toggle from "@/components/ui/Toggle";
import { colorPalette } from "@/lib/mock-data";
import { formatFcfa } from "@/lib/utils";

const categoryOptions = [
  "Mode & Vêtements",
  "Chaussures",
  "Bijoux & Accessoires",
  "Électronique",
  "Beauté & Cosmétiques",
  "Maison & Déco",
];

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  resultsCount?: number;
}

export default function FilterPanel({
  open,
  onClose,
  resultsCount = 24,
}: FilterPanelProps) {
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [promoOnly, setPromoOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  if (!open) return null;

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  function toggleColor(name: string) {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  function resetFilters() {
    setMaxPrice(50000);
    setSelectedCategories([]);
    setPromoOnly(false);
    setNewOnly(false);
    setInStockOnly(false);
    setSelectedColors([]);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-x-0 bottom-0 z-40 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-96 sm:rounded-l-2xl sm:rounded-t-none">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Filtres</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer les filtres"
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Prix maximum
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {formatFcfa(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-gray-700">
              Catégories
            </span>
            <div className="flex flex-col gap-2">
              {categoryOptions.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded border-gray-300 accent-primary"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Toggle
              checked={promoOnly}
              onChange={setPromoOnly}
              label="Promotions uniquement"
            />
            <Toggle
              checked={newOnly}
              onChange={setNewOnly}
              label="Nouveautés uniquement"
            />
            <Toggle
              checked={inStockOnly}
              onChange={setInStockOnly}
              label="En stock uniquement"
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-gray-700">
              Couleurs
            </span>
            <ColorSwatchPicker
              options={colorPalette}
              selected={selectedColors}
              onToggle={toggleColor}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4">
          <Button variant="primary" className="w-full" onClick={onClose}>
            Voir les résultats ({resultsCount})
          </Button>
          <Button variant="ghost" className="w-full" onClick={resetFilters}>
            Réinitialiser
          </Button>
        </div>
      </div>
    </>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
