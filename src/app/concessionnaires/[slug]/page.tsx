import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animated-section";
import { VehicleCard } from "@/components/vehicle-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getDealerBySlug,
  dealers,
  getVehiclesByDealer,
  type Dealer,
  type Vehicle,
} from "@/data";
import { buildWhatsappLink } from "@/lib/whatsapp";

type PageParams = {
  slug: string;
};

export function generateStaticParams(): PageParams[] {
  return dealers.map((dealer) => ({ slug: dealer.slug }));
}

export function generateMetadata({ params }: { params: PageParams }): Metadata {
  const dealer = getDealerBySlug(params.slug);
  if (!dealer) {
    return {
      title: "Concessionnaire introuvable",
    };
  }

  return {
    title: `${dealer.name} — Concessionnaire Auto Nexus BJ`,
    description: dealer.headline,
    openGraph: {
      title: dealer.name,
      description: dealer.description,
      images: dealer.heroImage ? [dealer.heroImage] : undefined,
    },
  };
}

export default function DealerDetail({ params }: { params: PageParams }): JSX.Element {
  const dealer = getDealerBySlug(params.slug);
  if (!dealer) {
    notFound();
  }

  const inventory = getVehiclesByDealer(dealer.id);
  const whatsappLink = buildWhatsappLink(
    dealer.whatsapp,
    `Bonjour ${dealer.name}, je souhaite échanger via Auto Nexus BJ.`,
  );

  const stats = [
    {
      label: "Annonces actives",
      value: dealer.inventorySize ?? inventory.length,
    },
    {
      label: "Depuis",
      value: dealer.foundedYear ?? "—",
    },
    {
      label: "Collaborateurs",
      value: dealer.staffCount ?? "—",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Hero dealer={dealer} stats={stats} whatsappLink={whatsappLink} />
      <main className="flex flex-1 flex-col gap-12 bg-muted/10 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1.7fr_1fr]">
          <section className="space-y-8">
            <AnimatedSection>
              <AboutDealer dealer={dealer} />
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <DealerGallery dealer={dealer} />
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <InventoryGrid inventory={inventory} dealer={dealer} />
            </AnimatedSection>
          </section>
          <aside className="space-y-6">
            <AnimatedSection>
              <ContactCard dealer={dealer} whatsappLink={whatsappLink} />
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <PitchCard />
            </AnimatedSection>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Hero({
  dealer,
  stats,
  whatsappLink,
}: {
  dealer: Dealer;
  stats: { label: string; value: number | string }[];
  whatsappLink: string;
}): JSX.Element {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src={dealer.heroImage ?? "/brand/anx-logo.png"}
          alt={dealer.name}
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-transparent" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-end lg:justify-between">
        <AnimatedSection className="space-y-4">
          <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
            {dealer.city}
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {dealer.name}
          </h1>
          <p className="max-w-2xl text-base text-white/80 sm:text-lg">
            {dealer.headline}
          </p>
          <p className="max-w-2xl text-sm text-white/70">{dealer.description}</p>
        </AnimatedSection>
        <AnimatedSection
          delay={0.1}
          className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-white/20 bg-black/60 p-6 backdrop-blur"
        >
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-semibold text-white">
                  {typeof stat.value === "number"
                    ? stat.value.toString().padStart(2, "0")
                    : stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90"
            >
              WhatsApp direct
            </Link>
            {dealer.phone ? (
              <Link
                href={`tel:${dealer.phone}`}
                className="inline-flex items-center justify-center rounded-md border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Appeler
              </Link>
            ) : null}
          </div>
          {dealer.website ? (
            <Link
              href={dealer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.2em] text-white/70 underline underline-offset-4"
            >
              Visiter le site
            </Link>
          ) : null}
        </AnimatedSection>
      </div>
    </section>
  );
}

function AboutDealer({ dealer }: { dealer: Dealer }): JSX.Element {
  return (
    <Card className="border-border/70 bg-white/95 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">
          Engagement Auto Nexus BJ
        </CardTitle>
        <CardDescription>
          Alignment stratégique avec le plan marketplace (quality first, lead instantané,
          reporting).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          {dealer.name} propose un service complet : shooting photo premium, gestion des
          leads en moins de 30 minutes et transparence sur l&apos;historique des
          véhicules. Le dashboard Auto Nexus BJ leur permet de mettre à jour
          prix/disponibilité en temps réel.
        </p>
        <ul className="space-y-2">
          <li>• SLA suivi lead : réponse &lt; 30 minutes.</li>
          <li>• Garantie satisfaction : pack detailing + inspection remise.</li>
          <li>• Formation équipe commerciale sur l&apos;outil Auto Nexus BJ.</li>
        </ul>
      </CardContent>
    </Card>
  );
}

function DealerGallery({ dealer }: { dealer: Dealer }): JSX.Element | null {
  if (!dealer.gallery || dealer.gallery.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/70 bg-white/95 shadow">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">
          Aperçu shooting showroom
        </CardTitle>
        <CardDescription>
          Images mockées — serviront pour présenter le dispositif photo (avant/après).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {dealer.gallery.map((src, index) => (
          <div key={src} className="relative aspect-video overflow-hidden rounded-xl">
            <Image
              src={src}
              alt={`${dealer.name} - vue ${index + 1}`}
              fill
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InventoryGrid({
  inventory,
  dealer,
}: {
  inventory: Vehicle[];
  dealer: Dealer;
}): JSX.Element {
  if (inventory.length === 0) {
    return (
      <Card className="border-border/70 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">
            Inventaire mock en cours
          </CardTitle>
          <CardDescription>
            Nous préparons les premières annonces pour ce concessionnaire.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-foreground">Sélection de véhicules</h2>
        <Badge variant="outline">{inventory.length} annonces</Badge>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {inventory.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            dealer={dealer}
            whatsappNumber={dealer.whatsapp}
          />
        ))}
      </div>
    </div>
  );
}

function ContactCard({
  dealer,
  whatsappLink,
}: {
  dealer: Dealer;
  whatsappLink: string;
}): JSX.Element {
  return (
    <Card className="border-brand/40 bg-white shadow">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">
          Travailler avec {dealer.name}
        </CardTitle>
        <CardDescription>
          Contact direct pour onboarding, partenariats et campagnes marketing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <Link
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90"
        >
          Discuter sur WhatsApp
        </Link>
        {dealer.phone ? (
          <Link
            href={`tel:${dealer.phone}`}
            className="inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Appeler {dealer.phone}
          </Link>
        ) : null}
        {dealer.email ? (
          <Link
            href={`mailto:${dealer.email}`}
            className="inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Envoyer un email
          </Link>
        ) : null}
        <div className="space-y-2 rounded-xl border border-dashed border-brand/30 bg-brand/5 p-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <p>Adresse</p>
          <p className="text-sm normal-case text-foreground">
            {dealer.address ?? "Adresse en cours de validation"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PitchCard(): JSX.Element {
  return (
    <Card className="border-border/70 bg-white/95 shadow-sm">
      <CardHeader>
        <CardTitle>Pitch investisseur</CardTitle>
        <CardDescription>
          Comment Auto Nexus BJ monétise la relation concessionnaire.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>• Abonnement marketplace + commission sur leads qualifiés.</p>
        <p>• Upsell services : shooting, marketing, logistique, financement.</p>
        <p>• Data analytics partagée (pricing, rotation stock, demande).</p>
        <p>• Comparateur & favoris → rétention + cross-sell (assurance, pièces).</p>
      </CardContent>
    </Card>
  );
}
