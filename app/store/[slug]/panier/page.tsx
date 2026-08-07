"use client";

import type { SVGProps } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import { useCart } from "@/lib/cart-context";
import { DELIVERY_FEE } from "@/lib/mock-data";
import { formatFcfa } from "@/lib/utils";

export default function PanierPage({
  params,
}: {
  params: { slug: string };
}) {
  const { items, removeItem, updateQuantity, comment, setComment } =
    useCart();

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-gray-500">Votre panier est vide.</p>
        <Link
          href={`/store/${params.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Retour au catalogue
        </Link>
      </main>
    );
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-gray-50 px-4 py-6 pb-32">
      <div className="flex items-center gap-3">
        <Link
          href={`/store/${params.slug}`}
          aria-label="Retour à la boutique"
          className="text-gray-500 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">
          Mon panier ({totalQuantity})
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item.id} className="flex items-center gap-3">
            <span className="h-16 w-16 shrink-0 rounded-xl bg-gray-100" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {item.product.name}
              </p>
              {(item.color || item.size) && (
                <p className="text-xs text-gray-500">
                  {[item.color, item.size].filter(Boolean).join(" / ")}
                </p>
              )}
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {formatFcfa(item.product.price)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label="Supprimer l'article"
                className="text-gray-300 hover:text-red-500"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Diminuer la quantité"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MinusIcon className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-medium text-gray-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Augmenter la quantité"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Textarea
        id="comment"
        label="Un commentaire pour le vendeur (optionnel)"
        placeholder="Ex: Merci de livrer après 18h"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Card className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Sous-total</span>
          <span className="font-medium text-gray-900">
            {formatFcfa(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Livraison</span>
          <span className="font-medium text-gray-900">
            {formatFcfa(deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2 text-base">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-gray-900">{formatFcfa(total)}</span>
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white p-4">
        <Button
          href={`/store/${params.slug}/panier/informations`}
          variant="whatsapp"
          className="w-full"
        >
          Commander sur WhatsApp
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
