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
7. Optionnel : migrer d'anciens assets Cloudinary via `npm run cloudinary:migrate` (necessite un compte Cloudinary et les variables `CLOUDINARY_*`; demarrer en `DRY_RUN=true` pour valider sans ecriture). Les variables supportees : `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER?`, `CLOUDINARY_RESOURCE_TYPE?`, `CLOUDINARY_DELIVERY_TYPE?`, `SUPABASE_MIGRATION_PREFIX?`, `SUPABASE_MIGRATION_UPSERT?`, `MIGRATION_MANIFEST_PATH?`, `DRY_RUN?`.
8. Vérifier la pipeline Upload en local : `npm run supabase:storage:test` génère un fichier texte aléatoire, l'upload via URL signée puis affiche l'URL publique et la date d'expiration (nécessite `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` valides).
9. Tester l'intégration front : `npm run dev` puis utiliser le dashboard > cartes "Upload Supabase Storage (POC)" et "Nouvelle annonce — médias & métadonnées" pour valider l'UX de dépôt et le payload prêt à persister.

> Note : sans services externes, l'app se base sur les mocks (recherche locale, donnees JSON).
> Activez le mode demo statique (`NEXT_PUBLIC_STATIC_DEMO_MODE=true` et `STATIC_DEMO_MODE=true`) pour bloquer les appels analytics/favoris et afficher le message de simulation lors des interactions.

### Supabase Postgres & secrets

- Récupérez `SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` depuis Supabase (`Project Settings > API`). Pour Prisma, gardez `DATABASE_URL` sur le host pgbouncer (`aws-1-us-east-2.pooler.supabase.com:6543`) et `DIRECT_URL` sur l'hôte direct (`db.tqupiggepzqjhpvtnxqy.supabase.co:5432`) en conservant `?sslmode=require`.
- Sauvegardez ces identifiants (y compris le mot de passe Postgres) dans le coffre-fort d'équipe afin d'assurer la rotation et l'accès partagé sécurisé.
- Préservez les médias existants : ne supprimez pas le bucket `Auto-Nexus-bj` ni les assets `public/brand/` tant que la bascule production n'est pas terminée.
- Vérification Prisma :

```bash
npx prisma generate
# ✔ Generated Prisma Client (v6.17.0) to .\node_modules\@prisma\client
```

- `npx prisma db push` échoue actuellement (erreur `P1001`) car l'hôte `db.tqupiggepzqjhpvtnxqy.supabase.co:5432` est injoignable depuis ce poste. Assurez-vous que le port 5432 est ouvert ou créez un tunnel Supabase avant de relancer la commande.

## QA & tests visuels

- Audit complet : `npm run lighthouse -- --url=http://localhost:3000` (rapports HTML/JSON dans `reports/lighthouse/` pour mobile et desktop).
- CLS : les galeries utilisent des ratios fixes, vérifiez toute nouvelle image avec Chrome DevTools → Layout Shift Regions.
- Captures & démo : suivez [`docs/visual-checklist.md`](./docs/visual-checklist.md) pour la QA et [`docs/demo.md`](./docs/demo.md) pour le storytelling + fichiers 16:9 / mobile à produire (`docs/captures/`).

## Supabase Storage & flux upload

- **API `/api/uploads/sign`** : attend `filename`, `contentType`, `folder?`, `expiresIn?`, `upsert?`. Retourne `uploadUrl`, `uploadHeaders`, `publicUrl`, `path`, `expiresAt`.
- **Hook `useSignedUpload`** (`src/hooks/use-signed-upload.ts`) : fournit `uploadFile(file, options)`, `state`, `result`, `reset`. Il s'occupe de la requête POST, du PUT signé et du reporting d'erreurs.
- **Composants front** :
  - `UploadDemo` (dashboard) : vérification manuelle de la route + PUT direct.
  - `VehicleMediaUploader` : intégré au formulaire maquette d'annonce, gère titre + notes et affiche le payload JSON prêt pour Prisma/Supabase.
- **Vérification CLI** : `npm run supabase:storage:test` réalise le flux complet (crée un fichier, signe l'URL, pousse sur Supabase, affiche l'URL publique).
- **Migration Cloudinary** : `npm run cloudinary:migrate` copie les assets source dans le bucket Supabase (support dry-run, manifest JSON). Voir `scripts/cloudinary-to-supabase.ts` pour les options avancées.

## Prochaines etapes suggerees

1. Brancher Meilisearch / Algolia pour rendre les filtres et le comparateur interactifs.
2. Connecter Supabase + Prisma pour persister inventaire, leads, comptes concessionnaires.
3. Finaliser la pipeline Supabase Storage (traitements images, CDN) et instrumentation analytics (Vercel, LogSnag).

Besoin d'une demo guidee, d'un deck ou d'un argumentaire personnalise ? Ping WhatsApp (95606058) ou ouvrez une issue.
Conception : Growpeak Agence (agence, pas le client).

Projet URL :https://tqupiggepzqjhpvtnxqy.supabase.co

SUPABASE_ANON_KEY:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdXBpZ2dlcHpxamhwdnRueHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjAzMTIsImV4cCI6MjA3NTU5NjMxMn0.ypeWL2gRQFLhe6SYAvUV4pGG1KDhGSH-RZ_Y8VrrcvU

SUPABASE_SERVICE_ROLE_KEY:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdXBpZ2dlcHpxamhwdnRueHF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDAyMDMxMiwiZXhwIjoyMDc1NTk2MzEyfQ.ZjiSMW7IoNMcI2rYiNTNHtWNYhsk6l58cBGkcpVh17M

SUPABASE_STORAGE_BUCKET:Auto-Nexus-bj

DATABASE_URL :postgresql://postgres:Auto-Nexus-bj25@db.tqupiggepzqjhpvtnxqy.supabase.co:5432/postgres?sslmode=require

Get-Content .env.local | ForEach-Object {if ($_ -match '^\s*#' -or $_ -match '^\s*$'){ return }$name, $value = $_ -split '=', 2 $trimmed = $value.Trim('"')[Environment]::SetEnvironmentVariable($name, $trimmed, "Process")

npm run db:push
npm run db:seed

ComputerName : aws-1-us-east-2.pooler.supabase.com
RemoteAddress : 3.148.140.216
RemotePort : 6543
InterfaceAlias : Wi-Fi
SourceAddress : 10.50.101.165
TcpTestSucceeded : True

postgresql://postgres.tqupiggepzqjhpvtnxqy:Auto-Nexus-bj25@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require
postgresql://postgres:Auto-Nexus-bj25@db.tqupiggepzqjhpvtnxqy.supabase.co:5432/postgres?sslmode=require

postgresql://postgres.tqupiggepzqjhpvtnxqy:Auto-Nexus-bj2025@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1

Test-NetConnection db.tqupiggepzqjhpvtnxqy.supabase.co -Port 5432

Get-Content .env.local | ForEach-Object {
if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
$name, $value = $_ -split '=', 2
  $trimmed = $value.Trim('"')
  [Environment]::SetEnvironmentVariable($name, $trimmed, "Process")
}

Test-NetConnection aws-1-us-east-2.pooler.supabase.com -Port 6543 -InformationLevel Detailed

Test-NetConnection db.tqupiggepzqjhpvtnxqy.supabase.co -Port 5432 -InformationLevel Detailed

Lancer npm run meili:sync si tu souhaites activer la recherche mockée.

Ou passer par le Supabase CLI depuis le projet :
npx supabase db remote query --file scripts/supabase-storage-policies.sql
(en étant authentifié au CLI avec ton projet).

Important pour moi :Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ResetServerAddresses
ipconfig /flushdns
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ServerAddresses 1.1.1.1,8.8.8.8
Resolve-DnsName db.tqupiggepzqjhpvtnxqy.supabase.co -Type A
Resolve-DnsName db.tqupiggepzqjhpvtnxqy.supabase.co -Type AAAA
Get-NetIPAddress -InterfaceAlias "Wi-Fi" -AddressFamily IPv4
Get-NetIPAddress -InterfaceAlias "Wi-Fi" -AddressFamily IPv6
Test-NetConnection db.tqupiggepzqjhpvtnxqy.supabase.co -Port 5432 -InformationLevel Detailed
Test-NetConnection aws-1-us-east-2.pooler.supabase.com -Port 6543 -InformationLevel Detailed

Alternative sans Prisma

Toute la logique serveur lit/écrit via Prisma Client exporté dans src/lib/prisma.ts:1 et consommé dans les services Next (src/server/vehicles.ts:66, src/server/dealers.ts:36, src/server/visitors.ts:23). Passer "sans Prisma" impliquerait de réécrire ces modules avec pg, supabase-js, ou HTTP RPC, recréer les types, gérer la transformation des données, la mise en cache et les transactions : c'est un chantier important avec faible chance de succès rapide.

npm run build

> auto-nexus-bj@0.1.0 build
> next build --turbopack

▲ Next.js 15.5.4 (Turbopack)

- Environments: .env.local, .env

Creating an optimized production build ...
✓ Finished writing to disk in 142ms
✓ Compiled successfully in 18.6s
✓ Linting and checking validity of types  
 ✓ Collecting page data  
 ✓ Generating static pages (21/21)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app) Size First Load JS
┌ ○ / 7.67 kB 179 kB
├ ○ /\_not-found 0 B 134 kB
├ ƒ /api/analytics 0 B 0 B
├ ƒ /api/dashboard/export 0 B 0 B
├ ƒ /api/favorites 0 B 0 B
├ ƒ /api/search 0 B 0 B
├ ƒ /api/uploads/sign 0 B 0 B
├ ƒ /api/vehicles 0 B 0 B
├ ○ /comparer 2.22 kB 174 kB
├ ○ /concessionnaires 0 B 172 kB
├ ● /concessionnaires/[slug] 0 B 174 kB
├ ├ /concessionnaires/nexus-premium
├ ├ /concessionnaires/cfaomotors
├ ├ /concessionnaires/get-motors
├ └ [+2 more paths]
├ ○ /dashboard 3.09 kB 175 kB
├ ○ /services 0 B 172 kB
├ ○ /voitures 7.32 kB 181 kB
└ ● /voitures/[slug] 2.01 kB 174 kB

- First Load JS shared by all 143 kB
  ├ chunks/079d5ede7af38810.js 58.9 kB
  ├ chunks/5564f493499345f1.js 24.1 kB
  ├ chunks/637fca1de0101f95.js 11.1 kB
  ├ chunks/8082ab48faca5ea1.js 17.2 kB
  └ other shared chunks (total) 31.7 kB

○ (Static) prerendered as static content
● (SSG) prerendered as static HTML (uses generateStaticParams)
ƒ (Dynamic) server-rendered on demand

PS E:\Mes traveaux\AA-SAAS\Auto2\auto-nexus-bj>

prisma studio

"Il faut inspecter correctement le projet pour comprendre. L'utilisation de l'url direct nécessite ipv6. Ce qui n'est pas. Alors les tables ont été crées directeement dans supabase sql. Tout avait été parfait jusqu'à la commande npm run build qui a renvoyé "npm run build

> auto-nexus-bj@0.1.0 build
> next build --turbopack

▲ Next.js 15.5.4 (Turbopack)

- Environments: .env.local, .env

Creating an optimized production build ...
✓ Finished writing to disk in 142ms
✓ Compiled successfully in 18.6s
✓ Linting and checking validity of types  
 ✓ Collecting page data  
 ✓ Generating static pages (21/21)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app) Size First Load JS
┌ ○ / 7.67 kB 179 kB
├ ○ /\_not-found 0 B 134 kB
├ ƒ /api/analytics 0 B 0 B
├ ƒ /api/dashboard/export 0 B 0 B
├ ƒ /api/favorites 0 B 0 B
├ ƒ /api/search 0 B 0 B
├ ƒ /api/uploads/sign 0 B 0 B
├ ƒ /api/vehicles 0 B 0 B
├ ○ /comparer 2.22 kB 174 kB
├ ○ /concessionnaires 0 B 172 kB
├ ● /concessionnaires/[slug] 0 B 174 kB
├ ├ /concessionnaires/nexus-premium
├ ├ /concessionnaires/cfaomotors
├ ├ /concessionnaires/get-motors
├ └ [+2 more paths]
├ ○ /dashboard 3.09 kB 175 kB
├ ○ /services 0 B 172 kB
├ ○ /voitures 7.32 kB 181 kB
└ ● /voitures/[slug] 2.01 kB 174 kB

- First Load JS shared by all 143 kB
  ├ chunks/079d5ede7af38810.js 58.9 kB
  ├ chunks/5564f493499345f1.js 24.1 kB
  ├ chunks/637fca1de0101f95.js 11.1 kB
  ├ chunks/8082ab48faca5ea1.js 17.2 kB
  └ other shared chunks (total) 31.7 kB

○ (Static) prerendered as static content
● (SSG) prerendered as static HTML (uses generateStaticParams)
ƒ (Dynamic) server-rendered on demand

PS E:\Mes traveaux\AA-SAAS\Auto2\auto-nexus-bj>" L'étape suivante devrait être "npm run db:push" . Le PC s'était éteint faute de batérie. Je suis étonné que une fois ce problème reglé, la même commande renvoie une erreur. Que se passe t-il ? Comment régler cette situation?"



npm run media:webp
