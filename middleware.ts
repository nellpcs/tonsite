import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Ce middleware gérera plus tard le routage par sous-domaine
// (ex: boutique.tonsite.com -> /store/[slug])
export function middleware(request: NextRequest) {
  return NextResponse.next();
}
