import { StatutProduit } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export function getBoutiqueParSlug(slug: string) {
  return prisma.boutique.findUnique({ where: { slug } });
}

interface ProduitsPublicsFiltres {
  categorieId?: string;
}

export function listerProduitsPublics(
  boutiqueId: string,
  filtres?: ProduitsPublicsFiltres
) {
  // Règle serveur : seuls les produits EN_LIGNE sont jamais renvoyés ici,
  // quel que soit ce qui est demandé côté client (aucun paramètre "statut"
  // n'est même exposé dans ProduitsPublicsFiltres).
  return prisma.produit.findMany({
    where: {
      boutiqueId,
      statut: StatutProduit.EN_LIGNE,
      ...(filtres?.categorieId ? { categorieId: filtres.categorieId } : {}),
    },
    include: { categorie: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getProduitPublic(boutiqueId: string, produitId: string) {
  return prisma.produit.findFirst({
    where: {
      id: produitId,
      boutiqueId,
      statut: StatutProduit.EN_LIGNE,
    },
    include: { categorie: true },
  });
}

export function getCommandeConfirmee(boutiqueId: string, commandeId: string) {
  return prisma.commande.findFirst({
    where: { id: commandeId, boutiqueId },
    include: {
      client: true,
      lignes: { include: { produit: true } },
    },
  });
}
