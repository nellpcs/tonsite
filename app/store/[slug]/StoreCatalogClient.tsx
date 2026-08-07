"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import FilterPanel from "@/components/store/FilterPanel";
import { useCart } from "@/lib/cart-context";
import type { Boutique, Categorie, Produit } from "@/lib/generated/prisma/client";
import {
  buildWhatsAppLink,
  cn,
  formatFcfa,
  getDiscountPercent,
  withAlpha,
} from "@/lib/utils";

type ProduitAvecCategorie = Produit & { categorie: Categorie | null };

const categoryTabs = ["Toutes", "Robes", "Sacs", "Chaussures", "Chemises"];

export default function StoreCatalogClient({
  boutique,
  produits,
  slug,
}: {
  boutique: Boutique;
  produits: ProduitAvecCategorie[];
  slug: string;
}) {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const promoProduits = produits.filter(
    (p) => p.prixBarre && p.prixBarre > p.prix
  );

  const nouveautes = produits.filter((produit) => {
    const matchesSearch = produit.nom
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "Toutes" || produit.categorie?.nom === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const initials = boutique.nom
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full font-bold"
              style={
                boutique.logoUrl
                  ? undefined
                  : {
                      backgroundColor: withAlpha(boutique.themePrimary, 0.1),
                      color: boutique.themePrimary,
                    }
              }
            >
              {boutique.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={boutique.logoUrl}
                  alt={boutique.nom}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold text-gray-900">
                {boutique.nom}
              </p>
              {boutique.description && (
                <p className="truncate text-xs text-gray-500">
                  {boutique.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="whatsapp"
              href={buildWhatsAppLink(
                boutique.whatsapp,
                `Bonjour ${boutique.nom}, j'ai une question.`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contacter
            </Button>
            <Link
              href={`/store/${slug}/panier`}
              aria-label="Voir le panier"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
            >
              <CartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: boutique.themeSecondary }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className="px-4 pb-4">
          <Input
            id="search"
            placeholder="Rechercher un produit"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSlot={<SearchIcon className="h-4 w-4" />}
            rightSlot={
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                aria-label="Ouvrir les filtres"
                className="text-gray-400 hover:text-gray-600"
              >
                <FilterIcon className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </header>

      <main className="flex flex-col gap-8 py-6">
        {promoProduits.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="px-4 text-lg font-semibold text-gray-900">
              Promotions
            </h2>
            <div className="flex gap-4 overflow-x-auto px-4 pb-2">
              {promoProduits.map((produit) => (
                <Link
                  key={produit.id}
                  href={`/store/${slug}/produits/${produit.id}`}
                  className="w-40 shrink-0"
                >
                  <Card className="flex flex-col gap-2 p-3">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                      <ProductThumbnail
                        src={produit.images[0]}
                        alt={produit.nom}
                      />
                      <span
                        className="absolute left-1.5 top-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: boutique.themeSecondary }}
                      >
                        -{getDiscountPercent(produit.prix, produit.prixBarre ?? undefined)}%
                      </span>
                    </div>
                    <p className="truncate text-sm font-medium text-gray-900">
                      {produit.nom}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatFcfa(produit.prix)}
                      </span>
                      {produit.prixBarre && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatFcfa(produit.prixBarre)}
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-3 px-4">
          <h2 className="text-lg font-semibold text-gray-900">Nouveautés</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {nouveautes.map((produit) => {
              const discount = getDiscountPercent(
                produit.prix,
                produit.prixBarre ?? undefined
              );
              return (
                <Link
                  key={produit.id}
                  href={`/store/${slug}/produits/${produit.id}`}
                >
                  <Card className="flex flex-col gap-2 p-3">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                      <ProductThumbnail
                        src={produit.images[0]}
                        alt={produit.nom}
                      />
                      {discount !== null && (
                        <span
                          className="absolute left-1.5 top-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: boutique.themeSecondary }}
                        >
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm font-medium text-gray-900">
                      {produit.nom}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatFcfa(produit.prix)}
                      </span>
                      {produit.prixBarre && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatFcfa(produit.prixBarre)}
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}

            {nouveautes.length === 0 && (
              <p className="col-span-full py-12 text-center text-sm text-gray-500">
                Aucun produit ne correspond à votre recherche.
              </p>
            )}
          </div>
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex gap-2 overflow-x-auto border-t border-gray-100 bg-white px-4 py-3 md:hidden">
        {categoryTabs.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive ? "text-white" : "text-gray-500 hover:text-gray-900"
              )}
              style={isActive ? { backgroundColor: boutique.themePrimary } : undefined}
            >
              {category}
            </button>
          );
        })}
      </nav>

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}

function ProductThumbnail({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center text-gray-300">
      <ImagePlaceholderIcon className="h-8 w-8" />
    </div>
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

function SearchIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function FilterIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 5h16M7 12h10M10 19h4" />
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
