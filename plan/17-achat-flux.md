# Mettre en place le flux d achat ou reservation

## Objectif
- Permettre aux clients de reserver un vehicule (acompte ou demande de facture proforma) et offrir aux dealers un suivi back-office.

## Contexte
- Le site propose uniquement des CTA WhatsApp.
- Aucun schema ne couvre les commandes.
- Il faut conserver les photos actuelles pour les fiches pendant ce chantier.

## Etapes detaillees
1. Ajouter une table `Order` (id, vehicleId, dealerId, visitorId?, customerName, phone, email, amount, currency, status, paymentIntentId?, createdAt).
2. Integrer Stripe (ou autre PSP) via un endpoint `/api/checkout/create-session` qui cree la session d acompte (montant configurable).
3. Ajouter un bouton `Reserver ce vehicule` sur `src/app/voitures/[slug]/page.tsx` qui ouvre un modal de reservation.
4. Prevoir un mode `demande de devis` (sans paiement) pour les clients entreprises, en reutilisant la table `Order` avec `status = QUOTE_REQUEST`.
5. Dans le cPanel, creer `(dealer)/orders` listant les reservations, statut (PENDING_PAYMENT, PAID, CANCELLED) et justificatifs.
6. Ajouter des webhooks Stripe pour mettre a jour le statut de l order et notifier le dealer (voir tache 20).
7. Documenter les flux et les limites (aucun debit reel en mode demo) dans `README` et `docs/demo.md`.

## Livrables
- Migrations Prisma (table `Order`).
- Endpoints checkout + webhook.
- Interfaces publiques et cPanel.
- Documentation et tests (mock Stripe en local).

## Validation
- En local, creation d une session de paiement renvoie une URL Stripe et cree un `Order` en statut `PENDING_PAYMENT`.
- Les changements Stripe -> Webhook mettent a jour le statut dans Supabase et le cPanel.
