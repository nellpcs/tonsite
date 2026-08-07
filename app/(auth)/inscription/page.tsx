"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, SVGProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Stepper from "@/components/ui/Stepper";
import { inscrireVendeur } from "./actions";
import { phoneSchema } from "@/lib/validation";

const inscriptionSchema = z.object({
  nomComplet: z.string().min(2, "Le nom complet est requis"),
  nomBoutique: z.string().min(2, "Le nom de la boutique est requis"),
  whatsapp: phoneSchema,
  ville: z.string().min(2, "La ville est requise"),
  quartier: z.string().min(2, "Le quartier est requis"),
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type InscriptionValues = z.infer<typeof inscriptionSchema>;
type InscriptionErrors = Partial<Record<keyof InscriptionValues, string>>;

const initialValues: InscriptionValues = {
  nomComplet: "",
  nomBoutique: "",
  whatsapp: "",
  ville: "",
  quartier: "",
  email: "",
  password: "",
};

export default function InscriptionPage() {
  const router = useRouter();
  const [values, setValues] = useState<InscriptionValues>(initialValues);
  const [errors, setErrors] = useState<InscriptionErrors>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  function handleChange(field: keyof InscriptionValues) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = inscriptionSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: InscriptionErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof InscriptionValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setServerError(null);
      return;
    }
    setErrors({});
    setServerError(null);
    setIsSubmitting(true);

    const registration = await inscrireVendeur(result.data);

    if (!registration.success) {
      setServerError(
        registration.error ??
          "Une erreur est survenue lors de la création de votre boutique."
      );
      setIsSubmitting(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      setServerError(
        "Votre boutique a été créée, mais la connexion automatique a échoué. Essayez de vous connecter."
      );
      setIsSubmitting(false);
      return;
    }

    router.push("/tableau-de-bord");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md">
        <Stepper currentStep={1} />

        <Card className="mt-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Créer votre boutique
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Étape 1 sur 3 — vos informations
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="logo"
                className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-primary hover:text-primary"
              >
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview}
                    alt="Logo de la boutique"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <CameraIcon className="h-6 w-6" />
                )}
              </label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <span className="text-xs text-gray-500">
                Logo de la boutique (optionnel)
              </span>
            </div>

            <Input
              id="nomComplet"
              label="Nom complet"
              placeholder="Ex: Awa Ngo Bell"
              value={values.nomComplet}
              onChange={handleChange("nomComplet")}
              error={errors.nomComplet}
            />
            <Input
              id="nomBoutique"
              label="Nom de la boutique"
              placeholder="Ex: Awa Fashion Shop"
              value={values.nomBoutique}
              onChange={handleChange("nomBoutique")}
              error={errors.nomBoutique}
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="vous@exemple.com"
              value={values.email}
              onChange={handleChange("email")}
              error={errors.email}
            />
            <PasswordInput
              id="password"
              label="Mot de passe"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange("password")}
              error={errors.password}
            />
            <Input
              id="whatsapp"
              label="Numéro WhatsApp"
              type="tel"
              placeholder="+237 6XX XX XX XX"
              value={values.whatsapp}
              onChange={handleChange("whatsapp")}
              error={errors.whatsapp}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="ville"
                label="Ville"
                placeholder="Douala"
                value={values.ville}
                onChange={handleChange("ville")}
                error={errors.ville}
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
              {isSubmitting ? "Création en cours..." : "Continuer"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-medium text-primary hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
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
