# Brancher Meilisearch sur la base de donnees

## Objectif
- Alimenter et exploiter Meilisearch avec les vehicules stockes en base pour offrir une recherche instantanee cohaerente entre le front et le back-office.

## Contexte
- Endpoint courant: `src/app/api/search/route.ts` (fallback base quand Meilisearch indisponible).
- Script de seed: `scripts/meilisearch-seed.ts` lit encore `src/data/vehicles`.
- Le cPanel devra reindexer apres chaque modification d inventaire.

## Etapes detaillees
1. Mettre a jour `scripts/meilisearch-seed.ts` pour lire les vehicules via Prisma (`prisma.vehicle.findMany` + join `Dealer` pour `dealerName`).
2. Ajouter des options CLI: `--full`, `--incremental` (envoi uniquement des ids depuis une date).
3. Configurer les attributs filterables/searchables pour couvrir `brand`, `model`, `fuel`, `city`, `condition`, `price`, `dealerName`.
4. Ajouter un webhook (tache Cron supabase ou queue) qui relance `npm run meili:sync` apres creation/mise a jour d un vehicule via le cPanel.
5. Enrichir `VehicleSearchResponse` avec `score` et `highlights` si Meilisearch les renvoie.
6. Ajouter une section de troubleshooting dans `docs/catalog-import.md` (port serveur, master key, rebuild index).

## Livrables
- Script de seed Meilisearch refactorise.
- Documentation mise a jour (`README`, `docs/catalog-import.md`).
- Eventuel job (GitHub Actions ou Supabase Scheduled Function) pour reindexer.

## Validation
- `npm run meili:sync` publie les documents Meilisearch issus de la base.
- `POST /api/search` renvoie `source: "meilisearch"` en mode normal et les hits sont coerents avec la base.
