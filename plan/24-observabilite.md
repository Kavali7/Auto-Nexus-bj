# Installer l observabilite et l alerting

## Objectif
- Mettre en place le suivi des erreurs, des performances et des indicateurs produit pour anticiper les incidents apres la mise en production.

## Contexte
- Aucun outil type Sentry ou Logflare n est connecte.
- Les logs Next.js ne sont pas centralises.

## Etapes detaillees
1. Integrer Sentry (Next.js + API routes) avec DSN stocke dans les variables Vercel (`SENTRY_DSN`).
2. Ajouter la collecte de logs applicatifs via Vercel Observability ou Logtail (module `src/lib/logging.ts`).
3. Instrumenter les routes critiques (`/api/leads`, `/api/orders`, `/api/uploads`) avec des spans (OpenTelemetry).
4. Mettre en place des dashboards de monitoring (Supabase metrics: connections, latence; Stripe events).
5. Configurer des alertes (ex: >5 erreurs 500 en 5 minutes, Webhook Slack).
6. Documenter le playbook incident dans `docs/operations.md` (qui contacter, comment isoler un bug).
7. Ajouter une verification `npm run sentry:upload-sourcemaps` dans la pipeline CI/CD.

## Livrables
- Integration Sentry/observability dans le code.
- Dashboards ou liens vers les outils de supervision.
- Documentation operationnelle.

## Validation
- Forcer une erreur controlée en local la fait remonter dans Sentry (environnement staging).
- Les alertes Slack se declenchent lors d un test d incident.
