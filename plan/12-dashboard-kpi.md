# Alimenter le dashboard dealer en donnees temps reel

## Objectif
- Transformer le tableau de bord en une vue dynamique qui affiche les KPI reelle (leads, inventory, uploads) pour le concessionnaire connecte.

## Contexte
- `src/app/(dealer)/dashboard/page.tsx` (deplace depuis tache 10) contient des mocks.
- Les statistiques attendues: nombre de leads 30j, temps de reponse, valeur GMV, progression pipeline.
- Les donnees existent partiellement (tables `Lead`, `Vehicle`, `Upload`, `AnalyticsEvent`).

## Etapes detaillees
1. Creer des services `src/server/dashboard.ts` pour calculer les KPIs (requete Prisma avec `where: { dealerId }`).
2. Ajouter un cache de 5 minutes via `unstable_cache` avec tag `dashboard:${dealerId}`.
3. Remplacer le contenu statique par des composants server qui consomment ces services.
4. Ajouter une section timeline dynamique: alimenter a partir des evenements `Lead` (states) et `AnalyticsEvent`.
5. Prevoir un fall back si aucune donnee (afficher message + CTA pour importer inventaire, sans enlever les visuels existants).
6. Ajouter des tests unitaires pour les services (calcul de GMV, pipeline).
7. Actualiser `docs/demo.md` pour decrire la j narration mise a jour.

## Livrables
- Services dashboard fonctionnels.
- Page `dashboard` branchee sur la base.
- Tests de calculs KPI.

## Validation
- Connecte en dealer, la page affiche ses propres chiffres (filtrage par dealerId).
- Les mises a jour (ex: nouveau lead) se reflectent apres invalidation du cache.
