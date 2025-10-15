# Mettre en place l authentification concessionnaires

## Objectif
- Proteger le cPanel via une authentification securisee avec gestions des roles (admin Auto Nexus vs dealer).

## Contexte
- Aucune table utilisateur n est definie pour les logins.
- Le package `@supabase/auth-helpers-nextjs` est installe mais non configure.
- Les futures routes `(dealer)` exigeront un utilisateur connecte.

## Etapes detaillees
1. Ajouter au schema Prisma les tables `DealerUser` (email unique, password hash, role) et `Session` si NextAuth Credentials est utilise.
2. Mettre en place NextAuth (ou Supabase Auth) dans `src/app/api/auth/[...nextauth]/route.ts` avec provider Credentials.
3. Utiliser `bcrypt` pour stocker les mots de passe; ajouter un script `scripts/create-dealer-user.ts`.
4. Ajouter un middleware serveur pour injecter l utilisateur courant dans `auth()` (Next 15) ou via `getServerSession`.
5. Creer les pages `src/app/(dealer)/login/page.tsx` et `src/app/(dealer)/logout/route.ts`.
6. Gerer les roles: `dealer` ne voit que ses donnees, `admin` accede a toutes les concessions et peut changer les stats.
7. Documenter la procedure de creation d un compte dans `docs/demo.md` et `README`.

## Livrables
- Tables Prisma et migrations correspondantes.
- Configuration NextAuth / Supabase Auth.
- Formulaire de connexion fonctionnel.

## Validation
- Un compte dealer peut se connecter et acceder a `/dealer/dashboard`.
- Un utilisateur non authentifie est redirige vers `/dealer/login`.
