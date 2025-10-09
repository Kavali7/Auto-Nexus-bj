# Auto Nexus BJ — MVP statique (Next.js + Tailwind)

Démo **en dur** pour présentation client : data JSON, UI moderne, galeries, WhatsApp.
Conception : Growpeak Agence (agence, pas le client).

## Lancement
```bash
npm i
npm run dev
```
Placez votre logo en `public/brand/anx-logo.png` (fourni par le client).

## À brancher ensuite
- Supabase + Prisma (DB)
- Supabase Storage (upload + CDN)
- Meilisearch (recherche instantanée)
- Espace concessionnaire + admin
- Comparateur complet + favoris

Voir `docs/image-kit.md` pour les images (prompts & guidelines).


Les bases d’Auto Nexus BJ : une marketplace auto multi-concessionnaires, hyper visuelle, rapide, et simple. Voilà ma proposition complète (tech + UX + orga) pour qu’on parte sur de bonnes rails — et on ajuste ensemble.
Vision produit
•	Objectif : comparer facilement la même voiture chez plusieurs concessionnaires, voir beaucoup de photos, et contacter (WhatsApp/Phone/Form) en 1 clic.
•	Audience : particuliers & pros au Bénin (FR par défaut, EN option), prix en XOF.
•	Qualité photo : prioritaire. Grilles immersives, galeries 12–20 photos par véhicule, zoom plein écran.
Stack technique (moderne, SEO, rapide)
•	Framework : Next.js (React) + Tailwind CSS + shadcn/ui pour des composants propres.
•	Base de données : PostgreSQL (Supabase) + Prisma.
•	Stockage images : Supabase Storage (CDN, transformations via pipeline externe, WebP/AVIF, blur placeholders).
•	Recherche / filtres : Meilisearch (self-host) ou Algolia (hébergé) pour instant search + typo tolerance.
•	Auth : NextAuth (email/SMS + rôle: admin, concessionnaire, staff).
•	Messagerie : liens WhatsApp deep-link + capture de leads en DB + email notif.
•	Déploiement : Vercel (front) + Supabase (DB/Storage) → rapide et simple.
•	Monitoring/Analytics : Vercel Analytics + LogSnag/Amplitude + Sentry.
Arborescence & pages
•	/ (Accueil) : hero sobre + mega-search, mur de photos (masonry), sections “Neufs”, “Dernières arrivées”, “Par marque”, “Partenaires”, CTA WhatsApp.
•	/voitures : liste + filtres vivants (marque, modèle, année, motorisation, kilométrage, boîte, carb, couleur, ville, état neuf/occas, prix min/max, dispo).
•	/voitures/[slug] : fiche véhicule (galerie 12–20 photos, 360° option, specs tab, historique, garantie, comparer).
•	/comparer : tableau comparatif multi-cards (jusqu’à 4). Point clé : si le même modèle existe chez plusieurs vendeurs, on suggère l’alignement automatique.
•	/concessionnaires : annuaire (logo, rating, ville) + /concessionnaires/[slug] (vitrine + inventaire).
•	/services : 7 piliers (neufs, entretien/garages, pièces, lubrifiants, finance/assurance, location, livraison) avec vos partenaires listés.
•	/a-propos, /contact (WhatsApp, téléphone, formulaire).
•	/dashboard (privé) :
o	Concessionnaire : gérer annonces, photos, prix, dispo, leads, messages.
o	Admin : validation annonces, partenaires mis en avant, modération.
UX clé (l’effet “wahooo”)
•	Masonry photo wall dès l’accueil (lazy-load + blur-up).
•	Comparaison : sticky bar “Ajouter à comparer”, page /comparer avec table specs + mini-galeries par carte.
•	CTA flottant WhatsApp sur mobile + bouton “Appeler”.
•	Skeletons & transitions douces (Framer Motion).
•	Dark mode (bonus), icônes Lucide.
•	Responsive fin (xs→xl), grid densifiée sur desktop.
Données (schéma simplifié)
Entités : Dealer, User, Vehicle, VehicleVariant, Photo, Lead, ServicePartner (garage, pièces, lubrifiants, banque/assurance, location, livraison), Brand, Model.
Exemple Vehicle (principales colonnes) :
•	brand, model, trim, year, condition(neuf/occasion), mileage, fuel, transmission, engine, drivetrain, color_ext/int, doors, vin(option), warranty, price_xof, city, available, highlighted, dealer_id.
•	photos[] (ordre + tags : extérieur, intérieur, moteur, détails, défauts).
•	SEO : slug, meta_title, meta_desc, og_image.
Recherche & comparaison (logique)
•	Normalisation brand/model/trim/year pour reconnaitre “mêmes véhicules”.
•	Comparateur : si 2+ annonces partagent (brand, model, year, fuel, transmission), on propose “Comparer ces offres”.
•	Tri : pertinence (qualité photo + complétude fiche) > récence > prix.
WhatsApp & contact
•	WhatsApp deep-link : https://wa.me/95606058?text=Bonjour%20AUTO%20NEXUS%20BJ...%20[URL_annonce]
•	Boutons : “WhatsApp”, “Appeler”, “Demander une offre”.
•	Lead capture : on crée un Lead (nom, tel, message, annonce, dealer) + email/sms au dealer.
Partenaires (vitrine “Services”)
On intègre vos 7 piliers (avec logos) :
1.	Neufs (CFAO, GET MOTORS, MIG MOTORS, JAPAN MOTORS, SONAM HONDA)
2.	Entretien (AUTO SP, CHALLENGE SA, KWABO)
3.	Pièces (La ROCHE)
4.	Lubrifiants (MOTUL)
5.	Financement/Assurance (ATLANTIQUE BANQUE, Assurance AFG)
6.	Location (LBM)
7.	Livraison (Nexus)
Charte & logo
•	On place ton logo (fourni) dans /public/brand/autonexus-bj.svg et on décline la palette :
o	Bleu primaire (logo) → #1878C8 (ex.)
o	Bleu foncé texte → #0E2C4A
o	Gris clair ui → #F5F7FA
o	Accent vert (validation) → #16A34A
•	Typo : Inter ou Manrope (lisible, moderne).
Images : qualité & pipeline
•	Format : upload → transformation → CDN (WebP/AVIF).
•	Taille : 2000px max côté long (desktop), dérivés : 1200 / 800 / 400.
•	Ratio : 3:2 & 1:1 (tuiles), panoramiques pour hero.
•	Naming : brand_model_year_ext01.jpg…
•	Alt text auto (SEO + accessibilité).
•	Génération avec forma.app : je te propose des prompts types pour héro/illustrations (pas pour les fiches réelles bien sûr) :
o	“high-end car dealership showroom, wide shot, natural light, glossy floor, multiple SUVs and sedans lined, African market context, ultra realistic, 8k, depth of field”
o	“close-up car interior, leather seats, stitching detail, modern infotainment, premium lighting, photorealistic”
o	“outdoor dealership lot, sunny, flags and banners, multiple brands, clean background, photorealistic”
SEO & performance
•	SSR, OpenGraph/Twitter Cards, sitemap.xml, robots.txt.
•	schema.org/Vehicle + Organization pour partenaires.
•	CLS/LCP optimisés (next/image, blurUp, priority hero).
•	i18n (FR → EN en phase 2).
•	RGPD-like : consent cookies minime, pages CGU/mentions.
Sécurité & modération
•	Compte concessionnaire vérifié (Kbis/IFU upload côté admin).
•	Rôles & permissions fins (Prisma + middleware).
•	Audit images (poids max, formats) + antivirus simple.
•	Journal (logs) et alertes (Sentry).
Plan de livraison (phases)
Phase 1 (MVP 4–6 semaines)
•	Accueil, Listing + Filtres, Fiche + WhatsApp, Annuaire Concessionnaires, Dashboard Concessionnaire (CRUD véhicules), Admin validation, SEO de base, Intégration partenaires (pages services).
Phase 2
•	Comparateur avancé, Meilisearch/Algolia, Favoris, 360°, multi-images drag-drop, micro-données schema.org complètes, analytics.
Phase 3
•	Paiement d’acompte (option), chat en temps réel, app PWA, dark mode poussé, recommandation basée sur interactions.
________________________________________
Décisions retenues
1.	Next.js + Vercel + Supabase → ok pour moi
2.	Supabase Storage (images) — je recommande de brancher une pipeline de transformations (Imgix, Cloudflare Images ou Workers).
3.	Meilisearch (gratuit/self) — je propose Meilisearch au départ.
4.	Charte : on garde le bleu du logo comme primaire + Inter/Manrope.
5.	WhatsApp : numéro unique Auto Nexus BJ 95606058 pour tous les contacts 
