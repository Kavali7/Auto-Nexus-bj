import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { AnimatedSection } from "@/components/animated-section";
import { VehicleMasonry } from "@/components/vehicle-masonry";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { dealers, services, vehicles, getFeaturedVehicles } from "@/data";
import { buildWhatsappLink } from "@/lib/whatsapp";

const pillars = [
  "Comparer rapidement les offres multi-concessionnaires",
  "Plonger dans des galeries photos immersives",
  "Contacter en un clic (WhatsApp, appel, demande d'offre)",
];

const visionCards = [
  {
    title: "Audience",
    description:
      "Particuliers et pros au Bénin. Français par défaut, anglais en option, tarification en XOF.",
  },
  {
    title: "Objectif",
    description:
      "Montrer la même voiture chez plusieurs vendeurs, 12-20 photos HD, expérience fluide, lead en 1 clic.",
  },
  {
    title: "Expérience",
    description:
      "Hero immersif, masonry photo wall, CTA WhatsApp flottant et transitions premium adaptées au mobile.",
  },
];

const stats = [
  {
    label: "Annonces premium mockées",
    value: vehicles.length,
  },
  {
    label: "Concessionnaires onboardés",
    value: dealers.length,
  },
  {
    label: "Piliers services",
    value: services.length,
  },
];

const stackTabs = [
  {
    value: "frontend",
    label: "Front & UI",
    description:
      "Base Next.js 15 + Tailwind 4 + shadcn/ui, prête pour du contenu statique et une transition vers Supabase.",
    items: [
      "Next.js 15 App Router, métas structurées, SEO ready",
      "Tailwind CSS 4 avec tokens Auto Nexus BJ et dark mode anticipé",
      "shadcn/ui (button/card/badge/tabs) pour un design system modulable",
      "Framer Motion en option pour animations (à installer pendant l'intégration)",
    ],
  },
  {
    value: "backlog",
    label: "Backlog Phase 2+",
    description:
      "Préparation pour les features dynamiques : base data, recherche, médias et analytics.",
    items: [
      "Supabase (Postgres + Auth) + Prisma pour la persistance",
      "Supabase Storage pour upload (transformations via pipeline externe, WebP/AVIF, blur-up)",
      "Meilisearch pour la recherche instantanée et filtres vivants",
      "Sentry + Vercel Analytics pour suivi qualité et conversion",
    ],
  },
];

const investorHighlights = [
  {
    title: "GMV cible 12 mois",
    metric: "2,5 Mds XOF",
    description:
      "Projection basée sur 4 concessionnaires pilotes et 350 leads qualifiés par mois.",
  },
  {
    title: "Monétisation services",
    metric: "35% marge",
    description:
      "Shooting premium, marketing co-brandé, financement et logistique livrée.",
  },
  {
    title: "Lead-to-sale attendu",
    metric: "18%",
    description:
      "Grâce à WhatsApp + CRM léger et relances automatisées (phase 2).",
  },
];

const homepageVehicles = getFeaturedVehicles();

export const metadata: Metadata = {
  title: "Auto Nexus BJ — Marketplace auto premium (MVP statique)",
  description:
    "Prototype Next.js + Tailwind pour Auto Nexus BJ : UI premium, filtres mock Meilisearch, comparateur et pitch investisseurs.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="flex flex-1 flex-col">
        <Script
          id="auto-nexus-bj-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              name: "Auto Nexus BJ",
              url: "https://autonexus.bj",
              address: {
                "@type": "PostalAddress",
                addressCountry: "BJ",
              },
              description:
                "Marketplace auto premium pour comparer, visualiser et contacter les concessionnaires du Bénin.",
              areaServed: {
                "@type": "Country",
                name: "Bénin",
              },
              makesOffer: vehicles.slice(0, 3).map((vehicle) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Vehicle",
                  brand: vehicle.brand,
                  model: vehicle.model,
                  vehicleModelDate: vehicle.year,
                  fuelType: vehicle.fuel,
                  vehicleTransmission: vehicle.transmission,
                },
                priceCurrency: "XOF",
                price: vehicle.price,
                availability: vehicle.available
                  ? "https://schema.org/InStock"
                  : "https://schema.org/PreOrder",
              })),
            }),
          }}
        />
        <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent">
          <AnimatedSection className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:py-24">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                MVP vision
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Marketplace auto au Bénin
              </h1>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                On pose la base du prototype Auto Nexus BJ : données statiques,
                UI premium et parcours WhatsApp instantané pour impressionner
                partenaires et concessionnaires dès la phase 1.
              </p>
              <div className="grid gap-3">
                {pillars.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-md border border-border bg-white/90 p-4 shadow-sm"
                  >
                    <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand" />
                    <p className="text-sm font-medium text-foreground sm:text-base">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg">Voir la roadmap</Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#stack">Explorer la stack</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border bg-white/80 px-4 py-3 shadow-sm sm:px-5 sm:py-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {item.value.toString().padStart(2, "0")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
                <Image
                  src="/brand/anx-logo.png"
                  alt="Vision Auto Nexus BJ"
                  fill
                  className="object-cover opacity-20"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 text-sm text-muted-foreground shadow-lg backdrop-blur">
                  <p>
                    À venir : mur photo immersif, listing filtré en temps réel,
                    fiches comparatives détaillées, pages services partenaires,
                    dashboard concessionnaires avec validation admin.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section
          id="gallery"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Mur photo immersif
              </h2>
              <p className="mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
                Preview du rendu masonry : 6 véhicules stars, mélange de neufs &
                occasions, visuels héro et highlights par annonce. Objectif :
                susciter le “wow” dès l’accueil.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/voitures">Accéder au listing complet</Link>
            </Button>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <VehicleMasonry items={homepageVehicles} />
          </AnimatedSection>
        </section>

        <section
          id="vision"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Vision produit
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Ce MVP statique sert de vitrine : data dummy, mais storytelling
              premium pour valider UX, arborescence et besoins des partenaires.
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.1}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {visionCards.map((item) => (
              <Card
                key={item.title}
                className="border-border/80 bg-white/85 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="space-y-3">
                  <CardTitle className="text-lg text-foreground">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </AnimatedSection>
        </section>

        <section
          id="stack"
          className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Stack ciblée
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Next.js (App Router) + Tailwind + shadcn/ui pour le front. Supabase
              + Prisma pour la data, Supabase Storage pour l’image, Meilisearch pour la
              recherche. Monitoring Vercel + Sentry, auth NextAuth.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <Tabs defaultValue="frontend" className="w-full">
              <TabsList className="mb-6 grid w-full max-w-xl grid-cols-2">
                {stackTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
              ))}
            </TabsList>
            {stackTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card className="border-border/80 bg-white/90 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      {tab.label}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {tab.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {tab.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          </AnimatedSection>
        </section>

        <section
          id="services"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                7 piliers services Auto Nexus BJ
              </h2>
              <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
                Maintenance, pièces, lubrifiants, financement, logistique…
                chaque pilier a ses partenaires identifiés. Ces contenus seront
                alimentés par CMS pour garder les logos & contacts à jour.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/services">Voir le plan de page</Link>
            </Button>
          </AnimatedSection>
          <AnimatedSection
            delay={0.1}
            className="grid gap-6 md:grid-cols-2"
          >
            {services.map((pillar) => (
              <Card
                key={pillar.id}
                className="border-border/80 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    {pillar.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {pillar.subtitle}
                  </CardDescription>
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
              </Card>
            ))}
          </AnimatedSection>
        </section>

        <section
          id="dealers"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Concessionnaires onboardés
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Chaque dealer dispose d’une vitrine dédiée, inventaire, leads
              WhatsApp, et accès dashboard (Phase 1). Voici la sélection mockée
              livrable en démo.
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.1}
            className="grid gap-6 md:grid-cols-2"
          >
            {dealers.map((dealer) => {
              const whatsappLink = buildWhatsappLink(
                dealer.whatsapp,
                `Bonjour ${dealer.name},\nJe souhaite en savoir plus sur votre inventaire Auto Nexus BJ.`,
              );
              return (
                <Card
                  key={dealer.id}
                  className="flex h-full flex-col border-border/80 bg-white/95 shadow-sm"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      {dealer.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {dealer.headline}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{dealer.city}</Badge>
                      <Badge variant="outline">
                        {dealer.rating.toFixed(1)} ★ ({dealer.ratingCount})
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {dealer.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {dealer.specialties.map((item) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto flex flex-wrap gap-3 border-t border-border/80 bg-muted/30 p-4">
                    <Button asChild size="sm">
                      <Link href={`/concessionnaires/${dealer.slug}`}>
                        Voir la vitrine
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp
                      </Link>
                    </Button>
                    {dealer.phone ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`tel:${dealer.phone}`}>Appeler</Link>
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              );
            })}
          </AnimatedSection>
        </section>

        <section
          id="investisseurs"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Pourquoi investir maintenant ?
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Nous réunissons déjà les partenaires clés et les workflows. Ce MVP statique sert de
              base tangible pour sécuriser le tour d’amorçage et accélérer les intégrations (Supabase,
              Supabase Storage, Meilisearch).
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.05}
            className="grid gap-6 md:grid-cols-3"
          >
            {investorHighlights.map((item) => (
              <Card
                key={item.title}
                className="border-border/70 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="space-y-2">
                  <CardTitle className="text-sm uppercase tracking-[0.18em] text-brand">
                    {item.title}
                  </CardTitle>
                  <p className="text-3xl font-semibold text-foreground">
                    {item.metric}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="grid gap-6 rounded-3xl border border-border bg-white/95 p-8 shadow-lg lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Prochaine étape : deck investisseur & KPIs live
                </h3>
                <p className="text-sm text-muted-foreground">
                  Plan : finaliser le dashboard investisseurs (GMV, lead-to-sale, marges) et ouvrir
                  le tour pre-seed dès validation MVP. Accès démo guidée disponible immédiatement.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-brand">
                  Pitch & data-room
                </p>
                <p className="text-sm text-muted-foreground">
                  Recevez le pitch deck + projections financières et plan d’exécution (6, 12, 24 mois).
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link
                      href="https://wa.me/22962459012?text=Je%20souhaite%20acc%C3%A9der%20au%20deck%20investisseur%20Auto%20Nexus%20BJ"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Demander le deck
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="mailto:invest@autonexus.bj">Fixer un rendez-vous</Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section
          id="pages"
          className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Arborescence prévue
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              On prépare toutes les pages clés : accueil immersif, listing,
              fiches véhicules, comparateur, annuaire concessionnaires, services
              et dashboard.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Accueil", description: "Hero sobre, recherche transversale, masonry photo wall, sections Neufs / Dernières arrivées / Partenaires." },
              { title: "Voitures", description: "Listing + filtres vivants (marque, modèle, année, prix, ville, énergie, kilométrage, disponibilité)." },
              { title: "Fiche véhicule", description: "Galerie 12–20 photos, spécifications, historique, garanties, CTA WhatsApp/Appel/Formulaire." },
              { title: "Comparer", description: "Jusqu’à 4 véhicules côte à côte, mini-galeries, focus sur différences prix/disponibilité." },
              { title: "Concessionnaires", description: "Annuaire + page vitrine par concessionnaire avec inventaire et coordonnées dédiées." },
              { title: "Services & Dashboard", description: "Pages services (7 piliers), espace concessionnaire (CRUD annonces) et admin (validation/modération)." },
            ].map((item) => (
              <Card
                key={item.title}
                className="border-border/80 bg-white/85 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
