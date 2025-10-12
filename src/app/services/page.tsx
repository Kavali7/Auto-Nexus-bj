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
import { Input } from "@/components/ui/input";
import { services, getDealers } from "@/data";
import { buildWhatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Services Auto Nexus BJ",
  description:
    "Les 7 piliers services Auto Nexus BJ : vehicules neufs, entretien, pieces, lubrifiants, financement, location et logistique.",
};

const dealersDataset = getDealers();

const heroStats = [
  {
    label: "Partenaires actifs",
    value: services.reduce((total, item) => total + item.partners.length, 0),
  },
  {
    label: "Concessionnaires connectes",
    value: dealersDataset.length,
  },
  {
    label: "Piliers equipes",
    value: services.length,
  },
];

const timelineSteps = [
  {
    title: "Semaine 1",
    caption: "Audit parc et contenu",
    details: "Shooting, inventaire, conformite WhatsApp Business et mise en place des gabarits.",
  },
  {
    title: "Semaine 2",
    caption: "Mise en ligne controlee",
    details: "Publication des annonces, tagging des services (financement, livraison, entretien) et checklist QA.",
  },
  {
    title: "Semaine 3",
    caption: "Activation marketing",
    details: "Campagnes social ads, SMS et email avec scoring leads, suivi dans le tableau de bord concessionnaire.",
  },
  {
    title: "Semaine 4",
    caption: "Reporting et upsell",
    details: "Analyse GMV, taux de conversion, chantiers upsell (pieces, lubrifiants, assurance) avec plan d action.",
  },
];

const faqItems = [
  {
    question: "Comment les leads sont-ils distribues ?",
    answer:
      "Chaque pilier route les leads vers WhatsApp, email et hotline. Un suivi automatique journalier resume la source, le budget et la maturite.",
  },
  {
    question: "Quel est le modele economique ?",
    answer:
      "Abonnement mensuel concessionnaire, commission sur ventes dotee d un plafond, et marge sur services (shooting, logistique, financement).",
  },
  {
    question: "Quelles integrations sont prevues ?",
    answer:
      "Supabase pour la base de donnees, Prisma pour les schemas, Meilisearch pour la recherche, et passerelles paiement/assurance a l etape 2.",
  },
  {
    question: "Peut-on piloter plusieurs sites ?",
    answer:
      "Oui, la console admin gere plusieurs marques. Chaque pilier possede ses KPI (GMV, leads, taux d activation) exposes dans le reporting.",
  },
];

export default function ServicesPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent py-16">
        <AnimatedSection className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-brand">
              Vision marketplace 360
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Les 7 piliers services Auto Nexus BJ
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Du sourcing a la livraison, chaque pilier organise les offres partenaires, les campagnes marketing et le reporting pour convaincre investisseurs et concessionnaires.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/investisseurs">Voir la demo investisseur</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link
                  href={buildWhatsappLink(
                    "95606058",
                    "Bonjour Auto Nexus BJ, je souhaite planifier une presentation services.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Prendre un call WhatsApp
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
                Auto Nexus BJ combine l acquisition de vehicules, les services a forte marge et un suivi unifie (GMV, leads, satisfaction). Chaque pilier a ses owners, ses SLA et son plan de monetisation.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Onboarding concessionnaires et ateliers partenaires",
                "Qualite photo et contenu premium multi-supports",
                "Lead scoring (WhatsApp, appels, formulaires)",
                "Upsell services (financement, pieces, livraison)",
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
                <span>Pilotage pret</span>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={buildWhatsappLink(
                      "95606058",
                      `Bonjour Auto Nexus BJ, interess(e) par le pilier ${pillar.title}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Echanger
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </AnimatedSection>

        <AnimatedSection className="mx-auto w-full max-w-6xl px-6">
          <Card className="border-border/70 bg-white/95 shadow-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl text-foreground">
                Timeline activation marketplace
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Un mois pour publier le parc, activer les services et deployer les campagnes co-brandées.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-6 md:grid-cols-2">
                {timelineSteps.map((step) => (
                  <li
                    key={step.title}
                    className="rounded-xl border border-dashed border-brand/30 bg-brand/5 p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-brand">
                      {step.title}
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {step.caption}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{step.details}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection className="mx-auto w-full max-w-6xl px-6">
          <div className="grid gap-6 rounded-3xl border border-border bg-white/95 p-8 shadow-lg lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Un guichet unique pour investisseurs et concessionnaires
              </h2>
              <p className="text-base text-muted-foreground">
                Reporting GMV, gestion des leads, campagnes marketing et modules admin: tout est centralise pour partager des indicateurs fiables.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tableaux de bord Vercel Analytics et LogSnag</li>
                <li>Tracking conversions WhatsApp, appels et formulaires</li>
                <li>Automations email/SMS pour relances leads</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-brand">
                Phase suivante
              </p>
              <p className="text-sm text-muted-foreground">
                Reservez une session pour parcourir le prototype complet (dashboard, comparateur, modules admin).
              </p>
              <Button asChild>
                <Link
                  href={buildWhatsappLink(
                    "95606058",
                    "Je souhaite reserver la session de demonstration complete Auto Nexus BJ.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reserver la demo
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection
          delay={0.05}
          className="mx-auto w-full max-w-6xl space-y-8 px-6"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Questions frequentes
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Ce module sera branche sur le CMS pour gerer des FAQs dynamiques par pilier.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <Card key={item.question} className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg text-foreground">
                    {item.question}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {item.answer}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection
          delay={0.05}
          className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-2"
        >
          <Card className="border-border/70 bg-white/95 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle>Formulaire concessionnaire</CardTitle>
              <CardDescription>
                Simule l envoi vers Supabase (table leads) avec segmentation pilier dominante.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" action="#" method="post">
                <Input name="dealer-name" placeholder="Nom de la concession" required />
                <Input name="dealer-contact" placeholder="Contact principal" required />
                <Input
                  name="dealer-pilier"
                  placeholder="Pilier prioritaire (ex: Neufs, Financement...)"
                  required
                />
                <textarea
                  name="dealer-message"
                  placeholder="Volume mensuel, besoins specifiques..."
                  className="min-h-[120px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                />
                <Button type="submit" className="w-full">
                  Envoyer ma demande
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-white/95 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle>Formulaire investisseur</CardTitle>
              <CardDescription>
                Capture les attentes sur la data-room, le deck et les indicateurs financiers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" action="#" method="post">
                <Input name="investor-name" placeholder="Nom et societe" required />
                <Input name="investor-email" type="email" placeholder="Email professionnel" required />
                <Input
                  name="investor-ticket"
                  placeholder="Montant envisage (XOF)"
                />
                <textarea
                  name="investor-message"
                  placeholder="Focus: GMV, rentabilite, roadmap produit..."
                  className="min-h-[120px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                />
                <Button type="submit" className="w-full" variant="outline">
                  Recevoir le deck
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </main>
    </div>
  );
}
