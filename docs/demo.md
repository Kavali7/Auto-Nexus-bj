# Démo Auto Nexus BJ – Script de présentation

## 1. Préparation rapide

- **Env** : `NEXT_PUBLIC_STATIC_DEMO_MODE=true` pour éviter tout write (analytics / favoris).
- **Build conseillé** : `npm run dev` local ou préproduction Vercel (`https://auto-nexus-bj.vercel.app`).
- **Captures à jour** :
  - Desktop 16:9 : `docs/captures/desktop/<slug>-16x9.png`
  - Mobile 9:19.5 : `docs/captures/mobile/<slug>-mobile.png`
- Charger le comparateur avec 2–3 véhicules avant la démo (listing `/voitures` → bouton « Ajouter au comparer »).

## 2. Agenda (20 minutes)

| Slot | Contenu | Capture clé |
| --- | --- | --- |
| 00:00 – 02:00 | Intro + promesse | `desktop/home-hero-16x9.png` |
| 02:00 – 07:00 | Parcours listing → filtres → comparaison | `desktop/cars-list-16x9.png`, `desktop/compare-bar-16x9.png` |
| 07:00 – 12:00 | Fiche véhicule premium + galerie | `desktop/car-detail-gallery-16x9.png`, `mobile/car-detail-gallery-mobile.png` |
| 12:00 – 15:00 | Services B2B & pilier concessionnaires | `desktop/services-16x9.png` |
| 15:00 – 18:00 | Dashboard investisseurs + métriques | `desktop/invest-dashboard-16x9.png` |
| 18:00 – 20:00 | Conclusion + roadmap + call-to-action | `desktop/roadmap-16x9.png` |

## 3. Parcours détaillé

### 3.1 Landing page

1. **Hero** (stats + CTA WhatsApp) – rappeler la proposition premium / shooting photo.
2. **Masonry** : montrer le rendu immersif et les marques.
3. **Bloc stack & roadmap** : souligner Next.js, Supabase, Meilisearch.

> Capture recommandée : `docs/captures/desktop/home-hero-16x9.png`

### 3.2 Listing « Voitures »

1. Démontrer la recherche instantanée (champ + filtres).
2. Montrer les suggestions comparateur (badge).
3. Ajouter 2 voitures au comparateur (barre sticky).

> Captures : `desktop/cars-list-16x9.png`, `desktop/compare-bar-16x9.png`, `mobile/cars-list-mobile.png`

### 3.3 Fiche véhicule

1. Galerie nouvelle génération (zoom, lightbox, thumbnails).
2. Bloc specs + CTA Whatsapp / Appel / E-mail.
3. Animation CompareToggleButton (alerte démo si active).

> Captures : `desktop/car-detail-gallery-16x9.png`, `mobile/car-detail-gallery-mobile.png`

### 3.4 Services & partenaires

1. Section 7 piliers (neufs, entretien, pièces…).
2. CTA deck / investisseur.

> Capture : `desktop/services-16x9.png`

### 3.5 Investisseurs / Dashboard

1. Stats mock (GMV, leads, partenaires).
2. Roadmap 3 phases.
3. Formulaire data-room (démonstration du mode démo pour éviter l’envoi réel).

> Captures : `desktop/invest-dashboard-16x9.png`, `desktop/roadmap-16x9.png`, `mobile/invest-mobile.png`

## 4. Notes d’animation

- **Comparateur** : insister sur la Phase 2 (tableau dynamique, export PDF) en s’appuyant sur `/comparer`.
- **Mode démo** : signaler les popups « simulation » lors des actions comparateur/favoris.
- **Roadmap** : rappeler que Supabase/Prisma/Meilisearch sont prêts côté code (`README.md`, section QA).

## 5. Captures à produire

| Chemin fichier | Description | Résolution |
| --- | --- | --- |
| `docs/captures/desktop/home-hero-16x9.png` | Hero + métriques | 1920×1080 |
| `docs/captures/desktop/cars-list-16x9.png` | Listing avec filtres ouverts | 1920×1080 |
| `docs/captures/desktop/compare-bar-16x9.png` | Barre comparateur active | 1920×1080 |
| `docs/captures/desktop/car-detail-gallery-16x9.png` | Galerie + CTA WhatsApp | 1920×1080 |
| `docs/captures/desktop/services-16x9.png` | Pilier services | 1920×1080 |
| `docs/captures/desktop/invest-dashboard-16x9.png` | Section investisseurs | 1920×1080 |
| `docs/captures/desktop/roadmap-16x9.png` | Roadmap phases | 1920×1080 |
| `docs/captures/mobile/cars-list-mobile.png` | Listing sur mobile | 1179×2556 (ou 390×844 @3x) |
| `docs/captures/mobile/car-detail-gallery-mobile.png` | Fiche + galerie mobile | 1179×2556 |
| `docs/captures/mobile/invest-mobile.png` | Bloc investisseurs mobile | 1179×2556 |

> Ranger les captures dans `docs/captures/desktop/` et `docs/captures/mobile/` pour rester cohérent.

## 6. Ressources complémentaires

- [`docs/visual-checklist.md`](./visual-checklist.md) : procédure QA (Lighthouse, CLS, captures).
- `/docs` → autres notes (pipeline média, import catalogue).
- `README.md` → rappel mode démo + QA visuel.

Bonne démo !
