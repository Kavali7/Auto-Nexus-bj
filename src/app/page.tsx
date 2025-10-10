import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { AnimatedSection } from "@/components/animated-section";
import { VehicleMasonry } from "@/components/vehicle-masonry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getDealers, getFeaturedVehicles, getVehicles, services } from "@/data";
import { formatMileage, formatPriceXof } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";

const vehiclesDataset = getVehicles();
const dealersDataset = getDealers();
const highlightedVehicles = getFeaturedVehicles();

const totalInventoryValue = vehiclesDataset.reduce(
  (sum, vehicle) => sum + vehicle.price,
  0,
);

const averageMileage = vehiclesDataset.length
  ? Math.round(
      vehiclesDataset.reduce(
        (sum, vehicle) => sum + vehicle.mileage,
        0,
      ) / vehiclesDataset.length,
    )
  : 0;

const stats = [
  {
    label: "Vehicules mockes",
    value: vehiclesDataset.length.toString().padStart(2, "0"),
    hint: "Selection photo ready pour le comparateur",
  },
  {
    label: "Concessionnaires pilotes",
    value: dealersDataset.length.toString().padStart(2, "0"),
    hint: "Partenaires a brancher sur Supabase",
  },
  {
    label: "Valeur stock simulee",
    value: formatPriceXof(totalInventoryValue),
    hint: "Base GMV pour les premiers reportings",
  },
  {
    label: "Kilometrage moyen",
    value: formatMileage(averageMileage),
    hint: "Reference pour affiner la segmentation",
  },
];

const heroPillars = [
  "Comparer les stocks multi-concessionnaires en un seul endroit.",
  "Livrer une galerie masonry immersive avec badges et stats.",
  "Diriger chaque lead vers WhatsApp, l'appel ou un formulaire.",
];

const roadmapTabs = [
  {
    value: "catalogue",
    label: "Catalogue live",
    description:
      "Ce que le front doit prouver avant la connexion a Supabase.",
    items: [
      "Hero dynamique + statistiques calculees a partir des mocks.",
      "Composant VehicleMasonry responsive alimente par le dataset.",
      "Fiches vehicule et comparateur relies aux memes donnees.",
    ],
  },
  {
    value: "workflow",
    label: "Workflow equipe",
    description: "Process quand la base sera branchee.",
    items: [
      "Dashboard concessionnaire pour deposer les annonces et photos.",
      "Back-office interne pour valider, mettre en avant ou archiver.",
      "Notifications et relances via WhatsApp ou email transactionnel.",
    ],
  },
  {
    value: "phase2",
    label: "Phase 2",
    description: "Objectifs une fois l'infra Supabase/Prisma en place.",
    items: [
      "Recherche temps reel Meilisearch + filtres facettes.",
      "Uploads signes vers Supabase Storage avec traitement automatique.",
      "Deck investisseurs et exports data-room generees depuis la console.",
    ],
  },
];

const dealerSpotlight = dealersDataset.slice(0, 3);
const serviceShowcase = services.slice(0, 3);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Auto Nexus BJ",
  url: "https://autonexus.bj",
  description:
    "Marketplace auto premium pour comparer, visualiser et contacter les concessionnaires du Benin.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BJ",
  },
  makesOffer: vehiclesDataset.slice(0, 3).map((vehicle) => ({
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
};

export const metadata: Metadata = {
  title: "Auto Nexus BJ - MVP landing",
  description:
    "Landing statique Next.js pour prefigurer la marketplace Auto Nexus BJ et preparer la connexion a Supabase.",
};

export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="flex flex-1 flex-col">
        <Script
          id="auto-nexus-bj-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent">
          <AnimatedSection className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
              <div className="space-y-8">
                <Badge className="w-fit bg-brand/15 text-brand">
                  Sprint MVP
                </Badge>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    Marketplace auto premium pour le Benin
                  </h1>
                  <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                    Prototype Next.js + Tailwind destine a convaincre les
                    concessionnaires pilotes, roder le parcours lead et poser la
                    base technique avant de brancher Supabase, Prisma et Meilisearch.
                  </p>
                </div>
                <div className="grid gap-4">
                  {heroPillars.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-xl border border-border bg-white/90 p-4 shadow-sm"
                    >
                      <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                      <p className="text-sm font-medium text-foreground sm:text-base">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg">Consulter la roadmap</Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#stack">Explorer la stack</Link>
                  </Button>
                </div>
              </div>
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
                  <Image
                    src="/brand/anx-logo.png"
                    alt="Auto Nexus BJ preview"
                    fill
                    className="object-cover opacity-30"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-5 text-sm text-muted-foreground shadow-lg backdrop-blur">
                    <p>
                      Objectif: transformer ce MVP statique en experience totalement
                      connectee ou les annonces, photos et leads des partenaires
                      vivent en temps reel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <Card
                  key={item.label}
                  className="border-border/70 bg-white/90 shadow-sm"
                >
                  <CardHeader className="space-y-1 pb-2">
                    <CardTitle className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </CardTitle>
                    <p className="text-2xl font-semibold text-foreground sm:text-3xl">
                      {item.value}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs text-muted-foreground">
                      {item.hint}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </section>

        <section
          id="gallery"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Mur photo immersif
              </h2>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Apercu du rendu masonry avec les vehicules vedettes. Chaque carte
                recupere les badges, la ville, le prix en XOF et jusqu a trois
                highlights.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/voitures">Voir le listing complet</Link>
            </Button>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <VehicleMasonry items={highlightedVehicles} />
          </AnimatedSection>
        </section>

        <section
          id="stack"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Stack et prochaines etapes
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              On garde les mocks pour l&apos;instant, mais toute la structure vise a
              accueillir Supabase, Prisma et un vrai flux d&apos;upload photo.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.05}>
            <Tabs defaultValue="catalogue" className="w-full">
              <TabsList className="grid w-full gap-2 sm:grid-cols-3">
                {roadmapTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {roadmapTabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <Card className="border-border/70 bg-white/95 shadow-sm">
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-lg text-foreground">
                        {tab.label}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {tab.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid gap-3 text-sm text-muted-foreground">
                        {tab.items.map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                            <span>{point}</span>
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
          id="dealers"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Concessionnaires pilotes
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Trois partenaires maquettes pour lancer les discussions. Le back-office
              prendra la releve pour activer le reste du reseau.
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.05}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {dealerSpotlight.map((dealer) => (
              <Card
                key={dealer.id}
                className="flex h-full flex-col border-border/80 bg-white/90 shadow-sm"
              >
                <CardHeader className="space-y-2 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg text-foreground">
                      {dealer.name}
                    </CardTitle>
                    {dealer.rating ? (
                      <Badge variant="secondary">
                        {dealer.rating.toFixed(1)} / 5
                      </Badge>
                    ) : null}
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {dealer.headline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  {dealer.specialties?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {dealer.specialties.slice(0, 3).map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="outline"
                          className="border-border/60"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{dealer.city}</p>
                    {dealer.address ? <p>{dealer.address}</p> : null}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {dealer.whatsapp ? (
                      <Button asChild size="sm">
                        <Link
                          href={buildWhatsappLink(
                            dealer.whatsapp,
                            "Bonjour, je suis interesse par vos vehicules sur Auto Nexus BJ.",
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </Link>
                      </Button>
                    ) : null}
                    {dealer.phone ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`tel:${dealer.phone}`}>Appeler</Link>
                      </Button>
                    ) : null}
                    {dealer.website ? (
                      <Button asChild size="sm" variant="ghost">
                        <Link
                          href={dealer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Site web
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </AnimatedSection>
        </section>

        <section
          id="services"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Piliers services
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Chaque pilier deviendra une page service, alimentee par Supabase et
              partageable depuis la console.
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.05}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {serviceShowcase.map((service) => (
              <Card
                key={service.id}
                className="border-border/70 bg-white/95 shadow-sm"
              >
                <CardHeader className="space-y-2">
                  <Badge variant="outline" className="w-fit border-border/60">
                    {service.subtitle}
                  </Badge>
                  <CardTitle className="text-lg text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>{service.description}</p>
                  {service.partners?.length ? (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Partenaires
                      </p>
                      <ul className="grid gap-1">
                        {service.partners.slice(0, 4).map((partner) => (
                          <li key={partner}>{partner}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </AnimatedSection>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 pb-20">
          <AnimatedSection className="rounded-3xl border border-border bg-white/95 p-10 text-center shadow-lg">
            <div className="space-y-4">
              <Badge className="bg-brand text-brand-foreground">
                Prochaine etape
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Brancher Supabase et lancer les premiers leads reels
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                Le code est pret a recevoir le schema Prisma, les migrations et le
                flux upload signe. Une fois le projet Supabase cree, on pousse les
                migrations et on connecte la page a de vraies donnees.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" asChild>
                  <Link href="mailto:launch@autonexus.bj">
                    Planifier l&apos;atelier d&apos;onboarding
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="https://wa.me/95606058" target="_blank" rel="noopener noreferrer">
                    Discuter sur WhatsApp
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </div>
    </div>
  );
}
