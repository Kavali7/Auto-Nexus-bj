# Renforcer la securite et la conformite

## Objectif
- Garantir que l application respecte les bonnes pratiques (RLS, rate limiting, RGPD light) et proteger les donnees sensibles.

## Contexte
- Les policies Supabase Storage sont definies dans `scripts/supabase-storage-policies.sql` mais a valider.
- Les routes API n ont pas de rate limiting.
- Les logs contiennent potentiellement des donnees personnelles.

## Etapes detaillees
1. Activer les policies RLS sur les tables sensibles (`Vehicle`, `Lead`, `Order`, `ServiceRequest`) en utilisant des roles `service_role` et `anon` appropries.
2. Ajouter un middleware API (ex: `lib/rate-limit.ts`) pour limiter les requetes par adresse IP, en particulier sur `/api/leads`, `/api/orders`, `/api/uploads`.
3. Masker les champs sensibles dans les logs (telephone, email) ou utiliser une function utilitaire de redaction.
4. Mettre a jour `docs/politique-confidentialite` avec la collecte de leads/analytics.
5. Introduire un mecanisme de consentement cookies si analytics non essentiels (banniere simple).
6. Faire un audit des packages et ajouter un script `npm run audit:ci`.
7. Documenter la procedure d escalation en cas de fuite dans `docs/README.md`.

## Livrables
- Policies SQL appliquees (script mis a jour).
- Middleware rate limiting.
- Documentation RGPD et securite.

## Validation
- Les requetes non authentifiees ne peuvent pas lister les leads via Supabase direct.
- Les tests automatises verifient le respect des limites (ex: plus de 10 leads/minute -> 429).
