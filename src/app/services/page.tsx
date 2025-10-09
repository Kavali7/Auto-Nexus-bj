import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { services, getDealers } from "@/data";
import { buildWhatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Services Auto Nexus BJ",
  description:
    "Vue d'ensemble des 7 piliers services Auto Nexus BJ : neufs, entretien, pièces, lubrifiants, financement, location et logistique.",
};

const dealersDataset = getDealers();

const heroStats = [
  {
    label: "Partenaires actifs",
    value: services.reduce((total, item) => total + item.partners.length, 0),
  },
  {
    label: "Concessionnaires connectés",
    value: dealersDataset.length,
  },
  {
    label: "Pilier(s) premium",
    value: services.length,
  },
];

export default function ServicesPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent py-16">
        <AnimatedSection className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-brand">
              Vision marketplace 360°
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Les 7 piliers services Auto Nexus BJ
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Chaque partenaire s’inscrit dans un parcours client cohérent : du
              choix du véhicule jusqu’à la livraison, l’entretien et le financement.
              Cette page servira d’alignement pour les investisseurs et futurs
              concessionnaires.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">Découvrir le plan Phase 1</Button>
              <Button asChild size="lg" variant="outline">
                <Link
                  href={buildWhatsappLink(
                    "95606058",
                    "Bonjour Auto Nexus BJ, je souhaite planifier une présentation investisseurs.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Présentation WhatsApp
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-4 rounded-2xl border border-brand/20 bg-white/90 p-6 shadow-lg sm:grid-cols-3 lg:grid-cols-1">
            {heroStats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-3xl font-semibold text-foreground">
                  {stat.value.toString().padStart(2, "0")}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <main className="flex flex-1 flex-col gap-16 bg-muted/10 py-16">
        <AnimatedSection className="mx-auto w-full max-w-6xl px-6">
          <Card className="border-border/70 bg-white/95 shadow-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl text-foreground">
                Pourquoi ces 7 piliers ?
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Les investisseurs recherchent un modèle intégré : Auto Nexus BJ
                combine l’acquisition de véhicules avec les services dérivés à forte
                marge (pièces, lubrifiants, assurances). Chaque pilier dispose d’un
                responsable marketplace et de KPIs dédiés (GMV, leads, conversion).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Onboarding concessionnaires & ateliers",
                "Qualité photo & contenu premium",
                "Lead scoring (WhatsApp, appels, formulaires)",
                "Upsell services (financement, pièces, livraison)",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-dashed border-brand/30 bg-brand/5 p-4 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection
          delay={0.05}
          className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-2"
        >
          {services.map((pillar, index) => (
            <Card
              key={pillar.id}
              className="border-border/70 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center justify-between text-lg text-foreground">
                  <span>{pillar.title}</span>
                  <Badge variant="secondary">{index + 1}</Badge>
                </CardTitle>
                <CardDescription>{pillar.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {pillar.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pillar.partners.map((partner) => (
                    <Badge key={partner} variant="outline">
                      {partner}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-border/60 bg-muted/20 p-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>Plan opérationnel prêt</span>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={buildWhatsappLink(
                      "95606058",
                      `Bonjour Auto Nexus BJ, intéressé par le pilier ${pillar.title}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Parler partenaires
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </AnimatedSection>

        <AnimatedSection className="mx-auto w-full max-w-6xl px-6">
          <div className="grid gap-6 rounded-3xl border border-border bg-white/95 p-8 shadow-lg lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Un guichet unique pour investisseurs & concessionnaires
              </h2>
              <p className="text-base text-muted-foreground">
                La roadmap inclut un cockpit reporting (GMV, leads, marge services),
                un module CRM intégré et la possibilité de déployer des campagnes
                marketing pilotées par Auto Nexus BJ.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Tableaux de bord Vercel Analytics + LogSnag</li>
                <li>• Tracking conversions WhatsApp & appels</li>
                <li>• Automations email/SMS pour relances leads</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-brand">
                Phase suivante
              </p>
              <p className="text-sm text-muted-foreground">
                Bookez une session pour découvrir le prototype complet (dashboard,
                comparateur, modules admin).
              </p>
              <Button asChild>
                <Link
                  href={buildWhatsappLink(
                    "95606058",
                    "Je souhaite réserver la session de démonstration complète Auto Nexus BJ.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book démo complète
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
}
