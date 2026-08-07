"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ColorSwatchPicker from "@/components/ui/ColorSwatchPicker";
import { useCart } from "@/lib/cart-context";
import type { Boutique, Categorie, Produit } from "@/lib/generated/prisma/client";
import { colorPalette, type Product } from "@/lib/mock-data";
import {
  buildWhatsAppLink,
  cn,
  formatFcfa,
  getDiscountPercent,
  withAlpha,
} from "@/lib/utils";

type ProduitAvecCategorie = Produit & { categorie: Categorie | null };

function toCartProduct(produit: ProduitAvecCategorie): Product {
  return {
    id: produit.id,
    name: produit.nom,
    category: produit.categorie?.nom ?? "",
    price: produit.prix,
    oldPrice: produit.prixBarre ?? undefined,
    stock: produit.stock,
    online: true,
    favorite: false,
    colors: produit.couleurs,
    sizes: produit.tailles,
    description: produit.description ?? "",
    sales: 0,
    views: 0,
    rating: 0,
    reviewsCount: 0,
  };
}

export default function StoreProductClient({
  boutique,
  produit,
  slug,
}: {
  boutique: Boutique;
  produit: ProduitAvecCategorie;
  slug: string;
}) {
  const { addItem, items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    produit.couleurs[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    produit.tailles[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = getDiscountPercent(produit.prix, produit.prixBarre ?? undefined);
  const availableColors = colorPalette.filter((c) =>
    produit.couleurs.includes(c.name)
  );
  const hasImages = produit.images.length > 0;

  const whatsappMessage = `Bonjour ${boutique.nom}, je souhaite acheter "${produit.nom}"${
    selectedColor ? ` (couleur: ${selectedColor})` : ""
  }${selectedSize ? ` (taille: ${selectedSize})` : ""}, quantité: ${quantity}.`;

  return (
    <div className="min-h-screen bg-white pb-28">
      <div className="relative">
        <div
          className={cn(
            "flex aspect-square items-center justify-center overflow-hidden",
            hasImages && "bg-gray-100"
          )}
          style={
            hasImages
              ? undefined
              : {
                  backgroundColor: withAlpha(boutique.themePrimary, 0.05),
                  color: withAlpha(boutique.themePrimary, 0.5),
                }
          }
        >
          {hasImages ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={produit.images[activeImage]}
              alt={produit.nom}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholderIcon className="h-14 w-14" />
          )}
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Link
            href={`/store/${slug}`}
            aria-label="Retour à la boutique"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFavorite((prev) => !prev)}
              aria-label="Favori"
              aria-pressed={isFavorite}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm"
            >
              <HeartIcon
                filled={isFavorite}
                className="h-5 w-5"
                style={isFavorite ? { color: boutique.themeSecondary } : undefined}
              />
            </button>
            <button
              type="button"
              aria-label="Partager"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm"
            >
              <ShareIcon className="h-5 w-5" />
            </button>
            <Link
              href={`/store/${slug}/panier`}
              aria-label="Voir le panier"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm"
            >
              <CartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: boutique.themeSecondary }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {hasImages && produit.images.length > 1 && (
        <div className="flex gap-3 px-4 py-3">
          {produit.images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`Photo ${index + 1}`}
              className={cn(
                "flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-2",
                activeImage !== index && "border-transparent"
              )}
              style={
                activeImage === index
                  ? { borderColor: boutique.themePrimary }
                  : undefined
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          {discount !== null && (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: boutique.themeSecondary }}
            >
              -{discount}%
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold text-gray-900">{produit.nom}</h1>

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

        {availableColors.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Couleur</span>
            <ColorSwatchPicker
              options={availableColors}
              selected={selectedColor ? [selectedColor] : []}
              onToggle={(name) => setSelectedColor(name)}
              ringColor={boutique.themePrimary}
            />
          </div>
        )}

        {produit.tailles.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Taille</span>
            <div className="flex flex-wrap gap-2">
              {produit.tailles.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "text-white"
                        : "border-gray-200 text-gray-600"
                    )}
                    style={
                      isSelected
                        ? {
                            backgroundColor: boutique.themePrimary,
                            borderColor: boutique.themePrimary,
                          }
                        : undefined
                    }
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Quantité</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Diminuer la quantité"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-gray-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Augmenter la quantité"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {addedToCart && (
          <p
            className="rounded-xl px-3 py-2 text-sm"
            style={{
              backgroundColor: withAlpha(boutique.themeAccent, 0.1),
              color: boutique.themeAccent,
            }}
          >
            Produit ajouté au panier ({quantity} exemplaire
            {quantity > 1 ? "s" : ""}).
          </p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 flex gap-3 border-t border-gray-100 bg-white p-4">
        <Button
          variant="outline"
          className="flex-1"
          style={{ borderColor: boutique.themePrimary, color: boutique.themePrimary }}
          onClick={() => {
            addItem(toCartProduct(produit), selectedColor, selectedSize, quantity);
            setAddedToCart(true);
          }}
        >
          Ajouter au panier
        </Button>
        <Button
          variant="whatsapp"
          href={buildWhatsAppLink(boutique.whatsapp, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          Acheter maintenant
        </Button>
      </div>
    </div>
  );
}

function HeartIcon({
  filled,
  ...props
}: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CartIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-1.6 3.2A1 1 0 0 0 6.3 18H17" />
      <circle cx="8" cy="21" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="17" cy="21" r="1.5" fill="currentColor" stroke="none" />
    </svg>
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

function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
