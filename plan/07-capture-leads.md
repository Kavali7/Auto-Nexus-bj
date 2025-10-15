# Enregistrer les leads clients et notifications associees

## Objectif
- Stocker chaque demande client (annonce, services, contact investisseur) dans la table `Lead` et declencher les notifications internes.

## Contexte
- Les formulaires front (`src/components/lead-form.tsx`) ne font qu afficher un message local.
- Il n existe pas de route `/api/leads`.
- Enum `LeadStatus` dans `prisma/schema.prisma` doit etre utilisee.

## Etapes detaillees
1. Creer `src/app/api/leads/route.ts` avec un handler `POST`.
2. Valider le payload via `zod` (nom, telephone, message, `vehicleId?`, `dealerId`, `source`).
3. Persister dans `Lead` avec `status: LeadStatus.NEW` et `vehicleId` optionnel.
4. Ajouter un champ `context` dans la table si necessaire via une migration pour differencier `services`, `achat`, `investisseur`.
5. Integrer l envoi de notifications (voir tache 20) via un hook ou une queue (ex: drizzle job supabase function).
6. Mettre a jour `LeadForm` pour appeler l API, afficher les erreurs et indiquer le numero WhatsApp du dealer si dispo.
7. Ajouter des tests API (validation 400, success 201) et une entree de documentation (`docs/demo.md` -> nouvelle etape).

## Livrables
- Route `/api/leads` operationnelle.
- Formulaires front branchés sur l API.
- Tests unitaires / e2e.

## Validation
- Soumettre un formulaire depuis `/voitures/[slug]` cree un enregistrement dans `Lead` et renvoie `201`.
- Le cPanel (tache 15) affiche le lead en statut `NEW`.
