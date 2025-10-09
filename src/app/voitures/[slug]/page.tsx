import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animated-section";
import { CompareToggleButton } from "@/components/compare-toggle-button";
import { VehicleCard } from "@/components/vehicle-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  dealers,
  getDealerById,
  getRelatedVehicles,
  getVehicleBySlug,
  type Dealer,
  type Vehicle,
  vehicles,
} from "@/data";
import { formatMileage, formatPriceXof } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";

type PageParams = {
  slug: string;
};

export function generateStaticParams(): PageParams[] {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export function generateMetadata({
  params,
}: {
  params: PageParams;
}): Metadata {
  const vehicle = getVehicleBySlug(params.slug);
  if (!vehicle) {
    return {
      title: "Annonce introuvable",
    };
  }

  return {
    title: `${vehicle.brand} ${vehicle.model} — ${vehicle.year}`,
    description: `${vehicle.brand} ${vehicle.model} ${vehicle.trim ?? ""} ${vehicle.year} disponible à ${vehicle.city}. ${vehicle.condition}, ${formatMileage(vehicle.mileage)}, ${formatPriceXof(vehicle.price)}.`,
    openGraph: {
      title: `${vehicle.brand} ${vehicle.model} — ${vehicle.year}`,
      description: vehicle.highlights[0],
      images: [
        {
          url: vehicle.heroImage,
        },
      ],
    },
  };
}

export default function VehicleDetail({
  params,
}: {
  params: PageParams;
}): JSX.Element {
  const vehicle = getVehicleBySlug(params.slug);
  if (!vehicle) {
    notFound();
  }

  const dealer = getDealerById(vehicle.dealerId);
  const related = getRelatedVehicles(vehicle, 3);
  const whatsappLink = dealer
    ? buildWhatsappLink(
        dealer.whatsapp,
        `Bonjour ${dealer.name},\nJe suis intéressé(e) par ${vehicle.brand} ${vehicle.model} (${vehicle.year}) sur Auto Nexus BJ.\nEst-elle toujours disponible ?`,
      )
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Hero vehicle={vehicle} dealer={dealer} whatsappLink={whatsappLink} />
      <main className="flex flex-1 flex-col gap-12 bg-muted/20 py-12">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="space-y-8">
            <AnimatedSection>
              <Gallery vehicle={vehicle} />
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <SpecificationTabs vehicle={vehicle} />
            </AnimatedSection>
          </section>
          <aside className="space-y-6">
            <AnimatedSection>
              <ContactCard dealer={dealer} whatsappLink={whatsappLink} />
            </AnimatedSection>
            {related.length > 0 ? (
              <AnimatedSection delay={0.1}>
                <RelatedInventory related={related} currentVehicle={vehicle} />
              </AnimatedSection>
            ) : null}
          </aside>
        </div>
      </main>
    </div>
  );
}

function Hero({
  vehicle,
  dealer,
  whatsappLink,
}: {
  vehicle: Vehicle;
  dealer?: Dealer;
  whatsappLink?: string;
}): JSX.Element {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src={vehicle.heroImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/60 to-transparent" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-24">
        <AnimatedSection className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="border-white/40 text-white">
              {vehicle.condition}
            </Badge>
            <Badge variant="outline" className="border-white/40 text-white">
              {vehicle.year}
            </Badge>
            <Badge variant="outline" className="border-white/40 text-white">
              {vehicle.fuel}
            </Badge>
            {vehicle.featured ? (
              <Badge className="bg-brand text-brand-foreground">
                Coup de cœur
              </Badge>
            ) : null}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {vehicle.brand} {vehicle.model}{" "}
            {vehicle.trim ? `— ${vehicle.trim}` : ""}
          </h1>
          <p className="max-w-2xl text-base text-white/80 sm:text-lg">
            {vehicle.highlights[0]}
          </p>
        </AnimatedSection>
        <AnimatedSection
          delay={0.1}
          className="rounded-2xl border border-white/20 bg-black/60 p-6 backdrop-blur"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">
            Prix affiché
          </p>
          <p className="text-3xl font-semibold">{formatPriceXof(vehicle.price)}</p>
          <p className="mt-2 text-sm text-white/70">
            {vehicle.mileage === 0
              ? "Zéro kilomètre"
              : `${formatMileage(vehicle.mileage)} • ${vehicle.city}`}
          </p>
          {dealer ? (
            <p className="mt-4 text-sm text-white/70">
              Proposé par <span className="font-semibold">{dealer.name}</span>
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <CompareToggleButton
              vehicleId={vehicle.id}
              size="sm"
              className="border-white/40 text-white hover:bg-white/10"
            />
            {whatsappLink ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </Link>
              </Button>
            ) : null}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function Gallery({ vehicle }: { vehicle: Vehicle }): JSX.Element {
  return (
    <Card className="border-border/80 bg-white/95 shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Galerie immersive (12–20 photos)
        </CardTitle>
        <CardDescription>
          Preview statique : intégrerons ensuite slider, zoom et vidéos 360° via
          Supabase Storage.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {vehicle.gallery.map((image, index) => (
          <div
            key={image}
            className="relative aspect-video overflow-hidden rounded-xl"
          >
            <Image
              src={image}
              alt={`${vehicle.brand} ${vehicle.model} - vue ${index + 1}`}
              fill
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SpecificationTabs({ vehicle }: { vehicle: Vehicle }): JSX.Element {
  return (
    <Card className="border-border/80 bg-white/95 shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Fiche technique & expérience
        </CardTitle>
        <CardDescription>
          Contenu mocké qui sera alimenté depuis Supabase (specs) et CMS (storytelling).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {vehicle.specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-lg border border-border bg-muted/20 p-4"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {spec.label}
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Points forts shooting
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {vehicle.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactCard({
  dealer,
  whatsappLink,
}: {
  dealer?: Dealer;
  whatsappLink?: string;
}): JSX.Element {
  return (
    <Card className="border-brand/40 bg-white shadow">
      <CardHeader className="space-y-3">
        <CardTitle className="text-lg text-foreground">
          Passer à l’action
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          CTA directs : WhatsApp, appel téléphone, demande d’offre. Leads
          capturés dans Supabase lors de l’intégration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild size="lg">
          <Link
            href={
              whatsappLink ??
              "https://wa.me/95606058?text=Je%20suis%20int%C3%A9ress%C3%A9(e)%20par%20une%20voiture%20Auto%20Nexus%20BJ"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp instantané
          </Link>
        </Button>
        {dealer?.phone ? (
          <Button asChild variant="outline" size="lg">
            <Link href={`tel:${dealer.phone}`}>Appeler {dealer.phone}</Link>
          </Button>
        ) : null}
        {dealer?.email ? (
          <Button asChild variant="outline" size="lg">
            <Link href={`mailto:${dealer.email}`}>
              Demander une offre détaillée
            </Link>
          </Button>
        ) : null}
        {dealer ? (
          <div className="rounded-xl border border-dashed border-brand/40 bg-brand/5 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">{dealer.name}</p>
            <p>{dealer.city}</p>
            {dealer.address ? <p>{dealer.address}</p> : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function RelatedInventory({
  related,
  currentVehicle,
}: {
  related: Vehicle[];
  currentVehicle: Vehicle;
}): JSX.Element {
  const dealerMap = new Map<string, Dealer>(dealers.map((d) => [d.id, d]));

  return (
    <Card className="border-border/80 bg-white/95 shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          Autres {currentVehicle.brand} {currentVehicle.model}
        </CardTitle>
        <CardDescription>
          Prévisualisation du comparateur : cartes alignées selon le modèle,
          prix et ville.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {related.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            dealer={dealerMap.get(vehicle.dealerId)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
