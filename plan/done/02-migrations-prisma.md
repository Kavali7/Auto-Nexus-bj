# Stabiliser les migrations Prisma

## Objectif
- Fournir un historique de migrations Prisma propre et versionne pour que les environnements (local, preprod, prod) partagent le meme schema.

## Contexte
- Le schema SQL initial est aussi present dans `prisma/schema-init.sql`.
- Aucune migration Prisma n est commit (dossier `prisma/migrations` absent).
- Les services Next utilisent `unstable_cache` et attendent des indices (`gallery.position`) qui doivent rester coherents.

## Etapes detaillees
1. Nettoyer toute divergence eventuelle avec `npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-database postgres://...`.
2. Generer une migration initiale `npx prisma migrate dev --name init --create-only` basee sur l etat actuel du schema.
3. Comparer la migration generee avec `prisma/schema-init.sql` et resoudre les ecarts manuellement (types JSON, tableaux `text[]`).
4. Ajouter si besoin des index explicites (`Vehicle.slug`, `Vehicle.featured`, `Lead.status`, `VehiclePhoto.vehicleId_position_idx`).
5. Executer `npx prisma migrate deploy` contre une base jetable pour verifier la reproductibilite.
6. Committer le dossier `prisma/migrations/` et mettre a jour la documentation de lancement (README).

## Livrables
- Dossier `prisma/migrations/*` contenant au minimum la migration `init`.
- Rapport d execution des migrations (capture CLI).

## Validation
- `npx prisma migrate status` doit afficher `Database schema is up to date!`.
- Les tests manuels de lecture dans `src/server/vehicles.ts` continuent de repondre.
