import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialite - Auto Nexus BJ",
  description:
    "Politique de confidentialite du MVP Auto Nexus BJ: donnees collectees, finalites, droits des utilisateurs et contact DPO.",
};

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <main className="bg-background">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 lg:py-20">
        <article className="space-y-10">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Protection des donnees
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Politique de confidentialite
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Cette politique explique comment Auto Nexus BJ collecte, utilise, partage et
              protege vos donnees personnelles dans le cadre du MVP.
            </p>
          </header>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              1. Champ d application
            </h2>
            <p>
              La presente politique couvre l ensemble des interactions realisees via les
              domaines autonexus.bj et leurs sous-domaines operes par Growpeak Agence.
              Elle s applique aux visiteurs, prospects, clients B2B et partenaires.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              2. Donnees collectees
            </h2>
            <p>
              Nous collectons uniquement les informations necessaires pour presenter le
              catalogue et activer le suivi commercial pilote.
            </p>
            <ul className="space-y-1">
              <li>Identite et contact: nom, prenom, email, telephone, fonction.</li>
              <li>
                Preferences d achat: type de vehicule recherche, budget, localisation.
              </li>
              <li>
                Donnees techniques: logs de connexion anonymises, navigateur, temps de
                consultation (via Vercel Analytics).
              </li>
            </ul>
            <p>
              Aucune donnee sensible (sante, finance personnelle) n est requise dans le
              cadre du MVP.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              3. Finalites du traitement
            </h2>
            <ul className="space-y-1">
              <li>Repondre aux demandes d information et de demo.</li>
              <li>
                Qualifier les leads pour les concessionnaires partenaires et mesurer l
                interet pour la marketplace.
              </li>
              <li>Ameliorer l ergonomie du site via des indicateurs anonymises.</li>
            </ul>
            <p>
              Les bases legales mobilisees sont le consentement (formulaires) et l interet
              legitime (amelioration continue du produit).
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              4. Conservation des donnees
            </h2>
            <p>
              Les donnees sont stockees dans Supabase (region eu-central) avec chiffrement
              au repos. La duree de conservation est fixee a 24 mois a compter du dernier
              contact, sauf obligation legale contraire.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              5. Partage et sous-traitance
            </h2>
            <p>
              Les donnees peuvent etre partagees avec les concessionnaires pilotes
              partenaires afin de preparer une proposition commerciale. Aucun transfert
              hors Union Europeenne n est effectue hormis l hebergement Vercel
              (Etats-Unis) conforme au cadre juridique UE US Data Privacy Framework.
            </p>
            <p>
              Les sous-traitants impliques sont Vercel Inc., Supabase Inc. et Logflare LLC
              (analytics). Des clauses contractuelles type sont en place pour chaque
              acteur.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              6. Droits des utilisateurs
            </h2>
            <p>
              Conformement aux reglementations en vigueur (RGPD, lois locales), vous
              disposez des droits d acces, de rectification, d effacement, de portabilite
              et d opposition. Pour exercer ces droits, contactez nous a l adresse{" "}
              <a
                href="mailto:dpo@autonexus.bj"
                className="text-foreground underline underline-offset-4 transition hover:text-brand"
              >
                dpo@autonexus.bj
              </a>
              .
            </p>
            <p>
              Une reponse vous sera apportee sous 30 jours calendaires. En cas de litige,
              vous pouvez saisir l Autorite de Protection des Donnees Personnelles (APDP
              Benin).
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              7. Mesures de securite
            </h2>
            <p>
              Des controles d acces role-based, l authentification a facteurs multiples et
              le chiffrement TLS sont deployes pour limiter les risques de divulgation non
              autorisee.
            </p>
            <p>
              En cas d incident, un plan de reponse est defini: evaluation, notification
              des personnes concernees et actions correctives.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              8. Mise a jour de la politique
            </h2>
            <p>
              Cette politique peut etre ajustee en fonction des evolutions du produit ou
              du cadre juridique. La date de derniere mise a jour est indiquee ci-dessous.
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Derniere mise a jour: 13 octobre 2025.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
