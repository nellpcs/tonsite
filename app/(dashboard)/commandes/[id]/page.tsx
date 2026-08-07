"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  DELIVERY_FEE,
  getOrderProducts,
  getOrderSubtotal,
  getOrderTotal,
  mockOrders,
  orderStatusConfig,
  type OrderStatus,
} from "@/lib/mock-data";
import { buildWhatsAppLink, formatFcfa, formatRelativeTime } from "@/lib/utils";

export default function CommandeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = mockOrders.find((o) => o.id === params.id);
  const [status, setStatus] = useState<OrderStatus | null>(
    order?.status ?? null
  );

  if (!order || !status) {
    return (
      <main className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <p className="text-gray-500">Commande introuvable.</p>
        <Link
          href="/commandes"
          className="text-sm font-medium text-primary hover:underline"
        >
          Retour aux commandes
        </Link>
      </main>
    );
  }

  const statusInfo = orderStatusConfig[status];
  const orderProducts = getOrderProducts(order);
  const subtotal = getOrderSubtotal(order);
  const total = getOrderTotal(order);
  const whatsappMessage = `Bonjour ${order.customerName}, c'est à propos de votre commande ${order.id}.`;

  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/commandes"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Retour aux commandes
        </Link>
        <Badge variant={statusInfo.badgeVariant}>{statusInfo.label}</Badge>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Commande {order.id}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {formatRelativeTime(order.createdAt)}
        </p>
      </div>

      <Card className="flex flex-col gap-2">
        <h2 className="font-semibold text-gray-900">Client</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Nom</span>
          <span className="font-medium text-gray-900">
            {order.customerName}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Téléphone</span>
          <span className="font-medium text-gray-900">
            {order.customerPhone}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Adresse</span>
          <span className="font-medium text-gray-900">
            {order.quartier}, {order.city}
          </span>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Articles</h2>
        <ul className="flex flex-col gap-4">
          {orderProducts.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-3">
              <span className="h-14 w-14 shrink-0 rounded-xl bg-gray-100" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">Qté : {quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatFcfa(product.price * quantity)}
              </p>
            </li>
          ))}
        </ul>
      </Card>

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
            {formatFcfa(DELIVERY_FEE)}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2 text-base">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-gray-900">{formatFcfa(total)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-500">Mode de livraison</span>
          <span className="font-medium text-gray-900">
            {order.deliveryMethod}
          </span>
        </div>
        {order.comment && (
          <div className="text-sm">
            <span className="text-gray-500">Commentaire : </span>
            <span className="font-medium text-gray-900">{order.comment}</span>
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="sm:flex-1"
          disabled={status !== "nouvelle"}
          onClick={() => setStatus("en-cours")}
        >
          Marquer comme en cours
        </Button>
        <Button
          variant="whatsapp"
          href={buildWhatsAppLink(order.customerPhone, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="sm:flex-1"
        >
          Contacter sur WhatsApp
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
