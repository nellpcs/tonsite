import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireBoutiqueId } from "@/lib/session";
import ProduitDetailClient from "./ProduitDetailClient";

export default async function ProduitDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const boutiqueId = await requireBoutiqueId();

  const produit = await prisma.produit.findFirst({
    where: { id: params.id, boutiqueId },
    include: { categorie: true },
  });

  if (!produit) {
    notFound();
  }

  return <ProduitDetailClient produit={produit} />;
}
