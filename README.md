# Auto Nexus BJ - MVP statique

Prototype Next.js (App Router) pour mettre en scene l'univers Auto Nexus BJ : contenus mocks, UI premium, filtres instantanes, comparateur, services et pitch investisseurs. Tout est pret pour convaincre partenaires et levee de fonds.

## Demarrage rapide
- `npm install`
- `npm run dev`
- ouvrir `http://localhost:3000`

> Turbopack est actif par defaut (`next dev --turbopack`). Pour revenir sur Webpack : `npm run dev -- --no-turbo`.

## Structure
- `src/app/` : pages App Router (landing, voitures, concessionnaires, services, dashboard, comparer...).
- `src/components/` : design system shadcn/ui + composants maison (masonry, compare bar, explorers, dashboard UI...).
- `src/data/` : datasets mock (vehicles, dealers, services, types).
- `src/lib/` : helpers (formatage prix, WhatsApp deeplink, compare context...).
- `public/brand/` : logo et assets fournis.
- `docs/` : vision produit originale (README historique + La trame du projet.docx).

## Pages & fonctionnalites majeures
- `/` : landing immersive (hero, stats, mur photo masonry, stack, services, concessionnaires, bloc investisseurs + structured data JSON-LD).
- `/voitures` : listing mock Meilisearch avec filtres instantanes, suggestions comparateur, CTA demo.
- `/voitures/[slug]` : fiche vehicule premium (galerie, specs, CTA WhatsApp/Appel, comparateur pret).
- `/comparer` : comparateur statique (cartes, tableau specs) connecte au contexte "Ajouter a comparer".
- `/services` : presentation des 7 piliers + CTA deck.
- `/concessionnaires` & `/concessionnaires/[slug]` : annuaire et vitrines detaillees (stats, galerie, inventaire).
- `/dashboard` : maquette tableau de bord concessionnaire (KPIs leads, pipeline, inventaire, actions rapides).

## Points techniques clefs
- Next.js 15 (App Router) + React 19 + Tailwind CSS 4.
- shadcn/ui (button, badge, card, tabs, skeleton, input...) + class-variance-authority + tailwind-merge.
- Framer Motion pour les reveals scroll, skeletons pour loaders, context compare persistant (localStorage).
- Metadata & SEO : `metadata` par page, JSON-LD AutoDealer, sections investisseurs dediees.
- Tooling : TypeScript strict, ESLint flat config, Prettier, scripts `npm run lint`, `npm run format`.

## Setup data & services
1. Copier `.env.example` vers `.env.local` puis renseigner Meilisearch, Supabase (URL, ANON, SERVICE_ROLE, STORAGE_BUCKET) et Postgres.
2. Lancer Meilisearch local (`./meilisearch --master-key ...`) puis `npm run meili:sync` pour indexer les vehicules mock.
3. Initialiser la base : `npm run prisma:generate`, `npm run db:push`, puis `npm run db:seed`.
4. Initialiser le bucket Supabase Storage : `npm run supabase:storage:init` (cree le bucket `SUPABASE_STORAGE_BUCKET` si besoin).
5. Appliquer les policies RLS fournies dans `scripts/supabase-storage-policies.sql` depuis la console SQL Supabase (lecture publique + uploads authentifies).
6. Optionnel : connecter une CDN (Fastly, Cloudflare) pour servir les assets du bucket si besoin.

> Note : sans services externes, l'app se base sur les mocks (recherche locale, donnees JSON).

## Prochaines etapes suggerees
1. Brancher Meilisearch / Algolia pour rendre les filtres et le comparateur interactifs.
2. Connecter Supabase + Prisma pour persister inventaire, leads, comptes concessionnaires.
3. Finaliser la pipeline Supabase Storage (traitements images, CDN) et instrumentation analytics (Vercel, LogSnag).

Besoin d'une demo guidee, d'un deck ou d'un argumentaire personnalise ? Ping WhatsApp (+229 62 45 90 12) ou ouvrez une issue.
