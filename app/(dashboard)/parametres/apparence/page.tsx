"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { shop } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const themePresets = [
  {
    name: "Violet & Rose",
    primary: "#8C63FF",
    secondary: "#FF6584",
    accent: "#00D084",
  },
  {
    name: "Océan",
    primary: "#2563EB",
    secondary: "#0EA5E9",
    accent: "#14B8A6",
  },
  {
    name: "Coucher de soleil",
    primary: "#F97316",
    secondary: "#EF4444",
    accent: "#FACC15",
  },
  {
    name: "Nature",
    primary: "#16A34A",
    secondary: "#84CC16",
    accent: "#0D9488",
  },
];

export default function ApparencePage() {
  const [primaryColor, setPrimaryColor] = useState(themePresets[0].primary);
  const [secondaryColor, setSecondaryColor] = useState(
    themePresets[0].secondary
  );
  const [accentColor, setAccentColor] = useState(themePresets[0].accent);
  const [saved, setSaved] = useState(false);

  const activeThemeName = themePresets.find(
    (theme) =>
      theme.primary === primaryColor &&
      theme.secondary === secondaryColor &&
      theme.accent === accentColor
  )?.name;

  function applyTheme(theme: (typeof themePresets)[number]) {
    setPrimaryColor(theme.primary);
    setSecondaryColor(theme.secondary);
    setAccentColor(theme.accent);
    setSaved(false);
  }

  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <div>
        <Link
          href="/parametres"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Retour aux paramètres
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Apparence boutique
        </h1>
      </div>

      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Thème</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {themePresets.map((theme) => (
            <button
              key={theme.name}
              type="button"
              onClick={() => applyTheme(theme)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-3 transition-shadow",
                activeThemeName === theme.name
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-gray-100 hover:border-gray-200"
              )}
            >
              <div className="flex h-10 w-full overflow-hidden rounded-lg">
                <span
                  className="flex-1"
                  style={{ backgroundColor: theme.primary }}
                />
                <span
                  className="flex-1"
                  style={{ backgroundColor: theme.secondary }}
                />
                <span
                  className="flex-1"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Couleurs</h2>
        <div className="flex flex-col gap-3">
          <ColorPickerField
            label="Couleur principale"
            value={primaryColor}
            onChange={(hex) => {
              setPrimaryColor(hex);
              setSaved(false);
            }}
          />
          <ColorPickerField
            label="Couleur secondaire"
            value={secondaryColor}
            onChange={(hex) => {
              setSecondaryColor(hex);
              setSaved(false);
            }}
          />
          <ColorPickerField
            label="Couleur accent"
            value={accentColor}
            onChange={(hex) => {
              setAccentColor(hex);
              setSaved(false);
            }}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Aperçu</h2>
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {shop.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">{shop.name}</p>
                <p className="text-xs text-gray-500">{shop.tagline}</p>
              </div>
            </div>
            <span className="rounded-xl bg-whatsapp px-4 py-2 text-sm font-medium text-white">
              Contacter
            </span>
          </div>
          <div className="flex items-center gap-2 px-1">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: secondaryColor }}
            >
              -20%
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
            >
              En stock
            </span>
          </div>
        </div>
      </Card>

      {saved && (
        <p className="rounded-xl bg-accent/10 px-3 py-2 text-sm text-green-700">
          Apparence enregistrée localement — la sauvegarde réelle arrivera
          avec Prisma.
        </p>
      )}

      <Button
        variant="primary"
        className="w-full sm:w-auto"
        onClick={() => setSaved(true)}
      >
        Enregistrer
      </Button>
    </main>
  );
}

function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-3">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs uppercase text-gray-400">{value}</p>
      </div>
      <label className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-200">
        <input
          type="color"
          value={value}
          onChange={handleChange}
          aria-label={label}
          className="absolute -left-1 -top-1 h-12 w-12 cursor-pointer border-none p-0"
        />
      </label>
    </div>
  );
}
