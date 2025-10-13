"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCompare } from "@/components/compare-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Voitures", href: "/voitures" },
  { label: "Concessionnaires", href: "/concessionnaires" },
  { label: "Services", href: "/services" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Investisseurs", href: "/investisseurs" },
];

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const { selectedVehicles } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeMap = useMemo(
    () =>
      new Map(
        navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : item.href.startsWith("/#")
                ? pathname === "/"
                : pathname.startsWith(item.href);
          return [item.href, isActive] as const;
        }),
      ),
    [pathname],
  );

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const renderNavItem = (item: (typeof navItems)[number]) => {
    const active = activeMap.get(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-2 text-base font-medium transition hover:text-brand",
          active ? "text-brand" : "text-muted-foreground",
        )}
        onClick={closeMobileMenu}
      >
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full bg-white/85 px-3 py-2 shadow-sm ring-1 ring-border/60 backdrop-blur md:bg-transparent md:px-0 md:py-0 md:shadow-none md:ring-0"
          >
            <Image
              src="/brand/anx-logo.png"
              alt="Auto Nexus BJ"
              width={132}
              height={40}
              priority
              className="h-10 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold tracking-tight text-brand">
                AUTONEX
              </span>
              <span className="text-xs text-muted-foreground">
                Marketplace auto au Bénin
              </span>
            </div>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium md:flex">
            {navItems.map((item) => renderNavItem(item))}
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="md:hidden"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              )}
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden gap-2 md:inline-flex"
            >
              <Link href="/comparer">
                <span>Ouvrir comparateur</span>
                {selectedVehicles.length > 0 ? (
                  <Badge
                    variant="secondary"
                    className="border-brand/20 bg-brand/10 text-brand"
                  >
                    {selectedVehicles.length}
                  </Badge>
                ) : null}
              </Link>
            </Button>
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link
                href="https://wa.me/95606058?text=Je%20souhaite%20planifier%20une%20demo%20Auto%20Nexus%20BJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Planifier demo
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMobileMenu}
      />

      <aside
        id="mobile-menu"
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-200 md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex h-full flex-col gap-6 px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Menu
            </p>
            <Button type="button" size="sm" variant="ghost" onClick={closeMobileMenu}>
              Fermer
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => renderNavItem(item))}
          </nav>
          <div className="mt-auto space-y-3 pb-4">
            <Button asChild className="w-full gap-2">
              <Link href="/comparer" onClick={closeMobileMenu}>
                <span>Ouvrir le comparateur</span>
                {selectedVehicles.length > 0 ? (
                  <Badge
                    variant="secondary"
                    className="border-brand/20 bg-brand/10 text-brand"
                  >
                    {selectedVehicles.length}
                  </Badge>
                ) : null}
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link
                href="https://wa.me/95606058?text=Je%20souhaite%20planifier%20une%20demo%20Auto%20Nexus%20BJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Direct
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
