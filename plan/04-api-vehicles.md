# Remplacer l API `/api/vehicles` par des operations Prisma

## Objectif
- Fournir une API REST fiable pour les vehicules (listing, creation, mise a jour future) en s appuyant sur Prisma et en supprimant les messages demo.

## Contexte
- Fichier actuel: `src/app/api/vehicles/route.ts` renvoie le seed statique.
- Les helpers de lecture se trouvent dans `src/server/vehicles.ts`.
- Le front `src/components/vehicles-explorer.tsx` attends des filtres (brand, city, fuel, priceMin, priceMax).

## Etapes detaillees
1. Introduire une validation `zod` pour les parametres `GET` (limite, pagination, filtres) dans `route.ts`.
2. Utiliser Prisma `vehicle.findMany` avec `where` dynamique pour couvrir tous les filtres et un tri `(featured DESC, updatedAt DESC)`.
3. Remplacer le message demo par un champ `source: "database"` conserve uniquement pour debug.
4. Pour `POST`, accepter un body valide (brand, model, price, dealerId, gallery minimal) et creer le vehicule avec `VehiclePhoto` associes, en verifiant que le `dealerId` existe.
5. Ajouter une gestion d erreurs standardisee (400 pour validation, 404 pour dealer manquant, 500 pour erreurs Prisma) et logger via `console.error`.
6. Ecrire des tests e2e (Playwright ou Supertest) couvrant `GET` et `POST`.
7. Mettre a jour `src/server/vehicles.ts` pour supprimer les clones `seed` quand la base repond correctement (garder un fallback derriere un flag `USE_SEED_FALLBACK`).

## Livrables
- Nouveau handler `GET`/`POST` complet.
- Tests automatise couvrant la route.
- Documentation d API (README ou `docs/api.md`).

## Validation
- Requete `GET /api/vehicles?brand=Toyota` renvoie les enregistrements Prisma.
- Creation d un vehicule via `POST` visible dans Supabase et sur `/voitures`.
