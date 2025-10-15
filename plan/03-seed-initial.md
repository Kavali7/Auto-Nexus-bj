# Industrialiser le seed initial des donnees

## Objectif
- Remplacer l import statique `src/data/*.ts` par un seed Prisma fiable capable de synchroniser concessionnaires, vehicules et galeries dans Supabase Postgres.

## Contexte
- Script actuel: `prisma/seed.ts` lit les mocks TypeScript et recree toutes les tables.
- Les images reelles sont gerees via Supabase Storage et doivent etre preservees (ne pas supprimer les chemins existants).
- La documentation `docs/catalog-import.md` decrit le flux cible.

## Etapes detaillees
1. Auditer `prisma/seed.ts` et convertir les acces aux images pour qu ils lisent le manifeste genere (`scripts/media-manifest.json`) plutot que des URLs en dur.
2. Ajouter des controles: ne pas supprimer les medias existants si la fiche n est pas dans le dataset courant (flag `SAFE_MODE`).
3. Externaliser les donnees seed dans `prisma/seed-data/` (fichiers JSON) pour eviter de bundler des modules front.
4. Rendre le seed idempotent: utiliser `upsert` cote Prisma au lieu de `deleteMany`.
5. Ajouter un mode `--demo` qui garde les photos placeholders (requis pour conserver les visuels actuels jusqu a la livraison).
6. Documenter le processus dans `docs/catalog-import.md` (mise a jour des etapes 4 et 5).

## Livrables
- Nouveau dossier `prisma/seed-data/` (JSON ou CSV).
- Script `prisma/seed.ts` refactorise avec un CLI (`ts-node`).
- Documentation actualisee (README et docs catalog).

## Validation
- `npm run db:seed` peuple la base Supabase locale avec au moins les vehicules actuellement visibles sur le site.
- Les URL d images dans les fiches front continuent de pointer vers les visuels existants.
