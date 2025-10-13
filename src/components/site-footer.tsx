"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteFooter(): JSX.Element {
  const year = new Date().getFullYear();
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitted">("idle");

  const handleNewsletterSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setNewsletterStatus("submitted");
    },
    [],
  );

  return (
    <footer className="border-t border-border bg-gradient-to-b from-white via-white/95 to-muted/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <section aria-labelledby="footer-brand" className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p id="footer-brand" className="text-lg font-semibold text-foreground">
                Auto Nexus BJ
              </p>
              <p>
                Marketplace auto premium pour connecter les concessionnaires du Bénin à
                leurs clients. MVP statique prêt pour l’onboarding Supabase &amp;
                Meilisearch.
              </p>
            </div>
            <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-brand">Coordonnées</p>
              <p>Cotonou, Bénin</p>
              <p>
                <Link href="tel:+22995606058" className="transition hover:text-brand">
                  +229 95 60 60 58
                </Link>
              </p>
              <p>
                <Link
                  href="mailto:hello@autonexus.bj"
                  className="transition hover:text-brand"
                >
                  hello@autonexus.bj
                </Link>
              </p>
            </div>
          </section>

          <section
            aria-labelledby="footer-navigation"
            className="space-y-4 text-sm text-muted-foreground"
          >
            <p
              id="footer-navigation"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground/70"
            >
              Navigation
            </p>
            <nav className="grid gap-2" aria-label="Navigation secondaire">
              <Link href="/" className="transition hover:text-brand">
                Accueil
              </Link>
              <Link href="/voitures" className="transition hover:text-brand">
                Voitures disponibles
              </Link>
              <Link href="/concessionnaires" className="transition hover:text-brand">
                Concessionnaires
              </Link>
              <Link href="/services" className="transition hover:text-brand">
                Services &amp; solutions
              </Link>
              <Link href="/investisseurs" className="transition hover:text-brand">
                Investisseurs
              </Link>
              <Link href="/dashboard" className="transition hover:text-brand">
                Dashboard prototype
              </Link>
            </nav>
          </section>

          <section
            aria-labelledby="footer-services"
            className="space-y-4 text-sm text-muted-foreground"
          >
            <p
              id="footer-services"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground/70"
            >
              Services &amp; réseaux
            </p>
            <nav className="grid gap-2" aria-label="Services complémentaires">
              <Link href="/comparer" className="transition hover:text-brand">
                Comparateur véhicules
              </Link>
              <Link href="/conditions-generales" className="transition hover:text-brand">
                Conditions générales
              </Link>
              <Link href="/mentions-legales" className="transition hover:text-brand">
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="transition hover:text-brand"
              >
                Politique de confidentialité
              </Link>
            </nav>
            <div
              className="flex flex-wrap gap-3 pt-2 text-sm"
              aria-label="Réseaux sociaux"
            >
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand"
                aria-label="Instagram Auto Nexus BJ"
              >
                Instagram
              </Link>
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand"
                aria-label="Facebook Auto Nexus BJ"
              >
                Facebook
              </Link>
              <Link
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand"
                aria-label="LinkedIn Auto Nexus BJ"
              >
                LinkedIn
              </Link>
            </div>
          </section>

          <section
            aria-labelledby="footer-newsletter"
            className="space-y-4 text-sm text-muted-foreground"
          >
            <p
              id="footer-newsletter"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground/70"
            >
              Newsletter &amp; langue
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="space-y-3"
              aria-label="Inscription newsletter"
            >
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em]">
                Rester informé·e
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm transition focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                />
              </label>
              <Button
                type="submit"
                className="w-full"
                variant="default"
                disabled={newsletterStatus === "submitted"}
              >
                {newsletterStatus === "submitted"
                  ? "Inscription enregistrée"
                  : "Rejoindre la newsletter"}
              </Button>
              {newsletterStatus === "submitted" ? (
                <p className="text-xs text-emerald-600">
                  Merci ! Vous recevrez l’actualité lancement et la roadmap produit.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Mode démo : l’inscription est simulée, aucune donnée n’est enregistrée.
                </p>
              )}
            </form>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em]">
              <span className="text-muted-foreground/70">Langue</span>
              <div className="flex items-center gap-2">
                <Link
                  href="/?lang=fr"
                  className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand"
                >
                  Français
                </Link>
                <Link
                  href="/?lang=en"
                  className="rounded-full border border-border px-3 py-1 transition hover:border-brand hover:text-brand"
                >
                  English
                </Link>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Auto Nexus BJ. Tous droits réservés — Prototype statique pour
            démonstration produit.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sitemap.xml" className="transition hover:text-brand">
              Sitemap
            </Link>
            <Link
              href="/politique-confidentialite"
              className="transition hover:text-brand"
            >
              Confidentialité
            </Link>
            <Link href="/conditions-generales" className="transition hover:text-brand">
              CGU
            </Link>
            <Link href="/mentions-legales" className="transition hover:text-brand">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
