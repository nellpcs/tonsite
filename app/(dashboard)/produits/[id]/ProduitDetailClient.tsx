"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { Categorie, Produit } from "@/lib/generated/prisma/client";
import { cn, formatFcfa } from "@/lib/utils";
import { supprimerProduit } from "../actions";

type ProduitAvecCategorie = Produit & { categorie: Categorie | null };

export default function ProduitDetailClient({
  produit,
}: {
  produit: ProduitAvecCategorie;
}) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const images = produit.images.length > 0 ? produit.images : [null];

  const discountPercent =
    produit.prixBarre && produit.prixBarre > produit.prix
      ? Math.round(
          ((produit.prixBarre - produit.prix) / produit.prixBarre) * 100
        )
      : null;

  async function handleDelete() {
    if (!window.confirm("Supprimer définitivement ce produit ?")) {
      return;
    }
    setError(null);
    setIsDeleting(true);
    const result = await supprimerProduit(produit.id);
    if (!result.success) {
      setError(result.error ?? "Impossible de supprimer ce produit.");
      setIsDeleting(false);
      return;
    }
    router.push("/produits");
  }

  return (
    <main className="flex flex-col gap-8 px-6 py-8 lg:px-10">
      <Link
        href="/produits"
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Retour aux produits
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-100 text-gray-300">
            {images[activeImage] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeImage] as string}
                alt={produit.nom}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlaceholderIcon className="h-12 w-12" />
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((image, index) => (
                <button
                  key={image ?? index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Photo ${index + 1}`}
                  className={cn(
                    "flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-2 bg-primary/5 text-primary/40",
                    activeImage === index
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholderIcon className="h-5 w-5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {produit.statut === "EN_LIGNE" && (
              <Badge variant="success">En ligne</Badge>
            )}
            {discountPercent !== null && (
              <Badge variant="discount">-{discountPercent}%</Badge>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{produit.nom}</h1>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-gray-900">
              {formatFcfa(produit.prix)}
            </span>
            {produit.prixBarre && (
              <span className="text-sm text-gray-400 line-through">
                {formatFcfa(produit.prixBarre)}
              </span>
            )}
          </div>

          <Card className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Catégorie</span>
              <span className="font-medium text-gray-900">
                {produit.categorie?.nom ?? "Non classé"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Stock</span>
              <span
                className={cn(
                  "font-medium",
                  produit.stock === 0 ? "text-red-500" : "text-gray-900"
                )}
              >
                {produit.stock === 0
                  ? "Rupture de stock"
                  : `${produit.stock} en stock`}
              </span>
            </div>
            {produit.couleurs.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Couleurs</span>
                <span className="font-medium text-gray-900">
                  {produit.couleurs.join(", ")}
                </span>
              </div>
            )}
            {produit.tailles.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tailles</span>
                <span className="font-medium text-gray-900">
                  {produit.tailles.join(", ")}
                </span>
              </div>
            )}
          </Card>

          {produit.description && (
            <div>
              <h2 className="mb-1 font-semibold text-gray-900">
                Description
              </h2>
              <p className="text-sm text-gray-600">{produit.description}</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
        <Button variant="outline" className="sm:flex-1">
          <ShareIcon className="h-4 w-4" />
          Partager
        </Button>
        <Button variant="outline" className="sm:flex-1">
          <DuplicateIcon className="h-4 w-4" />
          Dupliquer
        </Button>
        <Button
          variant="danger"
          className="sm:flex-1"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <TrashIcon className="h-4 w-4" />
          {isDeleting ? "Suppression..." : "Supprimer"}
        </Button>
      </div>
    </main>
  );
}

function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ImagePlaceholderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.6l6.8-3.9M8.6 13.4l6.8 3.9" />
    </svg>
  );
}

function DuplicateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6h12z" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
