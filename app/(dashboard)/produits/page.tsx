"use client";

import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { cn, formatFcfa } from "@/lib/utils";
import { listerProduits, toggleStatutProduit } from "./actions";
import type { Produit } from "@/lib/generated/prisma/client";

const tabs = [
  { key: "TOUS", label: "Tous" },
  { key: "EN_LIGNE", label: "En ligne" },
  { key: "HORS_LIGNE", label: "Hors ligne" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function ProduitsPage() {
  const [products, setProducts] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("TOUS");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    listerProduits("TOUS").then((data) => {
      if (!cancelled) {
        setProducts(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleToggle(id: string) {
    const result = await toggleStatutProduit(id);
    if (result.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                statut: p.statut === "EN_LIGNE" ? "HORS_LIGNE" : "EN_LIGNE",
              }
            : p
        )
      );
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesTab = activeTab === "TOUS" || product.statut === activeTab;
    const matchesSearch = product.nom
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    TOUS: products.length,
    EN_LIGNE: products.filter((p) => p.statut === "EN_LIGNE").length,
    HORS_LIGNE: products.filter((p) => p.statut === "HORS_LIGNE").length,
  };

  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Mes produits</h1>
        <Button href="/produits/nouveau" variant="primary">
          <PlusIcon className="h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          id="search"
          placeholder="Rechercher un produit"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftSlot={<SearchIcon className="h-4 w-4" />}
          className="sm:flex-1"
        />
        <Button variant="outline">
          <FilterIcon className="h-4 w-4" />
          Filtrer
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && (
          <p className="py-12 text-center text-sm text-gray-500">
            Chargement des produits...
          </p>
        )}

        {!isLoading &&
          filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="flex items-center justify-between gap-4"
            >
              <Link
                href={`/produits/${product.id}`}
                className="flex min-w-0 flex-1 items-center gap-4"
              >
                {product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt={product.nom}
                    className="h-14 w-14 shrink-0 rounded-xl bg-gray-100 object-cover"
                  />
                ) : (
                  <span className="h-14 w-14 shrink-0 rounded-xl bg-gray-100" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {product.nom}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatFcfa(product.prix)}
                    </span>
                    {product.prixBarre && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatFcfa(product.prixBarre)}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-0.5 text-xs",
                      product.stock === 0 ? "text-red-500" : "text-gray-500"
                    )}
                  >
                    {product.stock === 0
                      ? "Rupture de stock"
                      : `${product.stock} en stock`}
                  </p>
                </div>
              </Link>

              <div className="flex shrink-0 items-center gap-3">
                <Toggle
                  checked={product.statut === "EN_LIGNE"}
                  onChange={() => handleToggle(product.id)}
                />
              </div>
            </Card>
          ))}

        {!isLoading && filteredProducts.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-500">
            Aucun produit dans cette catégorie.
          </p>
        )}
      </div>
    </main>
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
