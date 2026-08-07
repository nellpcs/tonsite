import Link from "next/link";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { getOrderTotal, mockOrders, products } from "@/lib/mock-data";
import { formatFcfa, formatRelativeTime } from "@/lib/utils";

const vendorFirstName = "Awa";

const stats = [
  {
    label: "Vues aujourd'hui",
    value: "1 284",
    change: 18,
    sparklineData: [12, 18, 14, 22, 28, 24, 32, 30, 38],
  },
  {
    label: "Commandes",
    value: 42,
    change: 12,
    sparklineData: [5, 8, 6, 10, 9, 14, 12, 16, 18],
  },
  {
    label: "Produits",
    value: 96,
    change: 4,
    sparklineData: [80, 82, 85, 88, 90, 92, 94, 95, 96],
  },
  {
    label: "Visiteurs",
    value: "3 402",
    change: 9,
    sparklineData: [200, 240, 260, 300, 280, 320, 340, 360, 380],
  },
];

const recentOrders = [...mockOrders]
  .sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  .slice(0, 3);

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const popularProducts = [...products]
  .sort((a, b) => b.sales - a.sales)
  .slice(0, 3);

export default function TableauDeBordPage() {
  return (
    <main className="flex flex-col gap-8 px-6 py-8 lg:px-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {vendorFirstName} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Voici ce qui se passe dans votre boutique.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            sparklineData={stat.sparklineData}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
            <Link
              href="/commandes"
              className="text-sm font-medium text-primary hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <ul className="flex flex-col gap-4">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/commandes/${order.id}`}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {getInitials(order.customerName)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.quartier}, {order.city}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatFcfa(getOrderTotal(order))}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatRelativeTime(order.createdAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Produits populaires</h2>
            <Link
              href="/produits"
              className="text-sm font-medium text-primary hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <ul className="flex flex-col gap-4">
            {popularProducts.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/produits/${product.id}`}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.sales} ventes
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatFcfa(product.price)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </main>
  );
}
