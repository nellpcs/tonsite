import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;
const CAMEROON_OFFSET_MS = 60 * 60 * 1000;

function startOfTodayInCameroon() {
  const now = new Date(Date.now() + CAMEROON_OFFSET_MS);
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
      CAMEROON_OFFSET_MS
  );
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) return undefined;
  return Math.round(((current - previous) / previous) * 100);
}

export async function getDashboardData(boutiqueId: string) {
  const today = startOfTodayInCameroon();
  const sevenDaysAgo = new Date(today.getTime() - 6 * DAY_MS);
  const previousSevenDaysAgo = new Date(today.getTime() - 13 * DAY_MS);

  const [boutique, totalProducts, totalOrders, recentOrders, popularRows, viewsToday] =
    await Promise.all([
      prisma.boutique.findUnique({
        where: { id: boutiqueId },
        select: { nom: true },
      }),
      prisma.produit.count({ where: { boutiqueId } }),
      prisma.commande.count({ where: { boutiqueId } }),
      prisma.commande.findMany({
        where: { boutiqueId },
        include: { client: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.ligneCommande.groupBy({
        by: ["produitId"],
        where: { commande: { boutiqueId } },
        _sum: { quantite: true },
        orderBy: { _sum: { quantite: "desc" } },
        take: 3,
      }),
      prisma.visite.count({
        where: { boutiqueId, createdAt: { gte: today } },
      }),
    ]);

  const days = Array.from({ length: 7 }, (_, index) =>
    new Date(sevenDaysAgo.getTime() + index * DAY_MS)
  );

  const [viewsByDay, visitorsByDay, ordersCurrentPeriod, ordersPreviousPeriod, newProductsCurrentPeriod, newProductsPreviousPeriod] =
    await Promise.all([
      Promise.all(
        days.map((day) =>
          prisma.visite.count({
            where: {
              boutiqueId,
              createdAt: { gte: day, lt: new Date(day.getTime() + DAY_MS) },
            },
          })
        )
      ),
      Promise.all(
        days.map(async (day) =>
          prisma.visite
            .findMany({
              where: {
                boutiqueId,
                createdAt: { gte: day, lt: new Date(day.getTime() + DAY_MS) },
              },
              distinct: ["visiteurId"],
              select: { visiteurId: true },
            })
            .then((visites) => visites.length)
        )
      ),
      prisma.commande.count({
        where: { boutiqueId, createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.commande.count({
        where: {
          boutiqueId,
          createdAt: { gte: previousSevenDaysAgo, lt: sevenDaysAgo },
        },
      }),
      prisma.produit.count({
        where: { boutiqueId, createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.produit.count({
        where: {
          boutiqueId,
          createdAt: { gte: previousSevenDaysAgo, lt: sevenDaysAgo },
        },
      }),
    ]);

  const visitorCount = await prisma.visite
    .findMany({
      where: { boutiqueId, createdAt: { gte: sevenDaysAgo } },
      distinct: ["visiteurId"],
      select: { visiteurId: true },
    })
    .then((visites) => visites.length);
  const previousViews = await prisma.visite.count({
    where: {
      boutiqueId,
      createdAt: { gte: previousSevenDaysAgo, lt: sevenDaysAgo },
    },
  });
  const previousVisitors = await prisma.visite
    .findMany({
      where: {
        boutiqueId,
        createdAt: { gte: previousSevenDaysAgo, lt: sevenDaysAgo },
      },
      distinct: ["visiteurId"],
      select: { visiteurId: true },
    })
    .then((visites) => visites.length);

  const products = await prisma.produit.findMany({
    where: { boutiqueId, id: { in: popularRows.map((row) => row.produitId) } },
    select: { id: true, nom: true, prix: true, images: true },
  });
  const productsById = new Map(products.map((product) => [product.id, product]));

  return {
    boutiqueName: boutique?.nom ?? "Votre boutique",
    viewsToday,
    viewsByDay,
    viewsChange: percentageChange(
      viewsByDay.reduce((total, count) => total + count, 0),
      previousViews
    ),
    visitorCount,
    visitorsByDay,
    visitorsChange: percentageChange(visitorCount, previousVisitors),
    totalOrders,
    ordersChange: percentageChange(ordersCurrentPeriod, ordersPreviousPeriod),
    totalProducts,
    productsChange: percentageChange(
      newProductsCurrentPeriod,
      newProductsPreviousPeriod
    ),
    recentOrders,
    popularProducts: popularRows.flatMap((row) => {
      const product = productsById.get(row.produitId);
      return product
        ? [{ ...product, sales: row._sum.quantite ?? 0 }]
        : [];
    }),
  };
}
