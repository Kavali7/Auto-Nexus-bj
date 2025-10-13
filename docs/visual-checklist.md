# Contrôles visuels Auto Nexus BJ

## 1. Audit Lighthouse (desktop & mobile)

1. Démarrer le serveur local : `npm run dev` (ou utiliser l’URL de préproduction).
2. Lancer `npm run lighthouse` (vous pouvez préciser la cible : `npm run lighthouse -- --url=https://preview.autonexus.bj`).
3. Les rapports HTML/JSON sont générés dans `reports/lighthouse/` pour les profils mobile et desktop.
4. Vérifier en priorité :
   - Performance > 90
   - Accessibilité > 90
   - Best practices & SEO sans regression
   - CLS < 0.1 (voir la section 2)

Astuce : exportez les rapports HTML pour les partager dans Notion ou Google Drive.

## 2. Vérifier le CLS (layout shift)

- Les composants critiques (hero, galeries, comparateur) exposent désormais des `sizes` / ratios fixes.  
  En cas de régression, utiliser l’onglet **Performance → Layout Shift Regions** de Chrome DevTools.
- Pour les nouvelles images :
  1. Utiliser `Image` de Next.js avec `width`/`height` ou `fill + sizes`.
  2. Prévoir un conteneur `aspect-[ratio]` si on conserve `fill`.
  3. Tester rapidement : `npm run dev`, ouvrir la page, `Ctrl+Shift+P` → “Layout Shift Regions”.

## 3. Captures et documentation UI

- Le dossier `/docs` sert de base pour les captures dans Notion/Figma.  
  Ajoutez vos screenshots aux sous-dossiers (ex. `docs/captures/<feature>.png`) avant de les intégrer aux decks.
- Pour des captures cohérentes :
  1. `npm run dev`, résolutions conseillées : 1440×900 (desktop) et 390×844 (mobile).
  2. Activer le mode sombre via DevTools si besoin (Device toolbar → rendering).
  3. Nettoyer la barre d’adresse / overlays avant capture.

> Storybook n’est pas encore câblé : le flux de captures se fait via `/docs` et pages réelles.

## 4. Récap bloc-notes QA

- [ ] `npm run lighthouse -- --url=…` exécuté et scores partagés.
- [ ] CLS < 0.1 sur les pages clé (Home, Voitures, Fiche, Comparer).
- [ ] Captures desktop + mobile enregistrées dans `/docs/captures`.
- [ ] Rapports et captures déposés dans l’espace partagé (Notion / Drive).
