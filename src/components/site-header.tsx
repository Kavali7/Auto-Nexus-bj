"use client";

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
  { label: "Comparer", href: "/comparer" },
];

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const { selectedVehicles } = useCompare();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/brand/anx-logo.png"
            alt="Auto Nexus BJ"
            width={40}
            height={40}
            priority
            className="h-10 w-auto"
          />
          <span className="text-lg font-semibold tracking-tight text-brand whitespace-nowrap">
            Auto Nexus BJ
          </span>
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href.startsWith("/#")
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition hover:text-brand",
                  active ? "text-brand" : "text-muted-foreground",
                )}
              >
                {item.label}
                {item.href === "/comparer" && selectedVehicles.length > 0 ? (
                  <Badge
                    variant="secondary"
                    className="ml-2 border-brand/20 bg-brand/10 text-brand"
                  >
                    {selectedVehicles.length}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
            <Link href="/comparer">Ouvrir comparateur</Link>
          </Button>
          <Button asChild size="sm">
            <Link
              href="https://wa.me/95606058?text=Je%20souhaite%20planifier%20une%20d%C3%A9mo%20Auto%20Nexus%20BJ"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact WhatsApp
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
