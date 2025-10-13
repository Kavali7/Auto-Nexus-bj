import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions generales d utilisation - Auto Nexus BJ",
  description:
    "Conditions generales d utilisation du MVP Auto Nexus BJ: objet, services proposes, obligations des parties et cadre juridique.",
};

export default function TermsPage(): JSX.Element {
  return (
    <main className="bg-background">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 lg:py-20">
        <article className="space-y-10">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Cadre contractuel
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Conditions generales d utilisation
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Les presentes conditions definissent les droits et obligations applicables
              aux utilisateurs de la plateforme Auto Nexus BJ dans le cadre du MVP
              statique.
            </p>
          </header>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">1. Definitions</h2>
            <p>
              <span className="font-semibold text-foreground">Plateforme</span> designe le
              site autonexus.bj, ses sous-domaines et services connexes.{" "}
              <span className="font-semibold text-foreground">MVP</span> designe la
              version beta presentee pour valider les parcours digitaux.{" "}
              <span className="font-semibold text-foreground">User</span> ou{" "}
              <span className="font-semibold text-foreground">vous</span> designe tout
              visiteur, prospect ou partenaire utilisant le site.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">2. Objet</h2>
            <p>
              Les presentes conditions encadrent l acces au contenu, aux outils de
              comparaison et aux formulaires de contact. Elles sont acceptees des l
              utilisation du site.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              3. Acces et disponibilite
            </h2>
            <p>
              L acces est gratuit pour les utilisateurs finaux. Auto Nexus BJ se reserve
              le droit d interrompre temporairement l acces pour maintenance ou mise a
              jour. En cas de suspension prolongee, une communication sera envoyee via les
              canaux officiels.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              4. Services proposes
            </h2>
            <ul className="space-y-1">
              <li>Consultation du catalogue de vehicules pilote.</li>
              <li>Comparateur multi-vehicules et fiches detaillees.</li>
              <li>
                Mise en relation avec les concessionnaires partenaires via formulaire ou
                WhatsApp.
              </li>
            </ul>
            <p>
              Les conditions commerciales finales seront precisees par chaque
              concessionnaire et peuvent differer des informations affiches.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              5. Obligations des utilisateurs
            </h2>
            <ul className="space-y-1">
              <li>Fournir des informations exactes lors des demandes de contact.</li>
              <li>
                Ne pas porter atteinte au bon fonctionnement du site (intrusion,
                extraction massive de donnees).
              </li>
              <li>Respecter les droits de propriete intellectuelle lies aux contenus.</li>
            </ul>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              6. Obligations d Auto Nexus BJ
            </h2>
            <p>
              Auto Nexus BJ s engage a maintenir une information a jour, a proteger les
              donnees collectees et a informer les utilisateurs en cas de modification
              majeure des services ou des conditions d usage.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">7. Responsabilite</h2>
            <p>
              Auto Nexus BJ ne saurait etre tenue responsable des dommages indirects
              (perte de chance, perte de chiffre d affaires) ou des informations fournies
              par les concessionnaires. Le MVP est fourni a titre demonstratif sans
              garantie de disponibilite permanente.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">8. Tarification</h2>
            <p>
              L acces au MVP est gratuit. Des offres payantes (abonnements, services
              logistiques) pourront etre introduites apres validation commerciale. Elles
              feront l objet de conditions specifiques.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              9. Propriete intellectuelle
            </h2>
            <p>
              Les contenus publies demeurent la propriete d Auto Nexus BJ ou des
              partenaires qui en transferent les droits d usage. Toute reproduction totale
              ou partielle sans autorisation est interdite.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              10. Donnees personnelles
            </h2>
            <p>
              Le traitement des donnees personnelles est detaille dans la politique de
              confidentialite. L utilisateur peut exercer ses droits en ecrivant a{" "}
              <a
                href="mailto:dpo@autonexus.bj"
                className="text-foreground underline underline-offset-4 transition hover:text-brand"
              >
                dpo@autonexus.bj
              </a>
              .
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              11. Modification des CGU
            </h2>
            <p>
              Auto Nexus BJ peut modifier les presentes conditions pour reflechir les
              evolutions legales ou fonctionnelles. Les utilisateurs seront informes via
              une mention sur le site. La derniere version prevaut sur les precedentes.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              12. Droit applicable et juridiction
            </h2>
            <p>
              Les presentes conditions sont soumises au droit beninois. Tout litige sera
              porte devant les juridictions competentes de Cotonou, sous reserve des
              dispositions d ordre public.
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
