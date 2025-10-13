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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { services, getDealers } from "@/data";
import { buildWhatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Services Auto Nexus BJ",
  description:
    "Les 7 piliers services Auto Nexus BJ : vhicules neufs, entretien, pices, lubrifiants, financement, location et logistique.",
};

const dealersDataset = getDealers();

const heroStats = [
  {
    label: "Partenaires actifs",
    value: services.reduce((total, item) => total + item.partners.length, 0),
  },
  {
    label: "Concessionnaires connects",
    value: dealersDataset.length,
  },
  {
    label: "Piliers quips",
    value: services.length,
  },
];

const timelineSteps = [
  {
    title: "Semaine 1",
    caption: "Audit parc et contenu",
    details:
      "Shooting, inventaire, conformite WhatsApp Business et mise en place des gabarits.",
  },
  {
    title: "Semaine 2",
    caption: "Mise en ligne controlee",
    details:
      "Publication des annonces, tagging des services (financement, livraison, entretien) et checklist QA.",
  },
  {
    title: "Semaine 3",
    caption: "Activation marketing",
    details:
      "Campagnes social ads, SMS et email avec scoring leads, suivi dans le tableau de bord concessionnaire.",
  },
  {
    title: "Semaine 4",
    caption: "Reporting et upsell",
    details:
      "Analyse GMV, taux de conversion, chantiers upsell (pieces, lubrifiants, assurance) avec plan d action.",
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
      <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent">
        <AnimatedSection className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div className="space-y-8">
              <Badge className="w-fit bg-brand/15 text-brand">
                Vision marketplace 360
              </Badge>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Les 7 piliers services Auto Nexus BJ
                </h1>
                <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                  Du sourcing a la livraison, chaque pilier consolide l offre partenaire,
                  structure les campagnes marketing et pilote les KPI pour convaincre
                  investisseurs et concessionnaires.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Badge variant="outline" className="border-border/70">
                  Neufs et reprise
                </Badge>
                <Badge variant="outline" className="border-border/70">
                  Services atelier
                </Badge>
                <Badge variant="outline" className="border-border/70">
                  Financement et logistique
                </Badge>
              </div>
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
                <Button asChild size="lg" variant="ghost">
                  <Link href="#services">Explorer les modules</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              <Card className="border-border/70 bg-white/95 shadow-lg">
                <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Objectif services</p>
                  <p>
                    Orchestrer un back-office unifie: onboarding concessionnaires,
                    shooting premium, segmentation leads et upsell finance ou logistique.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-white/95 shadow-lg">
                <CardContent className="grid gap-4 p-6 sm:grid-cols-3 lg:grid-cols-1">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {stat.value.toString().padStart(2, "0")}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
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
                Auto Nexus BJ combine l acquisition de vehicules, les services a forte
                marge et un suivi unifie (GMV, leads, satisfaction). Chaque pilier a ses
                owners, ses SLA et son plan de monetisation.
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

        <div id="services">
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
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
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
        </div>

        <AnimatedSection className="mx-auto w-full max-w-6xl px-6">
          <Card className="border-border/70 bg-white/95 shadow-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl text-foreground">
                Timeline activation marketplace
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Un mois pour publier le parc, activer les services et deployer des
                campagnes co-brandees.
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
                Reporting GMV, gestion des leads, campagnes marketing et modules admin:
                tout est centralise pour partager des indicateurs fiables.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tableaux de bord Vercel Analytics et LogSnag</li>
                <li>Tracking conversions WhatsApp, appels et formulaires</li>
                <li>Automations email/SMS pour relances leads</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-brand">
                Session demo
              </p>
              <p className="text-sm text-muted-foreground">
                Planifiez une session pour parcourir le prototype complet (dashboard,
                comparateur, modules admin).
              </p>
              <Button asChild>
                <Link
                  href={buildWhatsappLink(
                    "95606058",
                    "Je souhaite planifier la session de demonstration complete Auto Nexus BJ.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Planifier la demo
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.05} className="mx-auto w-full max-w-6xl space-y-8 px-6">
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
          className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-2"
        >
          <Card className="border-border/70 bg-white/95 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle>Formulaire concessionnaire</CardTitle>
              <CardDescription>
                Capture mock: la connexion Supabase prendra le relais pour enregistrer le
                lead dans la table dediee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeadForm
                context="services-concessionnaire"
                description="Mentionnez vos volumes et le pilier prioritaire pour planifier un onboarding."
                submitLabel="Simuler la prise de contact"
                successMessage="Merci ! Cette simulation confirme la collecte lead. Le workflow Supabase sera branche lors du go live."
                fields={[
                  {
                    name: "company",
                    label: "Nom de la concession",
                    placeholder: "Ex: Nexus Premium",
                  },
                  {
                    name: "contact",
                    label: "Contact principal",
                    placeholder: "Email ou telephone",
                  },
                  {
                    name: "pilier",
                    label: "Pilier prioritaire",
                    placeholder: "Neufs, financement, livraison...",
                  },
                  {
                    name: "message",
                    label: "Message",
                    type: "textarea",
                    placeholder: "Volume mensuel, objectifs, besoins spcifiques...",
                  },
                ]}
              />
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-white/95 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle>Formulaire investisseur</CardTitle>
              <CardDescription>
                Version demo: les acces data-room seront envoyes automatiquement quand la
                connexion Supabase sera operationnelle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeadForm
                context="services-investisseur"
                submitLabel="Recevoir le pack demo"
                successMessage="Merci ! Lors du Jour J, ce formulaire declenchera l envoi du deck, de la timeline et du suivi meet."
                fields={[
                  {
                    name: "name",
                    label: "Nom et societe",
                    placeholder: "Votre nom - structure",
                  },
                  {
                    name: "email",
                    label: "Email professionnel",
                    type: "email",
                    placeholder: "prenom.nom@entreprise.com",
                  },
                  {
                    name: "ticket",
                    label: "Ticket envisage",
                    placeholder: "Montant vise (optionnel)",
                    required: false,
                  },
                  {
                    name: "focus",
                    label: "Points d interet",
                    type: "textarea",
                    placeholder: "KPI, unit economics, roadmap produit...",
                    required: false,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </AnimatedSection>
      </main>
    </div>
  );
}
