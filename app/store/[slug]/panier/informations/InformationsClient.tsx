"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Stepper from "@/components/ui/Stepper";
import Textarea from "@/components/ui/Textarea";
import { useCart } from "@/lib/cart-context";
import { deliveryMethods } from "@/lib/mock-data";
import { phoneSchema } from "@/lib/validation";
import { confirmerCommande } from "../actions";

const informationsSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est requis"),
  phone: phoneSchema,
  city: z.string().min(2, "La ville est requise"),
  quartier: z.string().min(2, "Le quartier est requis"),
  deliveryMethod: z.string().min(1, "Choisissez un mode de livraison"),
});

type InformationsValues = z.infer<typeof informationsSchema>;
type InformationsErrors = Partial<Record<keyof InformationsValues, string>>;

export default function InformationsClient({
  boutiqueId,
  slug,
}: {
  boutiqueId: string;
  slug: string;
}) {
  const router = useRouter();
  const { items, comment, setComment, customerInfo, setCustomerInfo } =
    useCart();

  const [values, setValues] = useState<InformationsValues>({
    fullName: customerInfo?.fullName ?? "",
    phone: customerInfo?.phone ?? "",
    city: customerInfo?.city ?? "",
    quartier: customerInfo?.quartier ?? "",
    deliveryMethod: customerInfo?.deliveryMethod ?? "",
  });
  const [errors, setErrors] = useState<InformationsErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-gray-500">Votre panier est vide.</p>
        <Link
          href={`/store/${slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Retour au catalogue
        </Link>
      </main>
    );
  }

  function handleChange(field: keyof InformationsValues) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = informationsSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: InformationsErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof InformationsValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setServerError(null);
      return;
    }
    setErrors({});
    setServerError(null);
    setIsSubmitting(true);

    const panier = items.map((item) => ({
      produitId: item.product.id,
      quantite: item.quantity,
      couleur: item.color,
      taille: item.size,
    }));

    const confirmation = await confirmerCommande(boutiqueId, panier, {
      nom: result.data.fullName,
      telephone: result.data.phone,
      ville: result.data.city,
      quartier: result.data.quartier,
      modeLivraison: result.data.deliveryMethod,
      commentaire: comment || undefined,
    });

    if (!confirmation.success || !confirmation.data) {
      setServerError(
        confirmation.error ??
          "Une erreur est survenue lors de la création de la commande."
      );
      setIsSubmitting(false);
      return;
    }

    setCustomerInfo(result.data);
    router.push(
      `/store/${slug}/panier/confirmation?commandeId=${confirmation.data.id}`
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-8 bg-gray-50 px-4 py-8">
      <Stepper currentStep={2} />

      <Card className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">
          Informations de livraison
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Étape 2 sur 3 — vos coordonnées
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <Input
            id="fullName"
            label="Nom complet"
            placeholder="Ex: Awa Ngo Bell"
            value={values.fullName}
            onChange={handleChange("fullName")}
            error={errors.fullName}
          />
          <Input
            id="phone"
            label="Téléphone WhatsApp"
            type="tel"
            placeholder="+237 6XX XX XX XX"
            value={values.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="city"
              label="Ville"
              placeholder="Douala"
              value={values.city}
              onChange={handleChange("city")}
              error={errors.city}
            />
            <Input
              id="quartier"
              label="Quartier"
              placeholder="Bonapriso"
              value={values.quartier}
              onChange={handleChange("quartier")}
              error={errors.quartier}
            />
          </div>
          <Select
            id="deliveryMethod"
            label="Mode de livraison"
            value={values.deliveryMethod}
            onChange={handleChange("deliveryMethod")}
            error={errors.deliveryMethod}
          >
            <option value="">Choisir un mode de livraison</option>
            {deliveryMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </Select>
          <Textarea
            id="comment"
            label="Commentaire optionnel"
            placeholder="Ex: Merci de livrer après 18h"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {serverError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Validation..." : "Continuer"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
