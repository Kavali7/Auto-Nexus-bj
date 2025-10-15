# Mettre en place les notifications WhatsApp et e-mail

## Objectif
- Envoyer automatiquement des notifications aux concessionnaires et a l equipe Auto Nexus lors des leads, reservations ou demandes de services.

## Contexte
- Aucun service d envoi n est configure.
- Les leads actuels doivent quand meme generer un message interne (meme si la base et la pipeline photo restent en demo).

## Etapes detaillees
1. Choisir les providers: WhatsApp Business API (Twilio ou Meta Cloud API) et Resend (emails) ou SendGrid.
2. Creer un module `src/server/notifications.ts` gerant les canaux (email, whatsapp, slack optionnel) et la mise en forme des messages.
3. Integrer ce module dans les routes `leads`, `services`, `orders` via une queue (Edge Function Supabase ou job Node) pour eviter de bloquer la reponse.
4. Ajouter des templates d email (MJML ou React Email) dans `emails/` avec recap du lead et liens profonds vers le cPanel.
5. Prevoir une configuration pour activer/desactiver chaque canal (`NOTIFY_WHATSAPP`, `NOTIFY_EMAIL`).
6. Mettre a jour la documentation (`README` + `docs/demo.md`) pour expliquer les limitations en mode demo (ex: simulation console).
7. Ajouter des tests unitaires sur la generation du message (injection de data).

## Livrables
- Module de notifications reutilisable.
- Templates email/WhatsApp.
- Documentation et tests.

## Validation
- Creation d un lead declenche un email vers l equipe (mode real) ou un log console (mode demo).
- Les dealers recoivent un message WhatsApp ou un fallback email selon configuration.
