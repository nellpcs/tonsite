"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import LineChart from "@/components/ui/LineChart";
import Select from "@/components/ui/Select";
import StatCard from "@/components/ui/StatCard";
import { getOrderTotal, mockOrders, products } from "@/lib/mock-data";
import { formatFcfa } from "@/lib/utils";

const periodOptions = ["7 derniers jours", "30 derniers jours", "3 derniers mois"];

const viewsByDay = [
  { label: "Lun", value: 28 },
  { label: "Mar", value: 34 },
  { label: "Mer", value: 31 },
  { label: "Jeu", value: 42 },
  { label: "Ven", value: 51 },
  { label: "Sam", value: 58 },
  { label: "Dim", value: 46 },
];

const totalViews = viewsByDay.reduce((sum, day) => sum + day.value, 0);
const totalSalesValue = mockOrders.reduce(
  (sum, order) => sum + getOrderTotal(order),
  0
);
const totalOrders = mockOrders.length;
const conversionRate = (totalOrders / totalViews) * 100;

const mostViewedProducts = [...products]
  .sort((a, b) => b.views - a.views)
  .slice(0, 5);

export default function StatistiquesPage() {
  const [period, setPeriod] = useState(periodOptions[0]);

  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <div className="w-56 shrink-0">
          <Select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {periodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Vues" value={totalViews.toLocaleString("fr-FR")} change={22} />
        <StatCard label="Valeur des ventes" value={formatFcfa(totalSalesValue)} change={15} />
        <StatCard label="Commandes" value={totalOrders} change={9} />
        <StatCard
          label="Taux de conversion"
          value={`${conversionRate.toFixed(1)}%`}
          change={5}
        />
      </section>

      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">
          Vues sur la période ({period})
        </h2>
        <LineChart data={viewsByDay} />
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Produits les plus vus</h2>
        <ul className="flex flex-col gap-4">
          {mostViewedProducts.map((product) => (
            <li key={product.id}>
              <Link
                href={`/produits/${product.id}`}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="h-12 w-12 shrink-0 rounded-lg bg-gray-100" />
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {product.views.toLocaleString("fr-FR")} vues
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
