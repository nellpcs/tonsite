"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";

const connexionSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  motDePasse: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type ConnexionValues = z.infer<typeof connexionSchema>;
type ConnexionErrors = Partial<Record<keyof ConnexionValues, string>>;

const initialValues: ConnexionValues = {
  email: "",
  motDePasse: "",
};

export default function ConnexionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<ConnexionValues>(initialValues);
  const [errors, setErrors] = useState<ConnexionErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof ConnexionValues) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = connexionSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: ConnexionErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ConnexionValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setServerError(null);
      return;
    }
    setErrors({});
    setServerError(null);
    setIsSubmitting(true);

    const signInResult = await signIn("credentials", {
      email: result.data.email,
      password: result.data.motDePasse,
      redirect: false,
    });

    if (signInResult?.error) {
      setServerError("Email ou mot de passe incorrect.");
      setIsSubmitting(false);
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") || "/tableau-de-bord";
    router.push(callbackUrl);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue !</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connectez-vous à votre compte
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
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
              id="motDePasse"
              label="Mot de passe"
              placeholder="••••••••"
              value={values.motDePasse}
              onChange={handleChange("motDePasse")}
              error={errors.motDePasse}
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
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>

            {/*
              TODO: bouton "Continuer avec WhatsApp" retiré pour l'instant.
              On n'a pas encore de flux d'authentification WhatsApp réel
              (OTP ou OAuth côté Meta) — mieux vaut ne pas laisser un bouton
              qui ne fait rien plutôt que de simuler un faux succès.
            */}
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="font-medium text-primary hover:underline"
          >
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}
