# Mettre en place la strategie de tests automatises

## Objectif
- Couvrir les couches critiques (services Prisma, API, UI) avec des tests automatises pour securiser les evolutions.

## Contexte
- Aucun framework de test n est configure (pas de jest/vitest).
- Des scripts CLI existent (lighthouse) mais pas de regression tests.

## Etapes detaillees
1. Installer Vitest (unitaires) et Testing Library React pour les composants client.
2. Configurer Playwright ou Cypress pour les tests end-to-end (workflow: lead creation, upload media, reservation).
3. Ajouter un script `npm run test` qui orchestre `vitest run` et `playwright test`.
4. Ecrire des tests unitaires pour:
   - `src/lib/format.ts`
   - Services Prisma (vehicles, dealers, dashboard).
5. Ecrire des tests API (Supertest ou Next test client) pour `/api/vehicles`, `/api/leads`, `/api/uploads/sign`.
6. Ajouter des fixtures en base via Prisma pour les tests (seeds specifiques, docker Postgres).
7. Integrer ces tests dans la pipeline CI (voir tache 23).

## Livrables
- Config Vitest + Playwright.
- Suites de tests initiales.
- Documentation `README` (commande `npm run test` + prerequisites).

## Validation
- `npm run test` reussit en local.
- Les tests e2e couvrent au minimum un parcours client (favoris -> lead -> verification cPanel).
