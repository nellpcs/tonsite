import type { SVGProps } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";

const stats = [
  { value: "10K+", label: "Vendeurs actifs" },
  { value: "50K+", label: "Commandes" },
  { value: "98%", label: "Satisfaction" },
];

const features = [
  {
    icon: StoreIcon,
    title: "Boutique en ligne",
    description:
      "Crée ta vitrine en ligne en quelques clics, sans compétence technique.",
  },
  {
    icon: CatalogIcon,
    title: "Catalogue illimité",
    description:
      "Ajoute autant de produits que tu veux, organisés par catégories.",
  },
  {
    icon: ChatIcon,
    title: "Commandes WhatsApp",
    description:
      "Reçois les commandes de tes clients directement sur WhatsApp.",
  },
  {
    icon: ChartIcon,
    title: "Statistiques avancées",
    description:
      "Suis tes ventes, tes produits populaires et ta croissance en temps réel.",
  },
];

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <button
            type="button"
            aria-label="Menu"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <StarIcon className="h-4 w-4" />
              N°1 au Cameroun
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Crée ta boutique <span className="text-primary">WhatsApp</span>{" "}
              en 2 minutes
            </h1>

            <p className="mt-4 text-lg text-gray-600">
              Partage ton lien, reçois des commandes, développe ton business.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" href="/inscription">
                Créer ma boutique
              </Button>
              <Button variant="outline" href="/connexion">
                Voir la démo
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative aspect-[9/19] w-full max-w-[260px] rounded-[2.5rem] border-8 border-gray-900 bg-gray-900 p-2 shadow-xl">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[2rem] bg-primary/5 text-primary/60">
                <ImagePlaceholderIcon className="h-10 w-10" />
                <span className="text-xs font-medium">
                  Aperçu de la boutique
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Fonctionnalités clés
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col gap-3">
                  <span className="inline-flex w-fit rounded-xl bg-primary/10 p-3 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2l2.9 6.3 6.9.8-5.2 4.7 1.5 6.8L12 17.3 5.9 20.6l1.5-6.8L2.2 9.1l6.9-.8L12 2z" />
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
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function StoreIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 9l1.5-5h15L21 9M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M4 9h16M9 21v-6h6v6" />
    </svg>
  );
}

function CatalogIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function ChatIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function ChartIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 3v18h18" />
      <rect x="7" y="13" width="3" height="5" fill="currentColor" stroke="none" />
      <rect x="12" y="9" width="3" height="9" fill="currentColor" stroke="none" />
      <rect x="17" y="5" width="3" height="13" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ImagePlaceholderIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}
