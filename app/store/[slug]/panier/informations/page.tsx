import { notFound } from "next/navigation";
import { getBoutiqueParSlug } from "../../data";
import InformationsClient from "./InformationsClient";

export default async function PanierInformationsPage({
  params,
}: {
  params: { slug: string };
}) {
  const boutique = await getBoutiqueParSlug(params.slug);

  if (!boutique) {
    notFound();
  }

  return <InformationsClient boutiqueId={boutique.id} slug={params.slug} />;
}
