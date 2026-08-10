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

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function getDashboardData(boutiqueId: string) {
  const today = startOfTodayInCameroon();
  const sevenDaysAgo = new Date(today.getTime() - 6 * DAY_MS);
  const fourteenDaysAgo = new Date(today.getTime() - 13 * DAY_MS);

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

  const [visitsRaw, visitorsRaw, ordersRaw, productsRaw] =
    await Promise.all([
      prisma.visite.findMany({
        where: {
          boutiqueId,
          createdAt: { gte: sevenDaysAgo, lt: new Date(today.getTime() + DAY_MS) },
        },
        select: { createdAt: true },
      }),
      prisma.visite.findMany({
        where: {
          boutiqueId,
          createdAt: { gte: sevenDaysAgo, lt: new Date(today.getTime() + DAY_MS) },
        },
        select: { visiteurId: true, createdAt: true },
      }),
      prisma.commande.findMany({
        where: {
          boutiqueId,
          createdAt: { gte: sevenDaysAgo, lt: new Date(today.getTime() + DAY_MS) },
        },
        select: { createdAt: true },
      }),
      prisma.produit.findMany({
        where: {
          boutiqueId,
          createdAt: { gte: sevenDaysAgo, lt: new Date(today.getTime() + DAY_MS) },
        },
        select: { createdAt: true },
      }),
    ]);

  const days = Array.from({ length: 7 }, (_, index) =>
    startOfDay(new Date(sevenDaysAgo.getTime() + index * DAY_MS))
  );

  const viewsByDay = days.map((day) =>
    visitsRaw.filter((v) => startOfDay(v.createdAt).getTime() === day.getTime()).length
  );

  const visitorSets = new Map<string, Set<string>>();
  visitorsRaw.forEach((v) => {
    const dayKey = startOfDay(v.createdAt).getTime().toString();
    if (!visitorSets.has(dayKey)) {
      visitorSets.set(dayKey, new Set());
    }
    visitorSets.get(dayKey)!.add(v.visiteurId);
  });
  const visitorsByDay = days.map((day) => visitorSets.get(day.getTime().toString())?.size || 0);

  const ordersByDay = days.map((day) =>
    ordersRaw.filter((o) => startOfDay(o.createdAt).getTime() === day.getTime()).length
  );
  const productsByDay = days.map((day) =>
    productsRaw.filter((p) => startOfDay(p.createdAt).getTime() === day.getTime()).length
  );

  const [previousVisits, previousVisitorsRaw, ordersCurrentPeriod, ordersPreviousPeriod, newProductsCurrentPeriod, newProductsPreviousPeriod] =
    await Promise.all([
      prisma.visite.count({
        where: {
          boutiqueId,
          createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      }),
      prisma.visite.findMany({
        where: {
          boutiqueId,
          createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
        select: { visiteurId: true },
      }),
      prisma.commande.count({
        where: { boutiqueId, createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.commande.count({
        where: {
          boutiqueId,
          createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      }),
      prisma.produit.count({
        where: { boutiqueId, createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.produit.count({
        where: {
          boutiqueId,
          createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      }),
    ]);

  const visitorCount = new Set(visitorsRaw.map((v) => v.visiteurId)).size;
  const previousVisitorCount = new Set(previousVisitorsRaw.map((v) => v.visiteurId)).size;

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
      previousVisits
    ),
    visitorCount,
    visitorsByDay,
    visitorsChange: percentageChange(visitorCount, previousVisitorCount),
    totalOrders,
    ordersChange: percentageChange(ordersCurrentPeriod, ordersPreviousPeriod),
    ordersByDay,
    totalProducts,
    productsChange: percentageChange(
      newProductsCurrentPeriod,
      newProductsPreviousPeriod
    ),
    productsByDay,
    recentOrders,
    popularProducts: popularRows.flatMap((row) => {
      const product = productsById.get(row.produitId);
      return product
        ? [{ ...product, sales: row._sum.quantite ?? 0 }]
        : [];
    }),
  };
}
