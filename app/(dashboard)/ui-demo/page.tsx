"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import StatCard from "@/components/ui/StatCard";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

export default function UiDemoPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900">
        Bibliothèque de composants UI
      </h1>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Ajouter au panier</Button>
          <Button variant="whatsapp">Commander via WhatsApp</Button>
          <Button variant="outline">Modifier</Button>
          <Button variant="ghost">Annuler</Button>
          <Button variant="primary" disabled>
            Désactivé
          </Button>
        </div>
      </Section>

      <Section title="Card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-sm text-gray-600">
              Carte blanche standard, coins arrondis (rounded-2xl) et ombre
              douce.
            </p>
          </Card>
          <Card className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Produit exemple</span>
            <Badge variant="discount">-33%</Badge>
          </Card>
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="discount">-33%</Badge>
          <Badge variant="success">+12%</Badge>
          <Badge variant="neutral">Nouveau</Badge>
        </div>
      </Section>

      <Section title="Input">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id="demo-name" label="Nom du produit" placeholder="Ex: T-shirt coton" />
          <Input id="demo-price" label="Prix" type="number" placeholder="0.00" />
        </div>
      </Section>

      <Section title="Toggle">
        <div className="flex flex-col gap-3">
          <Toggle
            checked={isOnline}
            onChange={setIsOnline}
            label={`En ligne — ${isOnline ? "activé" : "désactivé"}`}
          />
          <Toggle
            checked={isFeatured}
            onChange={setIsFeatured}
            label="Mise en avant"
          />
          <Toggle checked={false} onChange={() => {}} label="Désactivé" disabled />
        </div>
      </Section>

      <Section title="StatCard">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Commandes du mois" value={128} change={12} />
          <StatCard label="Panier moyen" value="24,90 €" change={-4} />
          <StatCard label="Visiteurs" value="3 402" />
        </div>
      </Section>
    </main>
  );
}
