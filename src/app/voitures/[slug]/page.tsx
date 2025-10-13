import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animated-section";
import { LeadForm } from "@/components/lead-form";
import { CompareToggleButton } from "@/components/compare-toggle-button";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMileage, formatPriceXof } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { getDealerById, getDealers } from "@/server/dealers";
import { getRelatedVehicles, getVehicleBySlug, getVehicleSlugs } from "@/server/vehicles";
import type { DealerSummary, VehicleSummary } from "@/types/catalog";

type PageParams = {
  slug: string;
};

const specGroupConfig = [
  { title: "Performance", keywords: ["puissance", "0-100", "couple", "vitesse"] },
  { title: "Energie", keywords: ["batterie", "autonomie", "consommation", "emission"] },
  {
    title: "Transmission",
    keywords: ["transmission", "boite", "roues motrices", "drivetrain"],
  },
  {
    title: "Dimensions",
    keywords: ["longueur", "largeur", "hauteur", "empattement", "garde"],
  },
  { title: "Confort", keywords: ["siege", "sellerie", "climatisation", "ambiance"] },
  {
    title: "Technologie",
    keywords: ["infotainment", "ecran", "audio", "assistant", "interface"],
  },
  { title: "Securite", keywords: ["airbag", "abs", "adas", "freinage"] },
] as const;

function groupVehicleSpecs(specs: VehicleSummary["specs"]) {
  const fallback: VehicleSummary["specs"] = [];
  const groups = specGroupConfig.map((config) => ({
    title: config.title,
    items: [] as VehicleSummary["specs"],
  }));

  for (const spec of specs) {
    const normalized = spec.label.toLowerCase();
    const match = groups.find((group, index) =>
      specGroupConfig[index].keywords.some((keyword) => normalized.includes(keyword)),
    );

    if (match) {
      match.items.push(spec);
    } else {
      fallback.push(spec);
    }
  }

  const result = groups.filter((group) => group.items.length > 0);
  if (fallback.length > 0) {
    result.push({ title: "Informations cle", items: fallback });
  }

  return result;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const slugs = await getVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) {
    return {
      title: "Annonce introuvable",
    };
  }

  return {
    title: `${vehicle.brand} ${vehicle.model} - ${vehicle.year}`,
    description: `${vehicle.brand} ${vehicle.model} ${vehicle.trim ?? ""} ${vehicle.year} disponible a ${vehicle.city}. ${vehicle.condition}, ${formatMileage(vehicle.mileage)}, ${formatPriceXof(vehicle.price)}.`,
    openGraph: {
      title: `${vehicle.brand} ${vehicle.model} - ${vehicle.year}`,
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
  params: Promise<PageParams>;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
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
        `Bonjour ${dealer.name},\nJe suis interesse(e) par ${vehicle.brand} ${vehicle.model} (${vehicle.year}) sur Auto Nexus BJ.\nEst-elle toujours disponible ?`,
      )
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Hero vehicle={vehicle} dealer={dealer ?? undefined} whatsappLink={whatsappLink} />
      <main className="flex flex-1 flex-col gap-12 bg-muted/20 py-12 pb-32 lg:pb-12">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="space-y-8">
            <AnimatedSection>
              <VehicleGallery
                items={vehicle.gallery}
                fallbackImage={vehicle.heroImage}
                vehicleName={`${vehicle.brand} ${vehicle.model}`}
              />
            </AnimatedSection>
            {related.length > 0 ? (
              <AnimatedSection delay={0.05}>
                <QuickCompareCard vehicle={vehicle} competitor={related[0]} />
              </AnimatedSection>
            ) : null}
            <AnimatedSection delay={0.1}>
              <VehicleSpecsPanel vehicle={vehicle} />
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <FinancingAndLogistics vehicle={vehicle} dealer={dealer ?? undefined} />
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
      <MobileStickyCta vehicle={vehicle} whatsappLink={whatsappLink} />
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
              Vehicule premium selection
            </Badge>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {vehicle.brand} {vehicle.model}
                {vehicle.trim ? ` - ${vehicle.trim}` : ""}
              </h1>
              <p className="max-w-2xl text-base text-white/80 sm:text-lg">
                {vehicle.year} - {vehicle.condition} - {formatMileage(vehicle.mileage)} -{" "}
                {vehicle.fuel} - {vehicle.transmission}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.18em] text-white/70">
              <span>{vehicle.city}</span>
              <span>Prix {formatPriceXof(vehicle.price)}</span>
              {dealer ? <span>{dealer.name}</span> : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={whatsappLink ?? "#contact"}>Whatsapp immediat</Link>
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
                  Elements a mettre en avant dans la fiche comparative.
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
                  {dealer.phone ? <p>Tel: {dealer.phone}</p> : null}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function VehicleSpecsPanel({ vehicle }: { vehicle: VehicleSummary }): JSX.Element {
  const groupedSpecs = groupVehicleSpecs(vehicle.specs);

  return (
    <Card className="border-border/80 bg-white/95 shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Fiche technique regroupee</CardTitle>
        <CardDescription>
          Regroupement thematique pour une lecture rapide avant l integration Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          {groupedSpecs.map((group) => (
            <div
              key={group.title}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-5"
            >
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {group.title}
                </p>
                <div className="h-0.5 w-10 bg-brand" />
              </div>
              <dl className="space-y-3 text-sm text-muted-foreground">
                {group.items.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-4 border-b border-border/30 pb-2 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {spec.label}
                    </dt>
                    <dd className="text-base font-semibold text-foreground">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Points forts shooting</h2>
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

function QuickCompareCard({
  vehicle,
  competitor,
}: {
  vehicle: VehicleSummary;
  competitor: VehicleSummary;
}): JSX.Element {
  const metrics = [
    {
      label: "Prix",
      format: (value: VehicleSummary) => formatPriceXof(value.price),
    },
    {
      label: "Kilometrage",
      format: (value: VehicleSummary) => formatMileage(value.mileage),
    },
    {
      label: "Annee",
      format: (value: VehicleSummary) => value.year.toString(),
    },
    {
      label: "Condition",
      format: (value: VehicleSummary) => value.condition,
    },
    {
      label: "Energie",
      format: (value: VehicleSummary) => value.fuel,
    },
    {
      label: "Transmission",
      format: (value: VehicleSummary) => value.transmission,
    },
  ] as const;

  const priceDelta = competitor.price - vehicle.price;
  const priceDeltaLabel =
    priceDelta === 0
      ? "Identique"
      : `${priceDelta > 0 ? "+" : "-"}${formatPriceXof(Math.abs(priceDelta))}`;

  return (
    <Card className="border-border/80 bg-white/95 shadow">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg text-foreground">Comparaison rapide</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Vue express avant d ouvrir le comparateur complet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Selection Auto Nexus BJ
            </p>
            <p className="text-base font-semibold text-foreground">
              {vehicle.brand} {vehicle.model}
            </p>
            <dl className="space-y-2 text-sm text-muted-foreground">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between gap-4"
                >
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {metric.label}
                  </dt>
                  <dd className="font-medium text-foreground">
                    {metric.format(vehicle)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="border-border/60 bg-muted/40">
              vs {priceDeltaLabel}
            </Badge>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Offre similaire
            </p>
            <p className="text-base font-semibold text-foreground">
              {competitor.brand} {competitor.model}
            </p>
            <dl className="space-y-2 text-sm text-muted-foreground">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between gap-4"
                >
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {metric.label}
                  </dt>
                  <dd className="font-medium text-foreground">
                    {metric.format(competitor)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" variant="outline">
            <Link href="/comparer">Ouvrir le comparateur</Link>
          </Button>
          <CompareToggleButton vehicleId={vehicle.id} size="sm">
            Ajouter ce modele
          </CompareToggleButton>
        </div>
      </CardContent>
    </Card>
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
    <Card className="border-border/80 bg-white/95 shadow">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Financement et livraison
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Scenario demo pour rassurer un prospect (financement) et un investisseur
          (logistique).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-muted/15 p-5">
          <div className="space-y-1">
            <Badge variant="secondary" className="border-brand/20 bg-brand/10 text-brand">
              Financement
            </Badge>
            <p className="text-sm font-semibold text-foreground">
              Simulation 24 mois: {formatPriceXof(monthlyEstimate)} / mois
            </p>
            <p className="text-xs text-muted-foreground">
              Offre partenaire (banque locale + fintech) avec validation sous 48h.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Pack dossier digital (KYC, preuve revenus) charge sur Supabase</li>
            <li>Assurance incluse la 1re annee, negociable ensuite</li>
            <li>Option ballon ou valeur residuelle selon profil</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-muted/15 p-5">
          <div className="space-y-1">
            <Badge variant="secondary" className="border-brand/20 bg-brand/10 text-brand">
              Livraison
            </Badge>
            <p className="text-sm font-semibold text-foreground">
              Logistique premium Cotonou & Abomey-Calavi
            </p>
            <p className="text-xs text-muted-foreground">
              Inspection, detailing et convoyage coordonnes depuis la console back-office.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Checklist 40 points avant remise des clefs</li>
            <li>Transport plateau ou chauffeur agree selon besoin</li>
            <li>Option stockage et couverture showroom 48h</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 bg-muted/20 p-4">
        <Button asChild size="sm">
          <Link
            href={
              dealer?.whatsapp
                ? buildWhatsappLink(
                    dealer.whatsapp,
                    "Je souhaite un plan de financement pour ce vehicule.",
                  )
                : "/contact"
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

function ContactCard({
  dealer,
  whatsappLink,
}: {
  dealer?: DealerSummary;
  whatsappLink?: string;
}): JSX.Element {
  return (
    <Card id="contact" className="border-brand/40 bg-white shadow">
      <CardHeader className="space-y-3">
        <CardTitle className="text-lg text-foreground">Passer a l action</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Contact direct pour WhatsApp, appel ou demande de devis. Les leads seront captes
          dans Supabase lors du branchement back-office.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild size="lg">
          <Link
            href={
              whatsappLink ??
              "https://wa.me/95606058?text=Je%20suis%20interesse(e)%20par%20une%20voiture%20Auto%20Nexus%20BJ"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp immediat
          </Link>
        </Button>
        {dealer?.phone ? (
          <Button asChild variant="outline" size="lg">
            <Link href={`tel:${dealer.phone}`}>Appeler {dealer.phone}</Link>
          </Button>
        ) : null}
        {dealer?.email ? (
          <Button asChild variant="outline" size="lg">
            <Link href={`mailto:${dealer.email}`}>Demander une offre detaillee</Link>
          </Button>
        ) : null}
        <LeadForm
          context="vehicule-detail"
          submitLabel="Recevoir le recap demo"
          successMessage="Merci ! Lors du go live, ce formulaire enverra le recap fiche, le plan financement et le suivi WhatsApp."
          fields={[
            { name: "fullName", label: "Nom complet", placeholder: "Votre nom" },
            {
              name: "contact",
              label: "Coordonnees",
              placeholder: "Email ou telephone",
            },
            {
              name: "budget",
              label: "Budget",
              placeholder: "Ex: 45 000 000 XOF",
              required: false,
            },
            {
              name: "message",
              label: "Message",
              type: "textarea",
              placeholder: "Precisez vos attentes: financement, livraison, trade-in...",
            },
          ]}
        />
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

function MobileStickyCta({
  vehicle,
  whatsappLink,
}: {
  vehicle: VehicleSummary;
  whatsappLink?: string;
}): JSX.Element {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 p-4 shadow-lg backdrop-blur lg:hidden">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {vehicle.brand} {vehicle.model}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatPriceXof(vehicle.price)} - {vehicle.condition}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Button asChild size="sm">
            <Link href={whatsappLink ?? "#contact"}>WhatsApp</Link>
          </Button>
          <CompareToggleButton vehicleId={vehicle.id} size="sm">
            Comparer
          </CompareToggleButton>
        </div>
      </div>
    </div>
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
  const dealerMap = new Map(dealers.map((item) => [item.id, item] as const));

  return (
    <Card className="border-border/80 bg-white/95 shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          Autres {currentVehicle.brand} {currentVehicle.model}
        </CardTitle>
        <CardDescription>
          Apercu du comparateur: cartes alignees selon le modele, le prix et la ville.
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
