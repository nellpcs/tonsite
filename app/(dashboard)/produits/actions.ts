"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma, StatutProduit } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireBoutiqueId } from "@/lib/session";

const produitSchema = z.object({
  nom: z.string().min(2, "Le nom du produit est requis"),
  description: z.string().optional(),
  categorieId: z.string().optional().nullable(),
  prix: z
    .number()
    .int("Le prix doit être un nombre entier")
    .positive("Le prix doit être positif"),
  prixBarre: z.number().int().positive().optional().nullable(),
  enPromotion: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
  couleurs: z.array(z.string()).optional(),
  tailles: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export type ProduitInput = z.infer<typeof produitSchema>;

interface ActionResult<T = undefined> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function listerProduits(
  filtreStatut?: "TOUS" | "EN_LIGNE" | "HORS_LIGNE"
) {
  const boutiqueId = await requireBoutiqueId();

  return prisma.produit.findMany({
    where: {
      boutiqueId,
      ...(filtreStatut && filtreStatut !== "TOUS"
        ? { statut: filtreStatut }
        : {}),
    },
    include: { categorie: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listerCategories() {
  const boutiqueId = await requireBoutiqueId();

  return prisma.categorie.findMany({
    where: { boutiqueId },
    orderBy: { nom: "asc" },
  });
}

export async function creerProduit(
  data: ProduitInput
): Promise<ActionResult<{ id: string }>> {
  const boutiqueId = await requireBoutiqueId();

  const result = produitSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  const values = result.data;

  if (values.categorieId) {
    const categorie = await prisma.categorie.findFirst({
      where: { id: values.categorieId, boutiqueId },
    });
    if (!categorie) {
      return { success: false, error: "Catégorie invalide." };
    }
  }

  const produit = await prisma.produit.create({
    data: {
      boutiqueId,
      nom: values.nom,
      description: values.description || null,
      categorieId: values.categorieId || null,
      prix: values.prix,
      prixBarre: values.prixBarre || null,
      enPromotion: values.enPromotion ?? false,
      stock: values.stock ?? 0,
      couleurs: values.couleurs ?? [],
      tailles: values.tailles ?? [],
      images: values.images ?? [],
    },
  });

  revalidatePath("/produits");

  return { success: true, data: { id: produit.id } };
}

export async function modifierProduit(
  id: string,
  data: Partial<ProduitInput>
): Promise<ActionResult> {
  const boutiqueId = await requireBoutiqueId();

  const existing = await prisma.produit.findFirst({
    where: { id, boutiqueId },
  });
  if (!existing) {
    return { success: false, error: "Produit introuvable." };
  }

  const result = produitSchema.partial().safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  const values = result.data;

  if (values.categorieId) {
    const categorie = await prisma.categorie.findFirst({
      where: { id: values.categorieId, boutiqueId },
    });
    if (!categorie) {
      return { success: false, error: "Catégorie invalide." };
    }
  }

  await prisma.produit.update({
    where: { id },
    data: values,
  });

  revalidatePath("/produits");
  revalidatePath(`/produits/${id}`);

  return { success: true };
}

export async function toggleStatutProduit(id: string): Promise<ActionResult> {
  const boutiqueId = await requireBoutiqueId();

  const existing = await prisma.produit.findFirst({
    where: { id, boutiqueId },
  });
  if (!existing) {
    return { success: false, error: "Produit introuvable." };
  }

  await prisma.produit.update({
    where: { id },
    data: {
      statut:
        existing.statut === StatutProduit.EN_LIGNE
          ? StatutProduit.HORS_LIGNE
          : StatutProduit.EN_LIGNE,
    },
  });

  revalidatePath("/produits");
  revalidatePath(`/produits/${id}`);

  return { success: true };
}

export async function supprimerProduit(id: string): Promise<ActionResult> {
  const boutiqueId = await requireBoutiqueId();

  const existing = await prisma.produit.findFirst({
    where: { id, boutiqueId },
  });
  if (!existing) {
    return { success: false, error: "Produit introuvable." };
  }

  try {
    await prisma.produit.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2003" || error.code === "P2014")
    ) {
      return {
        success: false,
        error:
          "Ce produit ne peut pas être supprimé car il apparaît dans une ou plusieurs commandes.",
      };
    }
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression.",
    };
  }

  revalidatePath("/produits");

  return { success: true };
}
