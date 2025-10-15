# Configurer Supabase Postgres et variables Prisma

## Objectif
- Connecter l application Next.js a une base Postgres Supabase afin que Prisma et les API puissent quitter le mode mock.

## Contexte
- Le schema Prisma est defini dans `prisma/schema.prisma`.
- Les services `src/server/vehicles.ts` et `src/server/dealers.ts` retombent sur les jeux `src/data/` quand `DATABASE_URL` est absent.
- Les variables `DATABASE_URL` et `DIRECT_URL` sont exposees dans `.env.example` mais non renseignees en local.
- Les photos deja en ligne (bucket Supabase et `/public/brand/`) doivent rester intactes pendant toute la transition.

## Etapes detaillees
1. Creer le projet Supabase (organisation Auto Nexus) et activer Postgres ainsi que le storage.
2. Recuperer les chaines `postgres://` (primary pour Prisma, migration pour `DIRECT_URL`) depuis le tableau de bord Supabase.
3. Mettre a jour `.env.local` et `.env` avec `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` et `SUPABASE_ANON_KEY` sans supprimer les placeholders de `.env.example`.
4. Lancer `npx prisma generate` depuis `E:\Mes traveaux\AA-SAAS\Auto2\auto-nexus-bj` pour valider l acces.
5. Tester `npx prisma db push --preview-feature` pour confirmer que la structure cible correspond au schema courant; consigner toute difference (notamment indices `gallery`).
6. Documenter dans `README.md` la procedure de recuperation des secrets et rappeler que les medias existants doivent etre preserves jusqu a la mise en production.

## Livrables
- Variables d environnement renseignees et documentees.
- Capture ou log prouvant la connexion Prisma reussie.
- Instructions de sauvegarde des identifiants (coffre fort d equipe).

## Validation
- `npx prisma studio` liste les tables `Dealer`, `Vehicle`, `Lead`, `VehiclePhoto`, `Upload`, `Favorite`, `Visitor`, `AnalyticsEvent`.
- Les pages existantes restent fonctionnelles en mode demo (pas d erreur de connexion).
