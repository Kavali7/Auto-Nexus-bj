# Import catalogue véhicules

Ce guide décrit la marche à suivre pour ajouter de nouveaux véhicules (et leurs médias) dans Auto Nexus BJ.

## 1. Préparer la fiche véhicule

1. Dupliquer une fiche existante dans `src/data/vehicle-definitions.ts`.
2. Renseigner les champs obligatoires :
   - Identifiants : `id`, `slug`, `dealerId`
   - Informations commerciales : `brand`, `model`, `trim`, `year`, `condition`, `price`, `city`, `fuel`, `transmission`
   - Spécifications : `highlights[]`, `specs[]`
   - Galerie : six entrées minimum (`EXTERIOR`, `INTERIOR`, `DETAIL`, `PANORAMA`, …) avec un nommage `brand_model_year_ext01.jpg`.
3. Si le véhicule est associé à un nouveau concessionnaire, ajouter sa fiche dans `src/data/dealer-definitions.ts` (la structure est similaire).

> Conseil : conservez un tableau de suivi (CSV ou Notion) contenant les métadonnées clefs (id, slug, prix, statut, responsable média).

## 2. Générer les visuels

Les placeholders SVG/PNG sont générés automatiquement via les définitions :

```bash
npm run media:prepare   # 1) génère les PNG, 2) met à jour scripts/media-manifest.json
```

Si vous disposez de photos officielles :

1. Copiez les originaux dans `assets/raw-media/...` en conservant la même nomenclature.
2. Relancez `npm run media:manifest` pour regénérer le manifeste sans écraser les fichiers existants.

## 3. Uploader vers Supabase

```bash
npm run media:dry-run   # vérifie poids, blurhash, chemins
npm run media:upload    # push dans le bucket Auto-Nexus-bj
```

- Les variantes `.jpg`, `.webp`, `.avif` sont créées automatiquement (2000 px max).
- Le rapport `scripts/media-upload-result.json` regroupe URLs publiques, blurhash et tailles pour import ultérieur (CSV / Notion).

## 4. Alimenter la base de données

1. Vérifiez les variables d’environnement Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`).
2. (Une seule fois par machine) exécuter `npm run prisma:generate` pour générer le client Prisma.
3. Puis :

```bash
npm run db:seed
```

Le seed supprime et recrée les concessions, véhicules et galeries à partir des définitions TypeScript : l’environnement local et la base Supabase restent synchrones.

## 5. Contrôles UI

- `npm run dev` puis vérifier `/`, `/voitures`, `/voitures/[slug]`, `/comparer`, `/concessionnaires`.
- Utiliser `VehicleMediaUploader` (dashboard) pour s’assurer que la signature d’upload fonctionne avec le nouveau bucket.
- Noter toute anomalie (images manquantes, blurhash absent, lenteur) dans le tableau de suivi.

## 6. Import CSV / automatisations (roadmap)

- Les définitions peuvent être générées à partir d’un CSV en écrivant un convertisseur (`scripts/import-csv.ts` à ajouter).
- Pour un webhook / back-office :
  1. Uploader le media brut (Storage).
  2. Stocker le chemin + métadonnées dans une table `media_queue`.
  3. Exécuter `process-media.ts` en mode worker (queue) pour générer les dérivés et mettre à jour `vehicle_photo`.

Documentez toute intégration supplémentaire dans le Playbook Produit afin de garder le pipeline aligné entre équipes (ops, photo, tech).
