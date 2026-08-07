"use server";

import { z } from "zod";
import { Prisma, StatutProduit, type Produit } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { DELIVERY_FEE } from "@/lib/mock-data";
import { phoneSchema } from "@/lib/validation";

const ligneSchema = z.object({
  produitId: z.string().min(1),
  quantite: z.number().int().positive(),
  couleur: z.string().nullable().optional(),
  taille: z.string().nullable().optional(),
});

const infosClientSchema = z.object({
  nom: z.string().min(2, "Le nom complet est requis"),
  telephone: phoneSchema,
  ville: z.string().min(2, "La ville est requise"),
  quartier: z.string().min(2, "Le quartier est requis"),
  modeLivraison: z.string().min(1, "Le mode de livraison est requis"),
  commentaire: z.string().optional(),
});

export type PanierItemInput = z.infer<typeof ligneSchema>;
export type InfosClientInput = z.infer<typeof infosClientSchema>;

interface ConfirmerCommandeResult {
  success: boolean;
  error?: string;
  data?: { id: string; numero: string; total: number };
}

async function creerCommandeAvecNumeroUnique(params: {
  boutiqueId: string;
  infos: InfosClientInput;
  panierValide: PanierItemInput[];
  produitsParId: Map<string, Produit>;
  sousTotal: number;
  livraison: number;
  total: number;
}) {
  const {
    boutiqueId,
    infos,
    panierValide,
    produitsParId,
    sousTotal,
    livraison,
    total,
  } = params;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        const client = await tx.client.upsert({
          where: {
            boutiqueId_telephone: {
              boutiqueId,
              telephone: infos.telephone,
            },
          },
          update: {
            nom: infos.nom,
            ville: infos.ville,
            quartier: infos.quartier,
          },
          create: {
            boutiqueId,
            telephone: infos.telephone,
            nom: infos.nom,
            ville: infos.ville,
            quartier: infos.quartier,
          },
        });

        const year = new Date().getFullYear();
        const prefix = `CMD-${year}-`;
        const count = await tx.commande.count({
          where: { numero: { startsWith: prefix } },
        });
        const numero = `${prefix}${String(count + 1).padStart(4, "0")}`;

        return tx.commande.create({
          data: {
            numero,
            boutiqueId,
            clientId: client.id,
            modeLivraison: infos.modeLivraison,
            commentaire: infos.commentaire || null,
            sousTotal,
            livraison,
            total,
            lignes: {
              create: panierValide.map((item) => ({
                produitId: item.produitId,
                quantite: item.quantite,
                prixUnitaire: produitsParId.get(item.produitId)!.prix,
                couleur: item.couleur || null,
                taille: item.taille || null,
              })),
            },
          },
        });
      });
    } catch (error) {
      const isUniqueNumeroConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        (error.meta?.target as string[] | undefined)?.includes("numero");

      if (isUniqueNumeroConflict && attempt < 4) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Impossible de générer un numéro de commande unique.");
}

export async function confirmerCommande(
  boutiqueId: string,
  panier: PanierItemInput[],
  infosClient: InfosClientInput
): Promise<ConfirmerCommandeResult> {
  const boutiqueIdResult = z.string().min(1).safeParse(boutiqueId);
  if (!boutiqueIdResult.success) {
    return { success: false, error: "Boutique invalide." };
  }

  const panierResult = z
    .array(ligneSchema)
    .min(1, "Le panier est vide")
    .safeParse(panier);
  if (!panierResult.success) {
    return {
      success: false,
      error: panierResult.error.issues[0]?.message ?? "Panier invalide.",
    };
  }

  const infosResult = infosClientSchema.safeParse(infosClient);
  if (!infosResult.success) {
    return {
      success: false,
      error: infosResult.error.issues[0]?.message ?? "Informations invalides.",
    };
  }

  const panierValide = panierResult.data;
  const infos = infosResult.data;

  const boutique = await prisma.boutique.findUnique({
    where: { id: boutiqueId },
  });
  if (!boutique) {
    return { success: false, error: "Boutique introuvable." };
  }

  const produitIds = Array.from(
    new Set(panierValide.map((item) => item.produitId))
  );
  const produits = await prisma.produit.findMany({
    where: { id: { in: produitIds }, boutiqueId },
  });
  const produitsParId = new Map(produits.map((p) => [p.id, p]));

  const articlesInvalides: string[] = [];
  for (const item of panierValide) {
    const produit = produitsParId.get(item.produitId);
    if (!produit || produit.statut !== StatutProduit.EN_LIGNE) {
      articlesInvalides.push(produit?.nom ?? "Article inconnu");
    }
  }

  if (articlesInvalides.length > 0) {
    return {
      success: false,
      error: `Ces articles ne sont plus disponibles : ${articlesInvalides.join(", ")}. Merci de les retirer de votre panier avant de continuer.`,
    };
  }

  const sousTotal = panierValide.reduce((sum, item) => {
    const produit = produitsParId.get(item.produitId)!;
    return sum + produit.prix * item.quantite;
  }, 0);
  const livraison = DELIVERY_FEE;
  const total = sousTotal + livraison;

  try {
    const commande = await creerCommandeAvecNumeroUnique({
      boutiqueId,
      infos,
      panierValide,
      produitsParId,
      sousTotal,
      livraison,
      total,
    });

    return {
      success: true,
      data: { id: commande.id, numero: commande.numero, total: commande.total },
    };
  } catch {
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de la commande.",
    };
  }
}
