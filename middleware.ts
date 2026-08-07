import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// TODO: gérera plus tard aussi le routage par sous-domaine
// (ex: boutique.tonsite.com -> /store/[slug])

// Le groupe de routes (dashboard) n'ajoute pas de segment d'URL : on ne peut
// donc pas le protéger via un préfixe de chemin. On protège tout par défaut,
// sauf les routes explicitement publiques listées ci-dessous.
const publicPaths = ["/", "/inscription", "/connexion"];

function isPublicPath(pathname: string) {
  if (publicPaths.includes(pathname)) return true;
  if (pathname.startsWith("/store/")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const signInUrl = new URL("/connexion", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
