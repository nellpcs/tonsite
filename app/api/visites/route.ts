import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VISITEUR_COOKIE = "tonsite-visiteur";

export async function POST(request: Request) {
  let body: { boutiqueId?: unknown; produitId?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const boutiqueId = typeof body.boutiqueId === "string" ? body.boutiqueId : null;
  const produitId = typeof body.produitId === "string" ? body.produitId : null;

  if (!boutiqueId) {
    return NextResponse.json({ error: "Boutique invalide." }, { status: 400 });
  }

  const boutique = await prisma.boutique.findFirst({
    where: { id: boutiqueId, statut: "ACTIVE" },
    select: { id: true },
  });

  if (!boutique) {
    return NextResponse.json({ error: "Boutique introuvable." }, { status: 404 });
  }

  if (produitId) {
    const produit = await prisma.produit.findFirst({
      where: { id: produitId, boutiqueId, statut: "EN_LIGNE" },
      select: { id: true },
    });

    if (!produit) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const existingVisitorId = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${VISITEUR_COOKIE}=`))
    ?.split("=")[1];
  const visiteurId = existingVisitorId || crypto.randomUUID();

  await prisma.visite.create({
    data: { boutiqueId, produitId, visiteurId },
  });

  const response = new NextResponse(null, { status: 204 });
  if (!existingVisitorId) {
    response.cookies.set(VISITEUR_COOKIE, visiteurId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return response;
}
