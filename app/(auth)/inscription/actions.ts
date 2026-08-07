"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

interface InscriptionInput {
  nomComplet: string;
  nomBoutique: string;
  whatsapp: string;
  ville: string;
  quartier: string;
  email: string;
  password: string;
}

interface InscriptionResult {
  success: boolean;
  error?: string;
}

const DIACRITICS_REGEX = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(nomBoutique: string) {
  const base = slugify(nomBoutique) || "boutique";
  let slug = base;
  let attempt = 0;

  while (await prisma.boutique.findUnique({ where: { slug } })) {
    attempt += 1;
    const suffix = Math.random().toString(36).slice(2, 6);
    slug = attempt > 10 ? `${base}-${Date.now()}` : `${base}-${suffix}`;
    if (attempt > 10) break;
  }

  return slug;
}

const CATEGORIES_PAR_DEFAUT = [
  "Robes",
  "Sacs",
  "Chaussures",
  "Chemises",
  "Pantalons",
  "Accessoires",
];

export async function inscrireVendeur(
  input: InscriptionInput
): Promise<InscriptionResult> {
  const existing = await prisma.vendeur.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    return { success: false, error: "Un compte existe déjà avec cet email." };
  }

  const slug = await generateUniqueSlug(input.nomBoutique);
  const motDePasseHash = await bcrypt.hash(input.password, 10);

  try {
    await prisma.$transaction(async (tx) => {
      const boutique = await tx.boutique.create({
        data: {
          slug,
          nom: input.nomBoutique,
          whatsapp: input.whatsapp,
          ville: input.ville,
          quartier: input.quartier,
        },
      });

      await tx.vendeur.create({
        data: {
          email: input.email,
          motDePasseHash,
          nom: input.nomComplet,
          boutiqueId: boutique.id,
        },
      });

      await tx.categorie.createMany({
        data: CATEGORIES_PAR_DEFAUT.map((nom) => ({
          nom,
          boutiqueId: boutique.id,
        })),
      });
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Un compte existe déjà avec cet email.",
      };
    }
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de votre boutique.",
    };
  }

  return { success: true };
}
