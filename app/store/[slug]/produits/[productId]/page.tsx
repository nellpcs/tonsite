import { notFound } from "next/navigation";
import { getBoutiqueParSlug, getProduitPublic } from "../../data";
import StoreProductClient from "./StoreProductClient";

export default async function StoreProductPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  const boutique = await getBoutiqueParSlug(params.slug);

  if (!boutique) {
    notFound();
  }

  const produit = await getProduitPublic(boutique.id, params.productId);

  if (!produit) {
    notFound();
  }

  return (
    <StoreProductClient boutique={boutique} produit={produit} slug={params.slug} />
  );
}
