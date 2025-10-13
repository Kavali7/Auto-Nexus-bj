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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services } from "@/data";
import { formatMileage, formatPriceXof } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { getDealers } from "@/server/dealers";
import { getFeaturedVehicles, getVehicles } from "@/server/vehicles";
import type { VehicleSummary } from "@/types/catalog";

type FeaturedVehicleSliderProps = {
  vehicles: VehicleSummary[];
};

function FeaturedVehicleSlider({
  vehicles,
}: FeaturedVehicleSliderProps): JSX.Element | null {
  if (vehicles.length === 0) {
    return null;
  }

  return (
    <div className="group relative">
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:pb-6">
        {vehicles.map((vehicle) => {
          const whatsappMessage = `Bonjour Auto Nexus BJ, je suis interesse(e) par ${vehicle.brand} ${vehicle.model}.`;

          return (
            <div
              key={vehicle.id}
              className="snap-start"
              style={{ minWidth: "280px", maxWidth: "320px" }}
            >
              <Card className="h-full overflow-hidden border-border/70 bg-white/95 shadow-md">
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={vehicle.heroImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 33vw, 280px"
                    priority={vehicle.featured}
                  />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <Badge
                      variant={vehicle.condition === "Neuf" ? "default" : "secondary"}
                      className="bg-white/85 text-foreground shadow"
                    >
                      {vehicle.condition}
                    </Badge>
                    <Badge variant="outline" className="border-white/60 bg-black/60 text-white">
                      {vehicle.year}
                    </Badge>
                  </div>
                </div>
                <CardContent className="flex flex-col gap-3 p-5">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                      {vehicle.city}
                    </div>
                    <CardTitle className="text-lg text-foreground">
                      {vehicle.brand} {vehicle.model}
                    </CardTitle>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {formatPriceXof(vehicle.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.fuel} - {vehicle.transmission} - {formatMileage(vehicle.mileage)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href={`/voitures/${vehicle.slug}`}>Voir la fiche</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={buildWhatsappLink("95606058", whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
const heroHighlights = [
  "48 vehicules premium maquettent la marketplace et ses filtres.",
  "Stats live: valeur stock mock, leads WhatsApp, partenaires pilotes.",
  "CTA unifie: demo investisseurs, WhatsApp direct et roadmap produit.",
];

const roadmapTabs = [
  {
    value: "catalogue",
    label: "Catalogue live",
    description: "Ce que le front doit prouver avant la connexion a Supabase.",
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

const testimonials = [
  {
    name: "Nexus Premium",
    role: "Concessionnaire pilote",
    quote:
      "Nous gagnons 48h sur nos cycles de publication et le comparateur met immediatement en valeur nos shootings studio.",
  },
  {
    name: "AutoHub Abomey-Calavi",
    role: "Equipe commerciale",
    quote:
      "Les leads WhatsApp arrivent qualifies : modele, budget et ville sont deja renseignes. Parfait pour notre CRM.",
  },
  {
    name: "Equity Motors",
    role: "Direction operations",
    quote:
      "La roadmap investors deck + data-room nous aide a cadrer les discussions avec les partenaires financiers.",
  },
];

const fieldTestimonials = [
  {
    name: "Samira Bello",
    role: "Responsable marketing, AutoHub BJ",
    quote:
      "Le mini-site nous a permis de centraliser les offres premium et de lancer des campagnes WhatsApp en moins de 48h.",
    result: "32 leads qualifies en 3 semaines",
  },
  {
    name: "Gildas Azon",
    role: "Directeur commercial, Nexus Premium",
    quote:
      "Nous avons plugge nos fiches produits et obtenu un canal unique pour les demonstrations live avec les prospects fleet.",
    result: "Taux de conversion demo x2",
  },
  {
    name: "Elodie Kora",
    role: "Operations, Equity Motors",
    quote:
      "Les reportings partages avec les investisseurs reprennent enfin des chiffres homogenes entre GMV, leads et disponibilite stock.",
    result: "Reporting investor pret en 24h",
  },
];

const partnerLogos = [
  "Nexus Premium",
  "AutoHub BJ",
  "Equity Motors",
  "Transafrica Leasing",
  "Benin Auto Alliance",
  "FleetPro Services",
];

const productTimeline = [
  {
    title: "Semaine 1",
    caption: "Connexion donnees mock",
    detail: "Synchro Supabase, mapping Prisma et reprise des listings pilotes.",
  },
  {
    title: "Semaine 2",
    caption: "Meilisearch + media",
    detail: "Indexation recherche, scoring photo et workflows upload signes.",
  },
  {
    title: "Semaine 3",
    caption: "Comparateur live",
    detail: "Parcours multi-vehicules, favoris et generation PDF partagable.",
  },
  {
    title: "Semaine 4",
    caption: "Console analytics",
    detail: "Dashboard leads, GMV et automations pour les follow-up demo.",
  },
];

const deploymentPlan = [
  "Audit express du parc et des KPIs attendus par le board.",
  "Configuration sandbox Supabase et reprise des comptes WhatsApp.",
  "Script demo guide: comparateur, services et console reporting.",
  "Boucle de suivi sous 7 jours avec chiffres et prochaines etapes.",
];

export const metadata: Metadata = {
  title: "Auto Nexus BJ - MVP landing",
  description:
    "Landing statique Next.js pour prefigurer la marketplace Auto Nexus BJ et preparer la connexion a Supabase.",
};

export default async function Home(): Promise<JSX.Element> {
  const [vehicles, dealers, featuredVehicles] = await Promise.all([
    getVehicles(),
    getDealers(),
    getFeaturedVehicles(6),
  ]);

  const heroVehicle = featuredVehicles[0];

  const totalInventoryValue = vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0);

  const averageMileage = vehicles.length
    ? Math.round(
        vehicles.reduce((sum, vehicle) => sum + vehicle.mileage, 0) / vehicles.length,
      )
    : 0;

  const stats = [
    {
      label: "Vehicules mockes",
      value: vehicles.length.toString().padStart(2, "0"),
      hint: "Selection photo ready pour le comparateur",
    },
    {
      label: "Concessionnaires pilotes",
      value: dealers.length.toString().padStart(2, "0"),
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

  const dealerSpotlight = dealers.slice(0, 3);
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
      priceCurrency: vehicle.currency ?? "XOF",
      price: vehicle.price,
      availability: vehicle.available
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    })),
  };

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
                <Badge className="w-fit bg-brand/15 text-brand">MVP connectable</Badge>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    Auto Nexus BJ, marketplace auto premium du Benin
                  </h1>
                  <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                    Nous orchestrons le hub multi-concessionnaires : shootings studio,
                    metrics demo et parcours lead centralise. Branchez Supabase/Prisma et
                    la plateforme collecte instantanement des leads reels.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <Badge variant="outline" className="border-border/70">
                    48 vehicules mock
                  </Badge>
                  <Badge variant="outline" className="border-border/70">
                    KPI demo investors
                  </Badge>
                  <Badge variant="outline" className="border-border/70">
                    Supabase ready
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {heroHighlights.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-xl border border-border bg-white/90 p-4 shadow-sm"
                    >
                      <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                      <p className="text-sm font-medium text-foreground sm:text-base">{point}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/investisseurs">Planifier une demo</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link
                      href="https://wa.me/95606058?text=Je%20veux%20voir%20la%20demo%20Auto%20Nexus%20BJ"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp direct
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost">
                    <Link href="#roadmap">Voir la roadmap</Link>
                  </Button>
                </div>
              </div>
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
                  {heroVehicle ? (
                    <Image
                      src={heroVehicle.heroImage}
                      alt={`${heroVehicle.brand} ${heroVehicle.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <Image
                      src="/brand/anx-logo.png"
                      alt="Auto Nexus BJ"
                      fill
                      className="object-contain opacity-40"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand/45 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-5 text-sm text-muted-foreground shadow-lg backdrop-blur">
                    {heroVehicle ? (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-brand">
                          Selection du moment
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-foreground">
                          <strong>
                            {heroVehicle.brand} {heroVehicle.model}
                          </strong>
                          <span className="text-sm font-semibold">
                            {formatPriceXof(heroVehicle.price)}
                          </span>
                        </div>
                        <p>
                          {heroVehicle.city} - {heroVehicle.fuel} - {formatMileage(heroVehicle.mileage)}
                        </p>
                      </div>
                    ) : (
                      <p>
                        Objectif: transformer ce MVP statique en experience connectee ou annonces et leads
                        vivent en temps reel.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <Card key={item.label} className="border-border/70 bg-white/90 shadow-sm">
                  <CardHeader className="space-y-1 pb-2">
                    <CardTitle className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </CardTitle>
                    <p className="text-2xl font-semibold text-foreground sm:text-3xl">
                      {item.value}
                    </p>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{item.hint}</CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </section>

        <section
          id="temoignages"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Temoignages terrain
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Des retours concrets sur les premieres sessions demo: activation WhatsApp,
              reporting unifie et confiance investisseurs.
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.05}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {fieldTestimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="border-border/70 bg-white/95 p-6 shadow-sm"
              >
                <div className="flex h-full flex-col gap-4">
                  <Badge variant="outline" className="w-fit border-brand/40 text-brand">
                    {testimonial.result}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-auto space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </AnimatedSection>
        </section>

        <section id="partenaires" className="mx-auto w-full max-w-6xl px-6 pb-16">
          <AnimatedSection className="rounded-3xl border border-dashed border-brand/30 bg-brand/5 p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="space-y-2 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-brand">
                  Reseau pilote
                </p>
                <p className="text-base text-muted-foreground">
                  Les marques deja engagees sur les demos et les tests de parcours lead.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {partnerLogos.map((partner) => (
                  <div
                    key={partner}
                    className="rounded-2xl border border-brand/20 bg-white/95 px-4 py-3 text-center text-sm font-medium text-foreground shadow-sm"
                  >
                    {partner}
                  </div>
                ))}
              </div>
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
                Apercu du rendu masonry avec les vehicules vedettes. Chaque carte recupere
                les badges, la ville, le prix en XOF et jusqu a trois highlights.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/voitures">Voir le listing complet</Link>
            </Button>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <VehicleMasonry items={featuredVehicles} dealers={dealers} />
          </AnimatedSection>
        </section>

        <section
          id="roadmap"
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
          id="timeline-produit"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Timeline produit
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Quatre semaines pour passer du MVP statique a une experience demo complete,
              connectee et partageable.
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.05}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {productTimeline.map((step) => (
              <Card key={step.title} className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader className="space-y-3">
                  <Badge variant="secondary" className="w-fit bg-brand/15 text-brand">
                    {step.title}
                  </Badge>
                  <CardTitle className="text-lg text-foreground">
                    {step.caption}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {step.detail}
                  </CardDescription>
                </CardHeader>
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
                      <Badge variant="secondary">{dealer.rating.toFixed(1)} / 5</Badge>
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
              <Card key={service.id} className="border-border/70 bg-white/95 shadow-sm">
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

        <section
          id="investisseurs"
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16"
        >
          <AnimatedSection className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Temoignages pilotes
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Les premiers partenaires valident l&apos;approche marketplace : gain de
              temps, leads qualifies et storytelling pret pour les investisseurs.
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.05}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="border-border/70 bg-white/95 p-6 shadow-sm"
              >
                <div className="flex h-full flex-col justify-between gap-6">
                  <p className="text-sm text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/investisseurs">Consulter la page investisseurs</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="mailto:launch@autonexus.bj">Recevoir le deck</Link>
            </Button>
          </AnimatedSection>
        </section>

        <section id="plan-demo" className="mx-auto w-full max-w-5xl px-6 py-16">
          <AnimatedSection className="rounded-3xl border border-brand/30 bg-brand/5 p-10 shadow-lg">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.3em] text-brand">
                Plan de deploiement demo
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                4 etapes pour orchestrer la demo live
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                Nous alignons equipe produit, commerce et investisseur autour d un
                scenario unique, avec un suivi en moins d une semaine.
              </p>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                {deploymentPlan.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link
                    href="https://wa.me/95606058?text=Je%20veux%20planifier%20la%20demo%20Auto%20Nexus%20BJ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Planifier la demo
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="mailto:launch@autonexus.bj">Recevoir le plan PDF</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 pb-20">
          <AnimatedSection className="rounded-3xl border border-border bg-white/95 p-10 text-center shadow-lg">
            <div className="space-y-4">
              <Badge className="bg-brand text-brand-foreground">Prochaine etape</Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Brancher Supabase et lancer les premiers leads reels
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                Le code est pret a recevoir le schema Prisma, les migrations et le flux
                upload signe. Une fois le projet Supabase cree, on pousse les migrations
                et on connecte la page a de vraies donnees.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" asChild>
                  <Link href="mailto:launch@autonexus.bj">
                    Planifier l&apos;atelier d&apos;onboarding
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/investisseurs">Visiter la page investisseurs</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link
                    href="https://wa.me/95606058"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
