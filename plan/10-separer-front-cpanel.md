# Detacher et securiser le cPanel concessionnaire

## Objectif
- Isoler le back-office concessionnaire de l espace public et preparer les routes protegees pour le futur login.

## Contexte
- La page `src/app/dashboard/page.tsx` est actuellement accessible par tout le monde et liste des donnees demo.
- Le header public (`src/components/site-header.tsx`) contient un lien `Dashboard`.
- L utilisateur a demande que le cPanel ne soit pas visible par les prospects.

## Etapes detaillees
1. Creer un groupe de routes `(dealer)` dans `src/app/(dealer)/...` avec layout dedie, root `/dealer`.
2. Deplacer la page dashboard actuelle vers `src/app/(dealer)/dashboard/page.tsx`.
3. Supprimer le lien direct vers le dashboard du header public et ajouter un lien dans le footer uniquement si `process.env.NEXT_PUBLIC_SHOW_DEALER_LINK === "true"`.
4. Ajouter un middleware `src/middleware.ts` pour rediriger vers `/dealer/login` quand un utilisateur non authentifie tente d acceder aux routes `(dealer)` (auth implementee dans la tache 11).
5. Mettre en place une redirection `301` depuis l ancienne route `/dashboard` vers `/dealer/dashboard` pour compatibilite (fichier `next.config.ts`).
6. Mettre a jour le sitemap (`src/app/sitemap.ts`) pour exclure les routes `(dealer)`.
7. Documenter la nouvelle arborescence dans `README.md` (section Structure) et dans `docs/demo.md`.

## Livrables
- Nouvelle arborescence `(dealer)`.
- Middleware de garde.
- Mise a jour du header/footer et du sitemap.

## Validation
- `/dashboard` redirige vers `/dealer/dashboard` (ou `/dealer/login` si non connecte une fois l auth en place).
- Le header public ne laisse plus apparaitre un lien cPanel.
