# Activer les uploads signes Supabase

## Objectif
- Permettre aux concessionnaires d uploader des medias via Supabase Storage avec des URLs signees et stocker les metadonnees utiles.

## Contexte
- Route `src/app/api/uploads/sign/route.ts` renvoie un message demo.
- Le hook `useSignedUpload` et le composant `VehicleMediaUploader` attendent un payload complet (uploadUrl, headers, publicUrl, etc.).
- Les photos existantes doivent rester accessibles jusqu a la mise en production.

## Etapes detaillees
1. Implementer la route `POST` pour generer une URL signe via Supabase Storage (`createSignedUploadUrl`).
2. Valider les inputs (filename, contentType, folder) et imposer une liste blanche de dossiers (`vehicles`, `dealers`, `services`).
3. Enregistrer chaque upload dans la table `Upload` (prisma) avec les dimensions si disponibles.
4. Ajouter une verification de quota (taille max, type MIME) cote serveur.
5. Mettre a jour `useSignedUpload` pour lire les nouveaux champs (token, expiresIn) et gerer les erreurs (401, 403).
6. Adapter `VehicleMediaUploader` pour creer une entree provisoire dans la base (table `VehiclePhoto` quand rattache a un vehicle) tout en laissant les images existantes intactes tant que le vehicle n est pas publie.
7. Documenter dans `docs/media-pipeline.md` la difference entre le flux demo (placeholders) et le flux prod.

## Livrables
- Route `/api/uploads/sign` operationnelle.
- Hook front et uploader mis a jour.
- Documentation actualisee.

## Validation
- Un upload depuis le cPanel cree une ressource dans le bucket Supabase et un enregistrement `Upload`.
- Les images historiques restent visibles (aucune suppression automatique).
