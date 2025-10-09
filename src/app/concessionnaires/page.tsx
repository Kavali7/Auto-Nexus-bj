import Image from "next/image";
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
import { dealers, getVehiclesByDealer } from "@/data";
import { formatPriceXof } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Concessionnaires partenaires",
  description:
    "Annuaire statique des concessionnaires Auto Nexus BJ : prestige, multi-marques et spécialistes utilitaires.",
};

const heroHighlights = [
  "Contrats onboarding prêts : charte photo, SLA leads, reporting",
  "Dashboards concessionnaires (CRUD annonces, disponibilité, leads)",
  "Validation admin + modération contenus (Phase 1)",
];

export default function DealersPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-border bg-white/80 py-16">
        <AnimatedSection className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-brand">
              Partenaires fondateurs
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Concessionnaires prêts au décollage
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Ces partenaires couvrent le spectre premium, multi-marques et utilitaires.
              Chacun dispose d’une équipe dédiée Auto Nexus BJ, d’un numéro WhatsApp
              commercial et d’un accès au dashboard pour gérer photos/prix/disponibilité.
            </p>
            <div className="grid gap-3">
              {heroHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground"
                >
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button asChild size="lg">
              <Link
                href={buildWhatsappLink(
                  "+22962459012",
                  "Bonjour Auto Nexus BJ, je souhaite rejoindre la marketplace en tant que concessionnaire.",
                )}
                target="_blank"
              >
                Rejoindre la marketplace
              </Link>
            </Button>
          </div>
          <Card className="w-full max-w-sm border-border/70 bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle>Ce que nous proposons</CardTitle>
              <CardDescription>
                Un pack d’activation complet pour faire rayonner chaque concessionnaire.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Shooting photo pro (18 vues) & retouches.</p>
              <p>• Mise en ligne <strong>&lt; 24h</strong> (whitelabel dashboard).</p>
              <p>• Leads WhatsApp + email + suivi conversion.</p>
              <p>• Campagnes marketing cofinancées (social ads, SMS, events).</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-border/70 bg-muted/30 p-4">
              <Button asChild size="sm" variant="outline">
                <Link href="/services">Voir les 7 piliers</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/voitures">Accéder aux annonces</Link>
              </Button>
            </CardFooter>
          </Card>
        </AnimatedSection>
      </section>

      <main className="flex flex-1 flex-col bg-muted/10 py-16">
        <AnimatedSection
          delay={0.05}
          className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-2"
        >
          {dealers.map((dealer) => {
            const inventory = getVehiclesByDealer(dealer.id);
            const averagePrice =
              inventory.reduce((sum, vehicle) => sum + vehicle.price, 0) /
              Math.max(inventory.length, 1);

            return (
              <Card
                key={dealer.id}
                className="flex h-full flex-col overflow-hidden border-border/70 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={
                      dealer.heroImage ??
                      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80"
                    }
                    alt={dealer.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{dealer.name}</span>
                    <Badge variant="secondary">{dealer.city}</Badge>
                  </CardTitle>
                  <CardDescription>{dealer.headline}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>{dealer.description}</p>
                  <div className="grid grid-cols-3 gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                      <p className="text-base font-semibold text-foreground">
                        {dealer.inventorySize ?? inventory.length}
                      </p>
                      <p>Annonces</p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                      <p className="text-base font-semibold text-foreground">
                        {dealer.foundedYear ?? "—"}
                      </p>
                      <p>Depuis</p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                      <p className="text-base font-semibold text-foreground">
                        {dealer.staffCount ?? "—"}
                      </p>
                      <p>Collaborateurs</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-dashed border-brand/40 bg-brand/5 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-brand">
                      Panier moyen (mock)
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatPriceXof(averagePrice || 0)}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto flex flex-wrap gap-3 border-t border-border/70 bg-muted/30 p-4">
                  <Button asChild size="sm">
                    <Link href={`/concessionnaires/${dealer.slug}`}>
                      Voir la vitrine
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={buildWhatsappLink(
                        dealer.whatsapp,
                        `Bonjour ${dealer.name}, je découvre votre vitrine Auto Nexus BJ.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </Link>
                  </Button>
                  {dealer.phone ? (
                    <Button asChild size="sm" variant="outline">
                      <Link href={`tel:${dealer.phone}`}>Appeler</Link>
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            );
          })}
        </AnimatedSection>
      </main>
    </div>
  );
}
