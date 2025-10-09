import Link from "next/link";

export function SiteFooter(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="text-base font-semibold text-foreground">
            Auto Nexus BJ
          </p>
          <p>
            Marketplace auto premium — MVP statique Next.js + Tailwind (Phase 1).
          </p>
          <p>© {year} Auto Nexus BJ. Tous droits réservés.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/voitures" className="transition hover:text-brand">
            Voitures
          </Link>
          <Link
            href="/concessionnaires"
            className="transition hover:text-brand"
          >
            Concessionnaires
          </Link>
          <Link href="/services" className="transition hover:text-brand">
            Services
          </Link>
          <Link href="/comparer" className="transition hover:text-brand">
            Comparateur
          </Link>
          <Link
            href="mailto:hello@autonexus.bj"
            className="transition hover:text-brand"
          >
            hello@autonexus.bj
          </Link>
        </div>
      </div>
    </footer>
  );
}
