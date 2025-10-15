# Rendre les pages publiques dynamiques

## Objectif
- Brancher toutes les pages publiques sur les donnees Prisma/Supabase afin de refléter l inventaire reel et les infos dealers.

## Contexte
- Les pages `src/app/page.tsx`, `src/app/voitures/page.tsx`, `src/app/voitures/[slug]/page.tsx`, `src/app/concessionnaires/*`, `src/app/services/page.tsx` utilisent encore `src/data`.
- Les services `src/server/*.ts` contiennent deja la logique fallback.
- Les medias existants doivent rester visibles tant que le dealer n a pas valide de nouvelles photos.

## Etapes detaillees
1. Supprimer toutes les importations directes de `src/data` dans les pages et utiliser exclusivement les services `src/server/vehicles` et `src/server/dealers`.
2. Ajouter la gestion des caches revalides (`revalidateTag`) apres mise a jour d un vehicule/ dealer via le cPanel.
3. Gerer les etats vides (ex: pas de vehicule disponible) avec des placeholders reutilisant les images existantes.
4. Mettre a jour les generateurs `generateStaticParams` pour se baser sur la base (notamment `getVehicleSlugs`).
5. Ajouter une page fallback (`not-found.tsx`) enrichie qui propose de contacter un conseiller.
6. Adapater les composants (VehicleMasonry, VehiclesExplorer) pour recevoir les nouveaux champs (published, available).
7. Mettre a jour la documentation (README) pour expliquer les mecanismes de revalidation.

## Livrables
- Pages Next.js consomment les services Prisma.
- Fallbacks bascule sur la base mais gardent option seed si base vide.
- Docs actualisees.

## Validation
- Ajout/edition d un vehicule via le cPanel se reflète sur `/` et `/voitures` apres invalidation du cache.
- Supprimer un dealer du seed ne casse plus la page (car lecture base).
