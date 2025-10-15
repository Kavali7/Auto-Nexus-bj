# Construire le pipeline de leads dans le cPanel

## Objectif
- Donner aux concessionnaires un tableau de bord dedie pour consulter, qualifier et commenter les leads provenant du site.

## Contexte
- Table `Lead` (status enum) existe mais aucune UI.
- Le dashboard affiche des chiffres statiques.
- Les commerciaux utilisent WhatsApp; il faut afficher les informations utiles sans reveler le cPanel aux prospects.

## Etapes detaillees
1. Creer une page `(dealer)/leads` listant les leads actifs classes par statut (`NEW`, `CONTACTED`, `QUALIFIED`, `WON`, `LOST`).
2. Ajouter la possibilite de changer le statut et d ajouter des notes internes (nouvelle table `LeadNote` avec `authorId`, `content`).
3. Afficher le contexte (vehicule associe, source, message client) et un lien rapide `Ouvrir WhatsApp` via `buildWhatsappLink`.
4. Ajouter des filtres (par periode, par vehicule).
5. Prevoir une exportation CSV (btn "Exporter 30 jours") appelle `GET /api/dashboard/export` retravailler pour lire la base (plus les seeds).
6. Mettre en place des notifications internes (badge sur le menu cPanel quand nouveaux leads non vus).
7. Ecrire des tests UI (Playwright) pour la transition `NEW -> CONTACTED`.

## Livrables
- Nouvelle interface leads.
- Migrations pour `LeadNote` et eventuel `Lead.assignedUserId`.
- Export CSV ou JSON a jour.

## Validation
- Un lead cree via `/api/leads` apparait presque instantanement dans `(dealer)/leads`.
- Les changements de statut sont persistes et visibles par les autres membres de l equipe.
