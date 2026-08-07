"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { getOrderProducts, getOrderTotal, mockOrders, orderStatusConfig } from "@/lib/mock-data";
import { cn, formatFcfa, formatRelativeTime } from "@/lib/utils";

const tabs = [
  { key: "toutes", label: "Toutes" },
  { key: "nouvelle", label: "Nouvelles" },
  { key: "en-cours", label: "En cours" },
  { key: "terminee", label: "Terminées" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function CommandesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("toutes");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesTab = activeTab === "toutes" || order.status === activeTab;
    const matchesSearch = order.customerName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>

      <Input
        id="search"
        placeholder="Rechercher un client"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftSlot={<SearchIcon className="h-4 w-4" />}
      />

      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-2">
        {tabs.map((tab) => {
          const count =
            tab.key === "toutes"
              ? mockOrders.length
              : mockOrders.filter((order) => order.status === tab.key).length;
          return (
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
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {filteredOrders.map((order) => {
          const status = orderStatusConfig[order.status];
          const summary = getOrderProducts(order)
            .map(
              ({ product, quantity }) =>
                `${product.name}${quantity > 1 ? ` x${quantity}` : ""}`
            )
            .join(", ");

          return (
            <Link key={order.id} href={`/commandes/${order.id}`}>
              <Card className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {order.customerName}
                    </p>
                    <Badge variant={status.badgeVariant}>{status.label}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {summary}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatFcfa(getOrderTotal(order))}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatRelativeTime(order.createdAt)}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}

        {filteredOrders.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-500">
            Aucune commande dans cette catégorie.
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
