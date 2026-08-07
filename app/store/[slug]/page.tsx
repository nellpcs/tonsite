import { notFound } from "next/navigation";
import { getBoutiqueParSlug, listerProduitsPublics } from "./data";
import StoreCatalogClient from "./StoreCatalogClient";

export default async function StoreCatalogPage({
  params,
}: {
  params: { slug: string };
}) {
  const boutique = await getBoutiqueParSlug(params.slug);

  if (!boutique) {
    notFound();
  }

  const produits = await listerProduitsPublics(boutique.id);

  return (
    <StoreCatalogClient boutique={boutique} produits={produits} slug={params.slug} />
  );
}
