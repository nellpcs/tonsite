import Link from "next/link";
import { getServerSession } from "next-auth";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { authOptions } from "@/lib/auth";
import { requireBoutiqueId } from "@/lib/session";
import { formatFcfa, formatRelativeTime } from "@/lib/utils";
import { getDashboardData } from "./data";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getFirstName(name: string | null | undefined) {
  return name?.trim().split(/\s+/)[0] || "";
}

export default async function TableauDeBordPage() {
  const boutiqueId = await requireBoutiqueId();
  const session = await getServerSession(authOptions);
  const dashboard = await getDashboardData(boutiqueId);
  const vendorFirstName = getFirstName(session?.user?.name);

  return (
    <main className="flex flex-col gap-8 px-4 py-8 md:px-6 lg:px-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour{vendorFirstName ? `, ${vendorFirstName}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Voici ce qui se passe dans {dashboard.boutiqueName}.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Vues aujourd’hui"
          value={dashboard.viewsToday.toLocaleString("fr-FR")}
          change={dashboard.viewsChange}
          sparklineData={dashboard.viewsByDay}
        />
        <StatCard
          label="Commandes"
          value={dashboard.totalOrders}
          change={dashboard.ordersChange}
        />
        <StatCard
          label="Produits"
          value={dashboard.totalProducts}
          change={dashboard.productsChange}
        />
        <StatCard
          label="Visiteurs (7 jours)"
          value={dashboard.visitorCount.toLocaleString("fr-FR")}
          change={dashboard.visitorsChange}
          sparklineData={dashboard.visitorsByDay}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
            <Link href="/commandes" className="text-sm font-medium text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          {dashboard.recentOrders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">Vous n’avez pas encore de commande.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {dashboard.recentOrders.map((order) => (
                <li key={order.id}>
                  <Link href={`/commandes/${order.id}`} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(order.client.nom)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{order.client.nom}</p>
                        <p className="truncate text-xs text-gray-500">
                          {[order.client.quartier, order.client.ville].filter(Boolean).join(", ") || "Adresse non renseignée"}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatFcfa(order.total)}</p>
                      <p className="text-xs text-gray-400">{formatRelativeTime(order.createdAt.toISOString())}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Produits populaires</h2>
            <Link href="/produits" className="text-sm font-medium text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          {dashboard.popularProducts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">Les ventes apparaîtront ici après vos premières commandes.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {dashboard.popularProducts.map((product) => (
                <li key={product.id}>
                  <Link href={`/produits/${product.id}`} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt="" className="h-10 w-10 shrink-0 rounded-xl bg-gray-100 object-cover" />
                      ) : (
                        <span className="h-10 w-10 shrink-0 rounded-xl bg-gray-100" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{product.nom}</p>
                        <p className="text-xs text-gray-500">{product.sales} vente{product.sales > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-gray-900">{formatFcfa(product.prix)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </main>
  );
}
