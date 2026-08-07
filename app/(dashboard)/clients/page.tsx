"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import Input from "@/components/ui/Input";
import { mockClients } from "@/lib/mock-data";
import { formatFcfa, formatRelativeTime } from "@/lib/utils";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <h1 className="text-2xl font-bold text-gray-900">Clients</h1>

      <Input
        id="search"
        placeholder="Rechercher un client"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftSlot={<SearchIcon className="h-4 w-4" />}
      />

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="grid min-w-[640px] grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-gray-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <span>Client</span>
            <span className="text-right">Commandes</span>
            <span className="text-right">Total dépensé</span>
            <span className="text-right">Dernière commande</span>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredClients.map((client) => (
              <div
                key={client.phone}
                className="grid min-w-[640px] grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {client.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {client.city}
                  </p>
                </div>
                <span className="text-right text-sm text-gray-900">
                  {client.ordersCount}
                </span>
                <span className="text-right text-sm font-semibold text-gray-900">
                  {formatFcfa(client.totalSpent)}
                </span>
                <span className="text-right text-xs text-gray-400">
                  {formatRelativeTime(client.lastOrderAt)}
                </span>
              </div>
            ))}

            {filteredClients.length === 0 && (
              <p className="px-6 py-12 text-center text-sm text-gray-500">
                Aucun client trouvé.
              </p>
            )}
          </div>
        </div>
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
