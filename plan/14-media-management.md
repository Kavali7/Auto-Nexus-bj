# Gerer les medias vehicules dans le cPanel

## Objectif
- Offrir aux concessionnaires un module complet de gestion des galeries (upload, ordre, suppression douce) en preservant les visuels existants.

## Contexte
- `VehicleMediaUploader` cree uniquement des lots temporaires.
- Table `VehiclePhoto` contient `kind`, `position`, `url`.
- Les photos actuelles doivent rester affichees jusqu a la livraison finale.

## Etapes detaillees
1. Ajouter un champ `isPlaceholder` (boolean) a `VehiclePhoto` pour distinguer les visuels temporaires.
2. Implementer des actions backend pour:
   - Uploader un media -> creer une entree `Upload` puis `VehiclePhoto`.
   - Reordonner (mettre a jour `position`).
   - Supprimer logicielle (`deletedAt` a ajouter dans la table) afin de conserver l historique.
3. Ajouter une interface dans `(dealer)/inventory/[id]/media` affichant la galerie existante + dropzone.
4. Autoriser l import d un ensemble (drag&drop multiple) avec feedback progressif.
5. Prevoir un bouton `Restaurer placeholders` pour reafficher les images demo tant que la nouvelle serie n est pas validee.
6. Mettre a jour `VehicleGallery` cote front pour ignorer les photos `deletedAt != null`.
7. Documenter dans `docs/media-pipeline.md` la marche a suivre pour remplacer proprement les visuels.

## Livrables
- Migrations Prisma (`isPlaceholder`, `deletedAt`).
- Interfaces UI pour la gestion des galeries.
- Documentation et tests (ordre, suppression, restauration).

## Validation
- Un dealer peut ajouter une photo, modifier l ordre, et la voir apparaitre sur la fiche publique en moins d une minute.
- Les photos placeholder restent visibles tant que le dealer ne publie pas la nouvelle serie.
