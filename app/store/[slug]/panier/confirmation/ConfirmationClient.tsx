"use client";

import { useEffect, useRef } from "react";
import type { SVGProps } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Stepper from "@/components/ui/Stepper";
import { useCart } from "@/lib/cart-context";
import type {
  Boutique,
  Client,
  Commande,
  LigneCommande,
  Produit,
} from "@/lib/generated/prisma/client";
import { buildWhatsAppLink, formatFcfa } from "@/lib/utils";

type CommandeConfirmee = Commande & {
  client: Client;
  lignes: (LigneCommande & { produit: Produit })[];
};

function buildOrderMessage(boutiqueNom: string, commande: CommandeConfirmee) {
  const lignes = commande.lignes.map((ligne) => {
    const variant = [ligne.couleur, ligne.taille].filter(Boolean).join(" / ");
    return `• ${ligne.produit.nom}${variant ? ` (${variant})` : ""} x${ligne.quantite} — ${formatFcfa(ligne.prixUnitaire * ligne.quantite)}`;
  });

  const parts = [
    `Bonjour ${boutiqueNom}, voici le récapitulatif de ma commande ${commande.numero} :`,
    "",
    ...lignes,
    "",
    `Sous-total : ${formatFcfa(commande.sousTotal)}`,
    `Livraison : ${formatFcfa(commande.livraison)}`,
    `Total : ${formatFcfa(commande.total)}`,
    "",
    `Nom : ${commande.client.nom}`,
    `Téléphone : ${commande.client.telephone}`,
    `Ville : ${commande.client.ville ?? ""}`,
    `Quartier : ${commande.client.quartier ?? ""}`,
    `Mode de livraison : ${commande.modeLivraison ?? ""}`,
  ];

  if (commande.commentaire) {
    parts.push("", `Commentaire : ${commande.commentaire}`);
  }

  return parts.join("\n");
}

export default function ConfirmationClient({
  boutique,
  commande,
  slug,
}: {
  boutique: Boutique;
  commande: CommandeConfirmee | null;
  slug: string;
}) {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (commande && !hasCleared.current) {
      hasCleared.current = true;
      clearCart();
    }
  }, [commande, clearCart]);

  if (!commande) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-gray-500">
          Aucune commande à confirmer pour l&apos;instant.
        </p>
        <Link
          href={`/store/${slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Retour au catalogue
        </Link>
      </main>
    );
  }

  const totalQuantity = commande.lignes.reduce(
    (sum, ligne) => sum + ligne.quantite,
    0
  );
  const message = buildOrderMessage(boutique.nom, commande);

  return (
    <main className="flex min-h-screen flex-col gap-8 bg-gray-50 px-4 py-8">
      <Stepper currentStep={4} />

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-20 w-20 animate-pop-in items-center justify-center rounded-full bg-accent text-white">
          <CheckIcon className="h-10 w-10" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Commande prête !
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Commande {commande.numero} — envoyez-la au vendeur pour la
            finaliser.
          </p>
        </div>
      </div>

      <Card className="mx-auto flex w-full max-w-md flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Articles</span>
          <span className="font-medium text-gray-900">{totalQuantity}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Sous-total</span>
          <span className="font-medium text-gray-900">
            {formatFcfa(commande.sousTotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Livraison</span>
          <span className="font-medium text-gray-900">
            {formatFcfa(commande.livraison)}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2 text-base">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-gray-900">
            {formatFcfa(commande.total)}
          </span>
        </div>
      </Card>

      <Card className="mx-auto flex w-full max-w-md flex-col gap-2">
        <h2 className="font-semibold text-gray-900">Livraison</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Nom</span>
          <span className="font-medium text-gray-900">
            {commande.client.nom}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Téléphone</span>
          <span className="font-medium text-gray-900">
            {commande.client.telephone}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Adresse</span>
          <span className="font-medium text-gray-900">
            {commande.client.quartier}, {commande.client.ville}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Livraison</span>
          <span className="font-medium text-gray-900">
            {commande.modeLivraison}
          </span>
        </div>
      </Card>

      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3">
        <Button
          href={buildWhatsAppLink(boutique.whatsapp, message)}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          className="w-full"
        >
          Envoyer sur WhatsApp
        </Button>
        <Link
          href={`/store/${slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Retour au catalogue
        </Link>
      </div>
    </main>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
