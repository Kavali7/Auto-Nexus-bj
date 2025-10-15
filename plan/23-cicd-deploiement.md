# Mettre en place la CI/CD et le plan de deploiement

## Objectif
- Automatiser les verifications (lint, tests, build) et decrire le processus de deploiement vers Vercel (front) et Supabase (base, storage).

## Contexte
- Aucun workflow GitHub Actions n est present.
- Vercel et Supabase devront partager les secrets (.env).
- Les seeds et migrations doivent etre executes lors des releases.

## Etapes detaillees
1. Creer un workflow `.github/workflows/ci.yml` qui execute `npm ci`, `npm run lint`, `npm run test`, `npm run build`.
2. Ajouter un job `deploy` optionnel qui declenche `vercel deploy` (preview) et une verification `prisma migrate deploy` sur Supabase staging.
3. Documenter les secrets requis dans `docs/deployment.md` (ex: `VERCEL_TOKEN`, `SUPABASE_ACCESS_TOKEN`, `STRIPE_SECRET_KEY`).
4. Mettre a jour `README` avec un check-list pre-deploiement (migrations appliquees, reindex meilisearch, compressions images).
5. Ajouter un script `npm run release` qui:
   - execute les migrations,
   - lance le seed si necessaire,
   - reindexe Meilisearch,
   - nettoie le cache Next (revalidate).
6. Preparer un environnement staging (branch `staging` -> Vercel env) pour validations avec les memes photos placeholders.
7. Documenter le rollback plan (restaurer base Supabase, re-deployer version precedente).

## Livrables
- Workflow GitHub Actions actif.
- Documentation de deploiement.
- Script `npm run release`.

## Validation
- Une PR declenche la CI et echoue si lint/tests cassent.
- Le deploiement staging suit la check-list et conserve les medias existants.
