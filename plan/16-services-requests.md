# Suivre les demandes de services et prestations

## Objectif
- Capturer et suivre les demandes de services (entretien, pieces, financement, livraison) depuis le site public et les rendre consultables dans le cPanel.

## Contexte
- La page `src/app/services/page.tsx` presente les piliers mais sans workflow.
- Aucun modele ne couvre les demandes de service (uniquement `Lead`).
- Les photos actuelles de services restent en place.

## Etapes detaillees
1. Ajouter une table `ServiceRequest` (id, dealerId?, serviceType, clientName, phone, message, status, createdAt).
2. Exposer une route `/api/services/request` validee via `zod`.
3. Ajouter des formulaires sur `/services` (CTA "Demander ce service") reutilisant `LeadForm` mais pointant vers la nouvelle route.
4. Dans le cPanel, creer `(dealer)/services` pour suivre ces demandes avec un tableau (statut `NEW`, `IN_PROGRESS`, `COMPLETED`, `DECLINED`).
5. Prevoir une integration avec `Lead` si `serviceType` correspond a un dealer specifique (ex: financement).
6. Documenter dans `docs/demo.md` comment presenter le flux pendant la demo.
7. Ajouter des tests (API et UI).

## Livrables
- Table `ServiceRequest` et migrations.
- Formulaires publics branchés sur l API.
- Page cPanel pour le suivi.

## Validation
- Soumettre une demande depuis `/services` cree une ligne `ServiceRequest`.
- Le concessionnaire cible voit la demande et peut mettre a jour le statut.
