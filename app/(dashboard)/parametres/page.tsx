"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, SVGProps } from "react";
import Link from "next/link";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ImageCropper from "@/components/ui/ImageCropper";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { productCategories, shop } from "@/lib/mock-data";
import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { phoneSchema } from "@/lib/validation";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

const tabs = [
  { key: "boutique", label: "Boutique" },
  { key: "paiements", label: "Paiements" },
  { key: "livraison", label: "Livraison" },
  { key: "utilisateurs", label: "Utilisateurs" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const boutiqueSchema = z.object({
  name: z.string().min(2, "Le nom de la boutique est requis"),
  whatsapp: phoneSchema,
  category: z.string().min(1, "Choisissez une catégorie"),
  city: z.string().min(2, "La ville est requise"),
  quartier: z.string().min(2, "Le quartier est requis"),
});

type BoutiqueValues = z.infer<typeof boutiqueSchema>;
type BoutiqueErrors = Partial<Record<keyof BoutiqueValues, string>>;

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("boutique");
  const [values, setValues] = useState<BoutiqueValues>({
    name: shop.name,
    whatsapp: shop.whatsapp,
    category: shop.category,
    city: shop.city,
    quartier: shop.quartier,
  });
  const [description, setDescription] = useState(shop.tagline);
  const [email, setEmail] = useState(shop.email);
  const [address, setAddress] = useState(shop.address);
  const [errors, setErrors] = useState<BoutiqueErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [pendingLogoFile, setPendingLogoFile] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  function handleLogoSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setLogoError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setLogoError("Format non supporté. Utilisez JPG, PNG ou WEBP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setLogoError("Fichier trop volumineux (5 Mo maximum).");
      return;
    }

    setPendingLogoFile(URL.createObjectURL(file));
  }

  function cancelLogoCrop() {
    if (pendingLogoFile) URL.revokeObjectURL(pendingLogoFile);
    setPendingLogoFile(null);
  }

  async function handleLogoCropped(blob: Blob) {
    setIsUploadingLogo(true);
    setLogoError(null);

    const result = await uploadImage(blob);

    if (pendingLogoFile) URL.revokeObjectURL(pendingLogoFile);
    setPendingLogoFile(null);
    setIsUploadingLogo(false);

    if (!result.success || !result.url) {
      setLogoError(result.error ?? "Échec de l'envoi de l'image.");
      return;
    }

    setLogoUrl(result.url);
  }

  function handleChange(field: keyof BoutiqueValues) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = boutiqueSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: BoutiqueErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof BoutiqueValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <Link
          href="/parametres/apparence"
          className="text-sm font-medium text-primary hover:underline"
        >
          Personnaliser l&apos;apparence →
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== "boutique" && (
        <Card className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-gray-500">Bientôt disponible</p>
        </Card>
      )}

      {activeTab === "boutique" && (
        <Card className="max-w-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="logo-input"
                className={cn(
                  "flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-primary hover:text-primary",
                  isUploadingLogo && "pointer-events-none opacity-50"
                )}
              >
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="Logo de la boutique"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <CameraIcon className="h-6 w-6" />
                )}
              </label>
              <input
                id="logo-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoSelect}
                disabled={isUploadingLogo}
                className="hidden"
              />
              <span className="text-xs text-gray-500">
                {isUploadingLogo
                  ? "Envoi en cours..."
                  : "Logo de la boutique (optionnel)"}
              </span>
              {logoError && (
                <span className="text-xs text-red-600">{logoError}</span>
              )}
            </div>

            {pendingLogoFile && (
              <ImageCropper
                imageSrc={pendingLogoFile}
                aspect={1}
                cropShape="round"
                onCancel={cancelLogoCrop}
                onCropped={handleLogoCropped}
              />
            )}

            <Input
              id="name"
              label="Nom de la boutique"
              value={values.name}
              onChange={handleChange("name")}
              error={errors.name}
            />
            <Textarea
              id="description"
              label="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="whatsapp"
                label="WhatsApp"
                type="tel"
                value={values.whatsapp}
                onChange={handleChange("whatsapp")}
                error={errors.whatsapp}
              />
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Select
              id="category"
              label="Catégorie"
              value={values.category}
              onChange={handleChange("category")}
              error={errors.category}
            >
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="city"
                label="Ville"
                value={values.city}
                onChange={handleChange("city")}
                error={errors.city}
              />
              <Input
                id="quartier"
                label="Quartier"
                value={values.quartier}
                onChange={handleChange("quartier")}
                error={errors.quartier}
              />
            </div>
            <Input
              id="address"
              label="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {submitted && (
              <p className="rounded-xl bg-accent/10 px-3 py-2 text-sm text-green-700">
                Modifications enregistrées localement — la sauvegarde réelle
                arrivera avec Prisma.
              </p>
            )}

            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Enregistrer les modifications
            </Button>
          </form>
        </Card>
      )}
    </main>
  );
}

function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h4l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
