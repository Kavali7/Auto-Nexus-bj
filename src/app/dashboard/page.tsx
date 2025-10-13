import type { ReactNode } from "react";

import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { VehicleMediaUploader } from "@/components/vehicle-media-uploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { getDealers, getVehicles } from "@/data";
import { formatMileage, formatPriceXof } from "@/lib/format";
import type { DealerSummary, VehicleSummary } from "@/types/catalog";

type ChartSnapshot = {
  title: string;
  summary: string;
  description: string;
  points: number[];
  footer: string;
};

type JourneyEvent = {
  time: string;
  title: string;
  details: string;
};

const dashboardStats = [
  { label: "Leads WhatsApp (30 j)", value: "186", hint: "+32% vs sprint precedent" },
  { label: "Taux de reponse < 30 min", value: "92%", hint: "Objectif equipe commerce" },
  { label: "GMV mock suivie", value: "126 500 000 XOF", hint: "Inventaire premium pilote" },
] as const;

const chartSnapshots: ChartSnapshot[] = [
  {
    title: "Volume leads journalier",
    summary: "Pic campagne lancement",
    description:
      "Simulation basee sur le dernier sprint marketing avec push WhatsApp + IG stories.",
    points: [4, 6, 5, 9, 12, 14, 11, 18, 16, 20],
    footer: "Jour J cible : 35 leads qualifies",
  },
  {
    title: "Avancement pipeline publication",
    summary: "Pipeline shooting -> online",
    description:
      "Suivi des etapes photo, validation et mise en ligne pour rassurer les investisseurs.",
    points: [10, 12, 15, 19, 22, 26, 30, 33, 35, 36],
    footer: "18 annonces pretes avant 16h",
  },
];

const journeyStory: JourneyEvent[] = [
  {
    time: "08:30",
    title: "Kick-off demo jour J",
    details:
      "Point rapide equipe produit + sales. Verification pipeline shooting, leads en attente et CTA a mettre en avant durant la session.",
  },
  {
    time: "11:00",
    title: "Session concessionnaire pilote",
    details:
      "Parcours guidé: stats -> fiches -> comparateur -> demande de financement. Capture des questions et objections pour le suivi.",
  },
  {
    time: "15:00",
    title: "Debrief investisseur",
    details:
      "Export des indicateurs (GMV, leads, progression listings) + envoi de la data-room mock et plan d on-boarding.",
  },
];

const pipelineSteps = [
  {
    title: "Photoshooting & upload",
    description: "18 visuels HD + video 360 dans Supabase Storage, retard maximum 24h.",
  },
  {
    title: "Validation & tagging",
    description: "Check prix, mentions legales, assignation badges financement/livraison.",
  },
  {
    title: "Publication + push",
    description:
      "Mise en ligne, partage WhatsApp, newsletter et relais social en moins de 30 minutes.",
  },
] as const;

export const metadata: Metadata = {
  title: "Dashboard concessionnaire (maquette Jour J)",
  description:
    "Vue d ensemble statique du cockpit Auto Nexus BJ: KPIs leads, timeline Jour J, pipeline media et actions rapides pour la demo.",
};

export default function DashboardPage(): JSX.Element {
  const vehiclesDataset = getVehicles();
  const dealersDataset = getDealers();
  const highlightedVehicles = vehiclesDataset.slice(0, 4);
  const owner = dealersDataset[0];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent py-14">
        <AnimatedSection className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary">Dashboard demo Jour J</Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Cockpit concessionnaire Auto Nexus BJ
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Cette maquette concentre les indicateurs pilotant la demo: progression des
              leads, pipeline media, actions rapides et narration Jour J. Tout est mocke
              pour garantir la stabilite hors connexion.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link
                href="https://wa.me/95606058?text=Je%20souhaite%20planifier%20la%20demo%20dashboard%20Auto%20Nexus%20BJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Planifier la demo
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
                Concessionnaire pilote
              </p>
              <p className="text-lg font-semibold text-foreground">{owner.name}</p>
              <p className="text-xs text-muted-foreground">{owner.city}</p>
            </div>
            <nav className="space-y-2 text-sm font-medium text-muted-foreground">
              <DashboardNavItem active>Tableau de bord</DashboardNavItem>
              <DashboardNavItem>Inventaire</DashboardNavItem>
              <DashboardNavItem>Leads & messages</DashboardNavItem>
              <DashboardNavItem>Planning shooting</DashboardNavItem>
              <DashboardNavItem>Financement</DashboardNavItem>
              <DashboardNavItem>Parametres</DashboardNavItem>
            </nav>
            <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <p>Account manager demo</p>
              <p className="mt-2 text-sm normal-case text-foreground">+229 95 60 60 58</p>
            </div>
          </aside>

          <section className="space-y-8">
            <AnimatedSection className="grid gap-4 md:grid-cols-3">
              {dashboardStats.map((stat) => (
                <Card key={stat.label} className="border-border/70 bg-white/95 shadow-sm">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.hint}</p>
                  </CardHeader>
                </Card>
              ))}
            </AnimatedSection>

            <AnimatedSection className="grid gap-6 lg:grid-cols-2">
              {chartSnapshots.map((snapshot) => (
                <Card key={snapshot.title} className="border-border/70 bg-white/95 shadow-sm">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-foreground">
                        {snapshot.title}
                      </CardTitle>
                      <Badge variant="outline">{snapshot.summary}</Badge>
                    </div>
                    <CardDescription>{snapshot.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Sparkline points={snapshot.points} />
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {snapshot.footer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </AnimatedSection>

            <AnimatedSection delay={0.05} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle>Story Jour J - sequence demo</CardTitle>
                  <CardDescription>
                    Roadbook pour guider la session live: cadrage matin, proof points et
                    suivi investisseur.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {journeyStory.map((event) => (
                    <div key={event.time} className="flex gap-4">
                      <div className="mt-1 h-2 w-2 rounded-full bg-brand" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {event.time}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {event.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle>Actions rapides demo</CardTitle>
                  <CardDescription>
                    Raccourcis actifs pendant la session pour suivre les demandes live.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Ouvrir les leads du jour
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Planifier un shooting
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Exporter le recap investors
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Partager le deck demo
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.1} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Pipeline publication</CardTitle>
                  <CardDescription>
                    Rappel des etapes pour garantir des annonces photo-ready avant 17h.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pipelineSteps.map((step) => (
                    <div key={step.title} className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Upload media (maquette)</CardTitle>
                  <CardDescription>
                    Ce composant restera en demo tant que Prisma et Supabase ne sont pas branches.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VehicleMediaUploader />
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Inventaire premium en cours</CardTitle>
                  <CardDescription>
                    Vue mockee: etat publication, prix et disponibilite pour le Jour J.
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-muted-foreground">
                    <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <tr>
                        <th className="pb-3 pr-6">Modele</th>
                        <th className="pb-3 pr-6">Statut</th>
                        <th className="pb-3 pr-6">Kilometrage</th>
                        <th className="pb-3 pr-6">Prix</th>
                        <th className="pb-3">Disponibilite</th>
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
                              {vehicle.trim ?? "Version a confirmer"}
                            </div>
                          </td>
                          <td className="py-3 pr-6">
                            <Badge variant="outline">
                              {vehicle.condition} · {vehicle.year}
                            </Badge>
                          </td>
                          <td className="py-3 pr-6">{formatMileage(vehicle.mileage)}</td>
                          <td className="py-3 pr-6">{formatPriceXof(vehicle.price)}</td>
                          <td className="py-3">
                            <Badge variant="secondary">
                              {vehicle.available ? "En ligne" : "A verifier"}
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
                  <CardTitle>Creer une annonce (mock)</CardTitle>
                  <CardDescription>
                    Formulaire statique: il sera branche sur Prisma/Supabase pour la mise
                    en production.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4 md:grid-cols-2" autoComplete="off">
                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Modele
                      <input
                        className="h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm"
                        placeholder="Ex: Lexus RX 450h+"
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
                      Kilometrage
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
                        Simulation: connectera Prisma lors du go live
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <FinancingAndLogistics vehicle={highlightedVehicles[0]} dealer={owner} />
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
        active ? "bg-brand/10 text-brand" : "hover:bg-muted/40 hover:text-foreground"
      }`}
    >
      {children}
    </div>
  );
}

function Sparkline({ points }: { points: number[] }): JSX.Element {
  const width = 220;
  const height = 80;
  const maxValue = Math.max(...points, 1);
  const minValue = Math.min(...points, 0);
  const range = Math.max(maxValue - minValue, 1);
  const step = width / Math.max(points.length - 1, 1);

  const path = points
    .map((value, index) => {
      const x = index * step;
      const ratio = (value - minValue) / range;
      const y = height - ratio * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="80"
      role="img"
      aria-label="Graphique statique"
    >
      <defs>
        <linearGradient id="sparklineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(0, 109, 255, 0.35)" />
          <stop offset="100%" stopColor="rgba(0, 109, 255, 0)" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L${width},${height} L0,${height} Z`}
        fill="url(#sparklineFill)"
        stroke="none"
      />
      <path d={path} fill="none" stroke="rgba(0, 90, 210, 1)" strokeWidth="3" />
    </svg>
  );
}

function FinancingAndLogistics({
  vehicle,
  dealer,
}: {
  vehicle: VehicleSummary;
  dealer?: DealerSummary;
}): JSX.Element {
  const monthlyEstimate = Math.round(vehicle.price / 24);

  return (
    <Card className="border-border/70 bg-white/95 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Financement et livraison (mock)
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Reassurance demo: ce bloc sera relie a Supabase une fois les partenaires
          signes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/15 p-5">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="border-brand/20 bg-brand/10 text-brand">
              Financement
            </Badge>
            <span className="text-sm font-semibold text-foreground">
              {formatPriceXof(monthlyEstimate)} / mois
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Simulation 24 mois: dossier digital complet, reponse partenaire sous 48 h,
            assurance incluse la premiere annee.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/15 p-5">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="border-brand/20 bg-brand/10 text-brand">
              Livraison
            </Badge>
            <span className="text-sm font-semibold text-foreground">J+2 Cotonou</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Inspection 40 points, detailing, convoyage plateau ou chauffeur agree. Option
            couverture showroom incluse dans le pack.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 bg-muted/20 p-4">
        <Button asChild size="sm">
          <Link
            href={
              dealer?.whatsapp
                ? buildWhatsappLink(dealer.whatsapp, "Je veux planifier le financement demo.")
                : "#contact"
            }
          >
            Demander un plan
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="#contact">Parler logistique</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

