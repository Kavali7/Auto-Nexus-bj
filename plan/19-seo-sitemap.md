# Mettre a jour le SEO et le sitemap dynamiques

## Objectif
- Aligner le referencement avec les donnees temps reel (sitemap, meta tags, JSON-LD) et garantir la coherence apres passage sur Prisma.

## Contexte
- `src/app/sitemap.ts` construit encore un sitemap statique.
- Le JSON-LD dans `src/app/page.tsx` et `src/app/voitures/[slug]/page.tsx` utilise des donnees seed.
- Les pages legales existent (`mentions-legales`, `conditions-generales`, `politique-confidentialite`).

## Etapes detaillees
1. Reimplementer `sitemap.ts` pour interroger Prisma (`getVehicles`, `getDealers`) et generer des URLs avec `lastModified`.
2. Ajouter un sitemap specifique cPanel (non indexe) en l excluant via `robots.txt`.
3. Mettre a jour les meta dynamiques dans `generateMetadata` pour utiliser les champs `Vehicle` (trim, price, heroImage) et `Dealer`.
4. Regenerer les JSON-LD (schema.org Vehicle, Organization) avec les nouvelles URLs et prix en XOF.
5. Ajouter la balise `alternate` si une future version EN est prevue (laisser TODO documente).
6. Mettre en place des tests `npm run lint` custom verifies presence `<script type="application/ld+json">`.
7. Documenter dans `docs/visual-checklist.md` la verification SEO (en local + Search Console).

## Livrables
- sitemap dynamique.
- Meta et JSON-LD mis a jour.
- Tests de lint SEO.

## Validation
- `curl /sitemap.xml` affiche les slugs issus de la base.
- Les pages vehicules contiennent un JSON-LD conforme (valide via test Google Rich Results).
