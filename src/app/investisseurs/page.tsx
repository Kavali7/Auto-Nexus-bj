import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { LeadForm } from "@/components/lead-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPriceXof } from "@/lib/format";

const investorStats = [
  {
    label: "GMV mock",
    value: formatPriceXof(66250000 + 48500000 + 38900000),
    hint: "Projection sur le stock pilote",
  },
  {
    label: "Lead cible T3",
    value: "450+",
    hint: "Campagnes digitales et PR locale",
  },
  {
    label: "Partenaires pilotes",
    value: "03",
    hint: "Concessionnaires premium onboard",
  },
];

const valueProps = [
  {
    title: "Marketplace premium",
    description:
      "Inventaire photo-ready avec fiches detaillees, comparateur et parcours WhatsApp integre pour capter la demande qualifiee.",
  },
  {
    title: "Monetisation services",
    description:
      "Abonnements concessionnaires, commissions plafonnees et marges sur services (logistique, financement, entretien).",
  },
  {
    title: "Data room temps reel",
    description:
      "Reporting GMV, leads, conversion par pilier et cockpit analytique partageable (Supabase + Vercel Analytics).",
  },
];

const roadmap = [
  {
    title: "Phase 1 - MVP live",
    detail:
      "Connexion Supabase/Prisma, ingestion photos vers Storage, recherche Meilisearch et workflow moderation.",
  },
  {
    title: "Phase 2 - Growth",
    detail:
      "Comparateur multi-vehicules, favoris, scoring leads, campagnes marketing co-brandees et modules financiers.",
  },
  {
    title: "Phase 3 - Expansion",
    detail:
      "Ouverture B2B fleet et artisans, offres financement/assurance integrees, extension Cote d Ivoire et Togo.",
  },
];

const faqItems = [
  {
    question: "Quel ticket de financement ciblez-vous ?",
    answer:
      "Une enveloppe de 180 000 000 XOF pour 18 mois: equipe produit (5), commerciaux (3), marketing (2) et budget acquisition.",
  },
  {
    question: "Quelles sont les hypotheses de revenus ?",
    answer:
      "Objectif GMV 1,1 milliard XOF an 1, 20 concessionnaires onboard, 12% marge moyenne sur services et 5% sur transactions.",
  },
  {
    question: "Quels risques majeurs anticipez-vous ?",
    answer:
      "Adoption concessionnaires, qualite shooting, fiabilite logistique. Chaque risque dispose d un plan de mitigation (SLA, partenaires, QA).",
  },
  {
    question: "Quand la data-room sera-t-elle disponible ?",
    answer:
      "La data-room Notion + Supabase sera ouverte a la signature du NDA (prets: deck, metrics, projections, legal pack).",
  },
];

export const metadata: Metadata = {
  title: "Investisseurs & Demo - Auto Nexus BJ",
  description:
    "Vue investisseur Auto Nexus BJ : vision, KPI mock, roadmap produit et formulaires pour reserver une demo.",
};

export default function InvestorsPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent">
        <AnimatedSection className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div className="space-y-8">
              <Badge className="w-fit bg-brand/15 text-brand">Fundraising preview</Badge>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Auto Nexus BJ - deck investisseurs et demo
                </h1>
                <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                  Marketplace auto premium en phase MVP: traction mock, roadmap detaillee
                  et acces direct au deck et aux sessions demo.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Badge variant="outline" className="border-border/70">
                  Deck PDF
                </Badge>
                <Badge variant="outline" className="border-border/70">
                  Roadmap produit
                </Badge>
                <Badge variant="outline" className="border-border/70">
                  Data room
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="mailto:invest@autonexus.bj">Recevoir le deck PDF</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link
                    href="https://wa.me/95606058?text=Je%20souhaite%20reserver%20la%20demo%20investisseur%20Auto%20Nexus%20BJ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reserver la demo
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="#roadmap">Voir la roadmap</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              <Card className="border-border/70 bg-white/95 shadow-lg">
                <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Objectif investisseurs</p>
                  <p>
                    Financer 18 mois de produit, go-to-market et operations pour
                    industrialiser la marketplace Auto Nexus BJ et deployer les premiers
                    leads reels.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-white/95 shadow-lg">
                <CardContent className="grid gap-4 p-6 sm:grid-cols-3 lg:grid-cols-1">
                  {investorStats.map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground/80">{stat.hint}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <main className="flex flex-1 flex-col gap-16 bg-muted/10 py-16">
        <AnimatedSection className="mx-auto w-full max-w-6xl grid gap-6 px-6 md:grid-cols-3">
          {valueProps.map((item) => (
            <Card key={item.title} className="border-border/70 bg-white/95 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </AnimatedSection>

        <div id="roadmap">
          <AnimatedSection className="mx-auto w-full max-w-6xl px-6">
            <Card className="border-border/70 bg-white/95 shadow-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl text-foreground">
                  Roadmap produit et traction cible
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Trois phases pour industrialiser les services, amplifier les revenus et
                  preparer l expansion regionale.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {roadmap.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-xl border border-dashed border-brand/30 bg-brand/5 p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-brand">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mx-auto w-full max-w-6xl space-y-6 px-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Questions clefs
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Une base FAQ amenee a rejoindre la data-room Notion pour integrer documents
              et mises a jour metrics.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <Card
                key={item.question}
                className="border-border/70 bg-white/95 shadow-sm"
              >
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
          className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <Card className="border-border/70 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle>Formulaire deck et data-room</CardTitle>
              <CardDescription>
                Les champs seront connectes a Supabase pour tracer les acces et envoyer le
                pack automatiquement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeadForm
                context="investisseurs-data-room"
                submitLabel="Recevoir le pack investisseur"
                successMessage="Merci ! Lors du go live, ce formulaire declenchera l envoi automatique du deck, de la data-room et du suivi demo."
                fields={[
                  {
                    name: "name",
                    label: "Nom et fonction",
                    placeholder: "Votre nom et role",
                  },
                  {
                    name: "email",
                    label: "Email professionnel",
                    type: "email",
                    placeholder: "prenom.nom@fonds.com",
                  },
                  {
                    name: "organisation",
                    label: "Organisation / fonds",
                    placeholder: "Nom du fonds ou structure",
                    required: false,
                  },
                  {
                    name: "focus",
                    label: "Points d interet",
                    type: "textarea",
                    placeholder: "KPI, unit economics, expansion geographique...",
                    required: false,
                  },
                ]}
              />
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle>Contact direct</CardTitle>
              <CardDescription>
                Planning des demos hebdo (jeu & vendredi) et canal prioritaire pour Q&A.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-dashed border-brand/30 bg-brand/5 p-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Point demo</p>
                <p>Jeudi 17h (CET) - Zoom 45min</p>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link href="mailto:invest@autonexus.bj">invest@autonexus.bj</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link
                  href="https://wa.me/95606058?text=Question%20investisseur%20Auto%20Nexus%20BJ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp direct
                </Link>
              </Button>
            </CardContent>
          </Card>
        </AnimatedSection>
      </main>
    </div>
  );
}
