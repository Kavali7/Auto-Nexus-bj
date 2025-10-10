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
import { formatMileage, formatPriceXof } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { getDealerById, getDealers } from "@/server/dealers";
import {
  getRelatedVehicles,
  getVehicleBySlug,
  getVehicleSlugs,
} from "@/server/vehicles";
import type { DealerSummary, VehicleSummary } from "@/types/catalog";

type PageParams = {
  slug: string;
};

export async function generateStaticParams(): Promise<PageParams[]> {
  const slugs = await getVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const vehicle = await getVehicleBySlug(params.slug);
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

export default async function VehicleDetail({
  params,
}: {
  params: PageParams;
}): Promise<JSX.Element> {
  const vehicle = await getVehicleBySlug(params.slug);
  if (!vehicle) {
    notFound();
  }

  const [dealer, related, dealers] = await Promise.all([
    getDealerById(vehicle.dealerId),
    getRelatedVehicles({
      brand: vehicle.brand,
      model: vehicle.model,
      excludeId: vehicle.id,
      limit: 3,
    }),
    getDealers(),
  ]);

  const whatsappLink = dealer?.whatsapp
    ? buildWhatsappLink(
        dealer.whatsapp,
        `Bonjour ${dealer.name},\nJe suis intéressé(e) par ${vehicle.brand} ${vehicle.model} (${vehicle.year}) sur Auto Nexus BJ.\nEst-elle toujours disponible ?`,
      )
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Hero vehicle={vehicle} dealer={dealer ?? undefined} whatsappLink={whatsappLink} />
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
              <ContactCard dealer={dealer ?? undefined} whatsappLink={whatsappLink} />
            </AnimatedSection>
            {related.length > 0 ? (
              <AnimatedSection delay={0.1}>
                <RelatedInventory
                  related={related}
                  currentVehicle={vehicle}
                  dealers={dealers}
                />
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
  vehicle: VehicleSummary;
  dealer?: DealerSummary;
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit bg-white/10 text-white">
              Véhicule premium sélection
            </Badge>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {vehicle.brand} {vehicle.model} {vehicle.trim ? `— ${vehicle.trim}` : ""}
              </h1>
              <p className="max-w-2xl text-base text-white/80 sm:text-lg">
                {vehicle.year} • {vehicle.condition} • {formatMileage(vehicle.mileage)} • {vehicle.fuel} — {vehicle.transmission}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.18em] text-white/70">
              <span>{vehicle.city}</span>
              <span>Prix {formatPriceXof(vehicle.price)}</span>
              {dealer ? <span>{dealer.name}</span> : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={whatsappLink ?? "#contact"}>Whatsapp instantané</Link>
              </Button>
              <CompareToggleButton vehicleId={vehicle.id} size="lg">
                Ajouter au comparateur
              </CompareToggleButton>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="border-white/20 bg-white/10 text-white backdrop-blur">
              <CardHeader className="space-y-2">
                <CardTitle className="text-base">Faits marquants</CardTitle>
                <CardDescription className="text-xs text-white/70">
                  Points forts mis en avant dans la fiche comparative.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {vehicle.highlights.slice(0, 3).map((highlight) => (
                  <p key={highlight} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                    <span>{highlight}</span>
                  </p>
                ))}
              </CardContent>
            </Card>
            {dealer ? (
              <Card className="border-white/20 bg-white/10 text-white backdrop-blur">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-base">{dealer.name}</CardTitle>
                  <CardDescription className="text-xs text-white/70">
                    Concessionnaire partenaire Auto Nexus BJ.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-white/80">
                  <p>{dealer.city}</p>
                  {dealer.address ? <p>{dealer.address}</p> : null}
                  {dealer.phone ? <p>Tél: {dealer.phone}</p> : null}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ vehicle }: { vehicle: VehicleSummary }): JSX.Element {
  if (vehicle.gallery.length === 0) {
    return (
      <Card className="border-border/70 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle>Galerie en préparation</CardTitle>
          <CardDescription>
            La galerie sera alimentée lors du branchement Supabase Storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src={vehicle.heroImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            width={1280}
            height={720}
            className="w-full rounded-2xl object-cover"
          />
        </CardContent>
      </Card>
    );
  }

  const [primary, ...secondary] = vehicle.gallery;

  return (
    <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted">
        <Image
          src={primary.url}
          alt={primary.label ?? vehicle.model}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1 text-xs uppercase tracking-[0.18em] text-white">
          Photo principale
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {secondary.slice(0, 4).map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
          >
            <Image
              src={photo.url}
              alt={photo.label ?? vehicle.model}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecificationTabs({
  vehicle,
}: {
  vehicle: VehicleSummary;
}): JSX.Element {
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
  dealer?: DealerSummary;
  whatsappLink?: string;
}): JSX.Element {
  return (
    <Card className="border-brand/40 bg-white shadow">
      <CardHeader className="space-y-3">
        <CardTitle className="text-lg text-foreground">
          Passer à l’action
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          CTA directs : WhatsApp, appel téléphone, demande d’offre. Leads capturés
          dans Supabase lors de l’intégration.
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
  dealers,
}: {
  related: VehicleSummary[];
  currentVehicle: VehicleSummary;
  dealers: DealerSummary[];
}): JSX.Element {
  const dealerMap = new Map(dealers.map((dealer) => [dealer.id, dealer] as const));

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
