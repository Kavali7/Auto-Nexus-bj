# Activer les favoris persistants par visiteur

## Objectif
- Permettre aux visiteurs d enregistrer leurs vehicules favoris dans la base, avec un cookie de session et une API REST coherente.

## Contexte
- Route actuelle `src/app/api/favorites/route.ts` retourne un message demo.
- La logique serveur `src/server/favorites.ts` lit Prisma mais n est jamais invoquee.
- Le cookie visiteur est gere par `src/server/visitors.ts`.

## Etapes detaillees
1. Implementer `GET`, `POST`, `DELETE` dans `route.ts` en utilisant `readVisitorTokenFromCookies` pour identifier le visiteur.
2. Si aucun cookie n existe, appeler `createVisitorSession()` puis `attachVisitorCookie`.
3. Pour `POST`, valider le body (`vehicleId`) avec `zod`, verifier l existence du vehicule, puis `prisma.favorite.upsert`.
4. Pour `DELETE`, accepter `vehicleId` dans la query string et supprimer l entree correspondante.
5. Mettre a jour `src/components/compare-context.tsx` pour requeter `/api/favorites` (prefetch SSR via `cookies()` lorsque possible) afin de synchroniser compare et favoris.
6. Ajouter une gestion optimiste et des messages UX dans `VehicleCard`.
7. Ecrire des tests API et un test Playwright confirmant qu un favori persiste apres rafraichissement.

## Livrables
- Route API fonctionnelle.
- Mise a jour du front pour consommer l API.
- Tests associes.

## Validation
- Un visiteur peut marquer un vehicule favoris, recharger la page et le badge reste actif.
- Les enregistrements apparaissent dans la table `Favorite` de Supabase.
