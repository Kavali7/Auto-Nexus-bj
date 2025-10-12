# Procedure de migration via l'editeur SQL Supabase

Ce runbook explique comment executer les migrations du schema Prisma sur Supabase lorsque l'environnement local ne dispose que d'une connectivite IPv4.

## Contexte

- La connexion directe Supabase (`db.<project>.supabase.co`) publie uniquement un enregistrement AAAA, donc l'IPv6 est requis en local.
- Le trafic de production reste sur le pooler de transactions (`aws-1-us-east-2.pooler.supabase.com`), qui expose des enregistrements A et maintient l'app en ligne meme sans IPv6 cote client.
- Pour les migrations DDL nous devons donc utiliser l'editeur SQL heberge par Supabase, ou tout autre runner disposant d'IPv6.

## Etapes

1. Ouvrir https://app.supabase.com, selectionner le projet puis aller dans `Database > SQL Editor` (connexion primaire).
2. Copier le contenu de `scripts/supabase/sql-editor-migration.sql` dans l'editeur. Mettre a jour ou remplacer ce script des que le schema Prisma evolue.
3. Cliquer sur `Run` et attendre que chaque bloc affiche `SUCCESS`. En cas d'erreur, corriger l'instruction fautive puis relancer uniquement ce bloc.
4. Dans le Table Editor, confirmer la presence des nouvelles relations (`Visitor`, `Favorite`, `AnalyticsEvent`) ainsi que des nouvelles colonnes sur `Vehicle` et `VehiclePhoto` (`virtualTourUrl`, `kind`).
5. De retour dans le depot, conserver le script SQL execute sous controle de version et documenter l'execution manuelle (commentaire de PR, changelog ou runbook).
6. Regenerer le client Prisma en local avec `npm run prisma:generate`, puis lancer les verifications habituelles (`npm run lint`, `npm run build`, etc.). Redemarrer tout serveur de dev long cours pour qu'il charge le nouveau client.

## Liste de verification

- L'execution dans l'editeur SQL renvoie `Success. No rows returned.` pour chaque instruction.
- Le Table Editor affiche les tables et colonnes attendues.
- `npm run prisma:generate` se termine sans avertissement.
- Le code passe le lint/build apres la modification du schema.

## Notes de retour arriere

Si un retour arriere est necessaire, rediger le SQL inverse dans un nouveau fichier (par exemple `scripts/supabase/sql-editor-rollback-<date>.sql`), l'executer via l'editeur SQL et consigner l'operation en parallele de la migration aller.
