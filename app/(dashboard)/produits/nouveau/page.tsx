"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, SVGProps } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ColorSwatchPicker from "@/components/ui/ColorSwatchPicker";
import ImageCropper from "@/components/ui/ImageCropper";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import { colorPalette } from "@/lib/mock-data";
import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { creerProduit, listerCategories } from "../actions";
import type { Categorie } from "@/lib/generated/prisma/client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

const sizeOptions = ["S", "M", "L", "XL"];

const produitSchema = z.object({
  nom: z.string().min(2, "Le nom du produit est requis"),
  categorieId: z.string().min(1, "Choisissez une catégorie"),
  prix: z.string().min(1, "Le prix est requis"),
  stock: z.string().min(1, "Le stock est requis"),
});

type ProduitValues = z.infer<typeof produitSchema>;
type ProduitErrors = Partial<Record<keyof ProduitValues, string>>;

const initialValues: ProduitValues = {
  nom: "",
  categorieId: "",
  prix: "",
  stock: "",
};

export default function NouveauProduitPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [values, setValues] = useState<ProduitValues>(initialValues);
  const [errors, setErrors] = useState<ProduitErrors>({});
  const [ancienPrix, setAncienPrix] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [pendingFile, setPendingFile] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isPromotion, setIsPromotion] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    listerCategories().then(setCategories);
  }, []);

  function handleChange(field: keyof ProduitValues) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPhotoError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError("Format non supporté. Utilisez JPG, PNG ou WEBP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setPhotoError("Fichier trop volumineux (5 Mo maximum).");
      return;
    }

    setPendingFile(URL.createObjectURL(file));
  }

  function cancelCrop() {
    if (pendingFile) URL.revokeObjectURL(pendingFile);
    setPendingFile(null);
  }

  async function handleCropped(blob: Blob) {
    setIsUploadingPhoto(true);
    setPhotoError(null);

    const result = await uploadImage(blob);

    if (pendingFile) URL.revokeObjectURL(pendingFile);
    setPendingFile(null);
    setIsUploadingPhoto(false);

    if (!result.success || !result.url) {
      setPhotoError(result.error ?? "Échec de l'envoi de l'image.");
      return;
    }

    setImages((prev) => [...prev, result.url as string]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleColor(name: string) {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = produitSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: ProduitErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ProduitValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setServerError(null);
      return;
    }
    setErrors({});
    setServerError(null);
    setIsSubmitting(true);

    const registration = await creerProduit({
      nom: result.data.nom,
      categorieId: result.data.categorieId,
      prix: Number(result.data.prix),
      stock: Number(result.data.stock),
      prixBarre: isPromotion && ancienPrix ? Number(ancienPrix) : null,
      enPromotion: isPromotion,
      couleurs: selectedColors,
      tailles: selectedSizes,
      description: description || undefined,
      images,
    });

    if (!registration.success || !registration.data) {
      setServerError(
        registration.error ?? "Une erreur est survenue lors de l'enregistrement."
      );
      setIsSubmitting(false);
      return;
    }

    router.push(`/produits/${registration.data.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 px-6 py-8 lg:px-10"
    >
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Ajouter un produit
        </h1>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {serverError && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {serverError}
        </p>
      )}

      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Photos</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square overflow-hidden rounded-xl border border-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label="Supprimer la photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <label
              htmlFor="photo-input"
              className={cn(
                "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary",
                isUploadingPhoto && "pointer-events-none opacity-50"
              )}
            >
              <CameraIcon className="h-5 w-5" />
              <span className="text-xs font-medium">
                {isUploadingPhoto ? "Envoi..." : "Ajouter"}
              </span>
            </label>
          )}
        </div>
        <input
          id="photo-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={isUploadingPhoto}
          className="hidden"
        />
        <p className="text-xs text-gray-500">{images.length}/10 photos</p>
        {photoError && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {photoError}
          </p>
        )}
      </Card>

      {pendingFile && (
        <ImageCropper
          imageSrc={pendingFile}
          aspect={4 / 5}
          onCancel={cancelCrop}
          onCropped={handleCropped}
        />
      )}

      <Card className="flex flex-col gap-5">
        <Input
          id="nom"
          label="Nom du produit"
          placeholder="Ex: Robe wax imprimée"
          value={values.nom}
          onChange={handleChange("nom")}
          error={errors.nom}
        />

        <Select
          id="categorieId"
          label="Catégorie"
          value={values.categorieId}
          onChange={handleChange("categorieId")}
          error={errors.categorieId}
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nom}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="prix"
            label="Prix"
            type="number"
            inputMode="numeric"
            placeholder="15000"
            rightSlot={<span className="text-xs text-gray-400">FCFA</span>}
            value={values.prix}
            onChange={handleChange("prix")}
            error={errors.prix}
          />
          <Input
            id="stock"
            label="Stock"
            type="number"
            inputMode="numeric"
            placeholder="10"
            value={values.stock}
            onChange={handleChange("stock")}
            error={errors.stock}
          />
        </div>

        <Toggle
          checked={isPromotion}
          onChange={setIsPromotion}
          label="En promotion"
        />

        {isPromotion && (
          <Input
            id="ancienPrix"
            label="Ancien prix"
            type="number"
            inputMode="numeric"
            placeholder="20000"
            rightSlot={<span className="text-xs text-gray-400">FCFA</span>}
            value={ancienPrix}
            onChange={(e) => setAncienPrix(e.target.value)}
          />
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Couleurs</span>
          <ColorSwatchPicker
            options={colorPalette}
            selected={selectedColors}
            onToggle={toggleColor}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Tailles</span>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => {
              const selected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          id="description"
          label="Description"
          placeholder="Décrivez votre produit..."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Card>
    </form>
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
