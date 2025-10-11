# Pipeline média Supabase Storage

Ce document décrit la procédure de préparation et d’upload des médias officiels Auto Nexus BJ vers Supabase Storage.

## 1. Préparer les originaux

- Placez les fichiers fournis par l’équipe photo dans `assets/raw-media/...` (non versionné).
- Respectez le format `brand_model_year_ext01.jpg` (ou `_int01`, `_detail01`, etc.).
- Vérifiez que les images sources sont en haute résolution (≥ 3000 px côté long) et exemptes de watermark.

## 2. Générer les placeholders & le manifeste

Les définitions véhicules/concessionnaires sont décrites dans :

- `src/data/vehicle-definitions.ts`
- `src/data/dealer-definitions.ts`

Chaque entrée fixe le chemin cible (`vehicles/...`, `dealers/...`), la légende, le type de média et l’ordre d’affichage. Deux commandes automatisent ensuite la préparation :

```bash
npm run media:placeholders   # génère des visuels SVG/PNG depuis les définitions
npm run media:manifest       # construit scripts/media-manifest.json
```

> Astuce : `npm run media:prepare` enchaîne les deux étapes.

Les fichiers intermédiaires sont générés dans `assets/raw-media/...` et ne sont pas versionnés.

## 3. Vérifier la préparation

```bash
npm run media:dry-run
```

- Redimensionne en 2000 px, optimise JPEG/WebP/AVIF et calcule le blurhash **sans uploader**.
- La sortie console récapitule dimensions et poids attendus.
- Corrigez les éventuelles erreurs (fichier manquant, nommage, etc.).

## 4. Uploader vers Supabase

```bash
npm run media:upload
```

- Uploade chaque variante vers le bucket `Auto-Nexus-bj` (`vehicles/`, `dealers/`, `services/`).
- Conserve les métadonnées (label, position, kind, blurhash, dimensions) dans `scripts/media-upload-result.json`.
  > Supabase ne supporte pas encore l’écriture directe des métadonnées via l’API JS : les informations sont stockées côté BD (`vehicle_photos`) et dans le manifeste JSON.
- Génère `scripts/media-upload-result.json` contenant toutes les URLs et blurhash calculés.

## 5. Intégration dans le front

1. Les définitions TypeScript appellent automatiquement `getPublicStorageUrl`, aucune URL absolue n’est codée en dur.
2. Exécutez `npm run db:seed` après `prisma generate` pour synchroniser la base Supabase avec les nouveaux médias.
3. Archivez `scripts/media-upload-result.json` dans le coffre-fort projet (il référence toutes les variantes).

## 6. Bonnes pratiques

- Validez les règles RLS (voir `scripts/supabase-storage-policies.sql`) avant mise en production.
- Activez le CDN custom (`SUPABASE_CDN_URL=https://cdn.autonexus.bj`) dès que le domaine est prêt.
- Gardez `media-upload-result.json` hors dépôt (contient des chemins sensibles) mais archivez-le dans le coffre-fort projet.
- Planifiez une rotation trimestrielle des blurhash si de nouvelles images remplacent des anciennes.

## 7. Nettoyage / maintenance

- Pour supprimer des visuels obsolètes : `supabase.storage.from(bucket).remove(['vehicles/...'])`.
- Après un batch important, lancer `npm run supabase:storage:test` pour s’assurer que les uploads signés fonctionnent toujours.
- Documenter chaque ajout dans le Notion “Playbook Média” (date, source, droits, responsable).
