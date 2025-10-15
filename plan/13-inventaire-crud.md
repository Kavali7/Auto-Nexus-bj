# Permettre la gestion CRUD de l inventaire

## Objectif
- Offrir dans le cPanel des interfaces pour creer, mettre a jour et archiver les fiches vehicules, avec controles de validation et statut de publication.

## Contexte
- Aucun formulaire back-office n existe actuellement.
- Tables cibles: `Vehicle`, `VehiclePhoto`, `Upload`.
- Les images en production doivent rester jusqu a validation finale.

## Etapes detaillees
1. Creer les routes `(dealer)/inventory` (listing), `(dealer)/inventory/new`, `(dealer)/inventory/[id]/edit`.
2. Utiliser les Server Actions (ou mutations tRPC) pour creer/mettre a jour les vehicules avec validation `zod`.
3. Ajouter des champs `published` (boolean) et `publishedAt` au schema Prisma.
4. Permettre l edition des informations principales: specs, highlights, prix, statut de disponibilité.
5. Integre le composant `VehicleMediaUploader` pour rattacher les photos (voir tache 14).
6. Gestion des droits: un dealer ne peut manipuler que ses vehicules; un admin peut changer le dealer associe.
7. Ajouter une option `dupliquer` pour créer rapidement une variation (copie partielle des champs).
8. Ecrire des tests integration (mutation -> base) et UI (Playwright) pour la creation.

## Livrables
- Pages et formulaires CRUD operationnels.
- Migrations Prisma pour `published` / `publishedAt`.
- Tests garantissant la validation.

## Validation
- Un dealer peut ajouter un vehicule, le voir apparaitre dans `/voitures` une fois publie.
- Les images existantes restent affichees tant que le dealer ne les a pas remplacees.
