# Journaliser les evenements analytics

## Objectif
- Capturer les evenements front (visites, clics CTA, comparateur) dans la table `AnalyticsEvent` pour alimenter les dashboards et la roadmap produit.

## Contexte
- Route `src/app/api/analytics/route.ts` retourne actuellement un message demo.
- Le schema Prisma contient `AnalyticsEvent` (optionnel `visitorId`).
- Le hook front `useDemoNotice` neutralise les appels en mode demo (`isStaticDemoMode`).

## Etapes detaillees
1. Appliquer une validation de payload (event obligatoire, payload JSON optionnel) dans `route.ts`.
2. Identifier le visiteur via `readVisitorTokenFromCookies` et creer un visiteur si absent (comme pour les favoris).
3. Persister chaque event avec `prisma.analyticsEvent.create`.
4. Implementer un garde-fou: limiter a 1 event par seconde et par visiteur (rate limiting simple en memoire + failover).
5. Ajouter une option `process.env.STATIC_DEMO_MODE` pour continuer a court-circuiter les ecritures lors des demos.
6. Mettre a jour le front (helpers analytics) pour envoyer un body minimal (event, context, metadata).
7. Preparer une requete SQL dans `docs/supabase-sql-editor.md` pour exploiter les events (ex: stats comparateur).

## Livrables
- API analytics fonctionnelle.
- Documentation pour la consommation des donnees.
- Tests (unitaire sur la validation, integration sur la persistance).

## Validation
- En mode prod, `POST /api/analytics` avec `event=cta_whatsapp` cree une ligne dans `AnalyticsEvent`.
- Les dashboards (tache 12) peuvent lire ces donnees.
