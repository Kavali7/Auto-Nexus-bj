# Organiser la QA finale et la livraison

## Objectif
- Valider fonctionnalement le produit sur l ensemble des parcours (client public et cPanel) et produire les livrables de lancement.

## Contexte
- `docs/visual-checklist.md` et `docs/demo.md` contiennent deja des lignes directrices.
- Les photos actuelles doivent rester en place jusqu a la validation finale client.

## Etapes detaillees
1. Mettre a jour `docs/visual-checklist.md` avec les nouveaux parcours (favoris persistants, reservation, uploads, leads cPanel).
2. Elaborer un plan de tests manuels (mobile/desktop) couvrant:
   - Navigation landing -> fiche -> comparateur -> lead.
   - Reservation (avec sandbox Stripe).
   - Gestion inventaire + media + publication.
   - Suivi leads/services/orders dans le cPanel.
3. Executer `npm run lighthouse` et archiver les rapports dans `reports/lighthouse/` pour mobile et desktop.
4. Fournir une fiche `docs/runbook-lancement.md` listant:
   - Pre-requis (migrations, index, secrets).
   - Plan de rollback.
   - Checklist post-go-live (monitoring, alertes).
5. Organiser une repetition generale de la demo (suivre `docs/demo.md`) en confirmant que les photos placeholders correspondent aux attentes marketing.
6. Collecter les comptes rendus de tests et corriger les anomalies bloqueuses.
7. Valider avec le client la date de bascule et planifier le support post-lancement (1ere semaine).

## Livrables
- Checklist QA mise a jour.
- Rapport Lighthouse recent.
- Runbook de lancement.
- Compte rendu de repetition demo.

## Validation
- Toutes les cases du plan de tests sont cochees et signees.
- Le runbook est partage avec l equipe et accessible dans le repo (docs/).
