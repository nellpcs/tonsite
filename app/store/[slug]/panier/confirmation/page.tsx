import { notFound } from "next/navigation";
import { getBoutiqueParSlug, getCommandeConfirmee } from "../../data";
import ConfirmationClient from "./ConfirmationClient";

export default async function PanierConfirmationPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { commandeId?: string };
}) {
  const boutique = await getBoutiqueParSlug(params.slug);

  if (!boutique) {
    notFound();
  }

  const commande = searchParams.commandeId
    ? await getCommandeConfirmee(boutique.id, searchParams.commandeId)
    : null;

  return (
    <ConfirmationClient
      boutique={boutique}
      commande={commande}
      slug={params.slug}
    />
  );
}
