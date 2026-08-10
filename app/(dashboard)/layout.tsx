"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const primaryNavItems: NavItem[] = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: HomeIcon },
  { href: "/produits", label: "Produits", icon: PackageIcon },
  { href: "/commandes", label: "Commandes", icon: BagIcon },
  { href: "/menu", label: "Menu", icon: MenuIcon },
];

const shopName = "Awa Fashion Shop";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-gray-100 bg-white md:flex">
        <div className="px-6 py-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {primaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-400">Boutique</p>
          <p className="truncate text-sm font-semibold text-gray-900">
            {shopName}
          </p>
        </div>
      </aside>

      <div className="md:pl-64">
        <div className="pb-20 md:pb-0">{children}</div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-gray-100 bg-white px-2 py-2 md:hidden">
        <MobileNavLink
          item={{ href: "/tableau-de-bord", label: "Accueil", icon: HomeIcon }}
          active={isActive("/tableau-de-bord")}
        />
        <MobileNavLink
          item={{ href: "/produits", label: "Produits", icon: PackageIcon }}
          active={isActive("/produits")}
        />

        <Link
          href="/produits/nouveau"
          aria-label="Ajouter un produit"
          className="relative -mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg"
        >
          <PlusIcon className="h-6 w-6" />
        </Link>

        <MobileNavLink
          item={{ href: "/commandes", label: "Commandes", icon: BagIcon }}
          active={isActive("/commandes")}
        />

        <MobileNavLink
          item={{ href: "/menu", label: "Menu", icon: MenuIcon }}
          active={isActive("/menu")}
        />
      </nav>
    </div>
  );
}

function MobileNavLink({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium",
        active ? "text-primary" : "text-gray-500"
      )}
    >
      <item.icon className="h-5 w-5" />
      {item.label}
    </Link>
  );
}

function HomeIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9" />
    </svg>
  );
}

function PackageIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function BagIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 8h12l1 12H5L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
