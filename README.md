# Auto Nexus BJ — MVP statique

Prototype Next.js de démonstration pour poser l’expérience “wow” Auto Nexus BJ : données mockées, UI premium, CTA WhatsApp partout et comparatif multi-concessionnaires en préparation.

## Démarrage rapide
- `npm install`
- `npm run dev`
- ouvrir `http://localhost:3000`

> Turbopack est actif par défaut (`next dev --turbopack`). Repassez sur Webpack si besoin : `npm run dev -- --no-turbo`.

## Structure du projet
- `src/app/` — App Router (accueil, `/voitures`, `/voitures/[slug]`, loaders…).
- `src/components/` — design system shadcn/ui + composants maison (masonry, cards, animations).
- `src/data/` — datasets mock typés (`vehicles`, `dealers`, `services`, `types`).
- `src/lib/` — helpers (`cn`, formatage prix/km, génération deeplink WhatsApp).
- `public/brand/` — assets fournis (logo Auto Nexus BJ).
- `docs/` — vision produit complète (README historique + “La trame du projet.docx”).

## Routes statiques disponibles
- `/` — landing MVP : hero, stats, mur photo masonry, services & concessionnaires animés.
- `/voitures` — listing cartes + filtres mockés, bloc comparateur (phase 2).
- `/voitures/[slug]` — fiche véhicule : hero immersif, galerie, specs, CTA contact, inventaire lié.

Des skeletons (`loading.tsx`) accompagnent chaque vue et Framer Motion livre les reveals au scroll.

## Stack & tooling
- **Next.js 15** (App Router) + **React 19**.
- **Tailwind CSS 4** + tokens Auto Nexus BJ (`tailwind.config.ts`, `globals.css`).
- **shadcn/ui** (button, card, badge, tabs, skeleton) + `class-variance-authority`.
- **Framer Motion** pour les animations, `tailwind-merge`, `clsx`, `radix-slot`.
- **TypeScript strict**, ESLint flat config, Prettier (`npm run lint`, `npm run format`).

## Prochaines étapes suggérées
1. Alimenter `/concessionnaires/[slug]` + `/services` à partir des datasets (`src/data`).
2. Brancher de vrais filtres (Meilisearch) + comparateur sticky bar.
3. Intégrer Supabase/Prisma, Cloudinary & capture de leads (WhatsApp + DB).

Besoin d’un tour guidé ou d’une priorité produit ? Ping WhatsApp ou ouvrez une issue directement. 🚘⚡
