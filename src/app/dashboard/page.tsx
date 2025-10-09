import type { ReactNode } from "react";

import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dealers, vehicles } from "@/data";
import { formatMileage, formatPriceXof } from "@/lib/format";

const dashboardStats = [
  { label: "Annonces actives", value: 48 },
  { label: "Leads WhatsApp (30j)", value: 186 },
  { label: "Taux de réponse < 30 min", value: "92%" },
];

const pipelineSteps = [
  {
    title: "Photoshooting & upload",
    description: "18 visuels HD + vidéo 360° en 24h",
  },
  {
    title: "Validation admin",
    description: "Check contenu, prix, conformité documents",
  },
  {
    title: "Publication + push WhatsApp",
    description: "Distribution sur landing + push leads concessionnaire",
  },
];

export const metadata: Metadata = {
  title: "Dashboard concessionnaire (prototype statique)",
  description:
    "Maquette du dashboard Auto Nexus BJ : KPIs leads, inventaire, pipeline publication et actions rapides.",
};

export default function DashboardPage(): JSX.Element {
  const highlightedVehicles = vehicles.slice(0, 4);
  const owner = dealers[0];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent py-14">
        <AnimatedSection className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary">Dashboard mock — Phase 1</Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Espace concessionnaire Auto Nexus BJ
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Vue statique du cockpit : KPIs leads, suivi pipeline publication,
              inventaire premium et actions rapides. Cette maquette servira à
              valider le scope produit avec vos équipes et investisseurs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link
                href="https://wa.me/22962459012?text=Je%20souhaite%20tester%20le%20dashboard%20Auto%20Nexus%20BJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book démo dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">Voir le plan services</Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>

      <main className="flex flex-1 bg-muted/10 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-4 rounded-3xl border border-border bg-white/95 p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Concessionnaire
              </p>
              <p className="text-lg font-semibold text-foreground">{owner.name}</p>
              <p className="text-xs text-muted-foreground">{owner.city}</p>
            </div>
            <nav className="space-y-2 text-sm font-medium text-muted-foreground">
              <DashboardNavItem active>Tableau de bord</DashboardNavItem>
              <DashboardNavItem>Inventaire</DashboardNavItem>
              <DashboardNavItem>Leads & messages</DashboardNavItem>
              <DashboardNavItem>Calendrier shooting</DashboardNavItem>
              <DashboardNavItem>Facturation</DashboardNavItem>
              <DashboardNavItem>Paramètres</DashboardNavItem>
            </nav>
            <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <p>Support dédié</p>
              <p className="mt-2 text-sm normal-case text-foreground">
                Account manager : +229 62 45 90 12
              </p>
            </div>
          </aside>

          <section className="space-y-8">
            <AnimatedSection className="grid gap-4 md:grid-cols-3">
              {dashboardStats.map((stat) => (
                <Card
                  key={stat.label}
                  className="border-border/70 bg-white/95 shadow-sm"
                >
                  <CardHeader>
                    <CardTitle className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <CardDescription />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </AnimatedSection>

            <AnimatedSection className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Pipeline publication</CardTitle>
                  <CardDescription>
                    Suivi des étapes avant mise en ligne (workflow ops Auto Nexus BJ).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pipelineSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-xl border border-muted/60 bg-muted/30 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Étape {index + 1}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {step.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                  <CardDescription>
                    Illustrations des modules CRUD qui seront branchés sur Supabase.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Ajouter un véhicule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Planifier un shooting
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Consulter les leads du jour
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection>
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Inventaire premium en cours</CardTitle>
                  <CardDescription>
                    Aperçu statique de l’inventaire — chaque ligne affichera état,
                    prix, disponibilité, engagement lead.
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-muted-foreground">
                    <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <tr>
                        <th className="pb-3 pr-6">Modèle</th>
                        <th className="pb-3 pr-6">Statut</th>
                        <th className="pb-3 pr-6">Kilométrage</th>
                        <th className="pb-3 pr-6">Prix</th>
                        <th className="pb-3">Disponibilité</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/70">
                      {highlightedVehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td className="py-3 pr-6 text-foreground">
                            <div className="font-semibold">
                              {vehicle.brand} {vehicle.model}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {vehicle.trim}
                            </div>
                          </td>
                          <td className="py-3 pr-6">
                            <Badge variant="outline">
                              {vehicle.condition} • {vehicle.year}
                            </Badge>
                          </td>
                          <td className="py-3 pr-6">{formatMileage(vehicle.mileage)}</td>
                          <td className="py-3 pr-6">
                            {formatPriceXof(vehicle.price)}
                          </td>
                          <td className="py-3">
                            <Badge variant="secondary">
                              {vehicle.available ? "En ligne" : "En cours"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </AnimatedSection>


            <AnimatedSection delay={0.15} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Créer une annonce (mock)</CardTitle>
                  <CardDescription>
                    Formulaire statique qui sera branché sur Prisma/Supabase (CRUD inventaire).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4 md:grid-cols-2" autoComplete="off">
                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Modèle
                      <input
                        className="h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm"
                        placeholder="Ex : Lexus RX 450h+"
                        disabled
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Prix (XOF)
                      <input
                        className="h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm"
                        placeholder="64 500 000"
                        disabled
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Kilométrage
                      <input
                        className="h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm"
                        placeholder="0"
                        disabled
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Statut
                      <select
                        className="h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm"
                        disabled
                      >
                        <option>Neuf</option>
                        <option>Occasion</option>
                      </select>
                    </label>
                    <div className="md:col-span-2">
                      <Button disabled className="w-full justify-center">
                        À connecter via Prisma + Supabase
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Exporter le deck / data-room</CardTitle>
                  <CardDescription>
                    Téléchargez un JSON structuré (mock) qui servira de base au futur deck PDF.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-center">
                    <Link href="/api/dashboard/export" target="_blank">
                      Télécharger la data-room JSON
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-center">
                    <Link href="/docs/La trame du projet.docx">
                      Accéder à la trame produit
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Timeline shooting & leads (mock)</CardTitle>
                  <CardDescription>
                    Exemple de timeline qui sera alimentée via Supabase (events + tâches).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      label: "11:00",
                      title: "Shooting Lexus RX 450h+",
                      description: "Studio Nexus - upload en cours de bascule sur Supabase Storage.",
                    },
                    {
                      label: "12:45",
                      title: "Lead WhatsApp (Hilux Portonovo)",
                      description: "Réponse assignée à Awa (Service commercial).",
                    },
                    {
                      label: "15:30",
                      title: "Requête financement",
                      description: "Client MIG Motors • transmettre à Atlantique Banque.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="mt-1 h-2 w-2 rounded-full bg-brand" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </AnimatedSection>
          </section>
        </div>
      </main>
    </div>
  );
}

function DashboardNavItem({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}): JSX.Element {
  return (
    <div
      className={`rounded-lg px-3 py-2 transition ${
        active
          ? "bg-brand/10 text-brand"
          : "hover:bg-muted/40 hover:text-foreground"
      }`}
    >
      {children}
    </div>
  );
}
