import { z } from "zod";

export function normalizePhone(value: string) {
  return value.replace(/[\s().-]/g, "");
}

// Valide un numéro de téléphone en normalisant d'abord sa mise en forme
// (espaces, points, tirets, parenthèses) : la longueur {8,15} porte donc
// sur le nombre de chiffres réels, pas sur la chaîne brute telle que
// saisie (ex: "+237 677 12 34 56" ne doit pas être rejeté à cause de ses
// espaces alors que "+237677123456" est valide).
export const phoneSchema = z
  .string()
  .min(1, "Le numéro de téléphone est requis")
  .transform((value) => normalizePhone(value))
  .refine((value) => /^\+?[0-9]{8,15}$/.test(value), {
    message: "Numéro de téléphone invalide",
  });
