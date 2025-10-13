import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions legales - Auto Nexus BJ",
  description:
    "Informations legales du MVP Auto Nexus BJ: editeur, hebergeur, responsable de publication et propriete intellectuelle.",
};

export default function MentionsLegalesPage(): JSX.Element {
  return (
    <main className="bg-background">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 lg:py-20">
        <article className="space-y-10">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Informations legales
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Mentions legales
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Ce document resume les informations requises par la legislation beninoise
              concernant l editeur, l hebergeur et les credits du site Auto Nexus BJ.
            </p>
          </header>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">1. Editeur du site</h2>
            <p>
              Auto Nexus BJ est un projet pilote porte par Growpeak Agence (entreprise
              individuelle), specialisee dans les experiences digitales pour les acteurs
              de la mobilite en Afrique de l Ouest.
            </p>
            <ul className="space-y-1">
              <li>
                Siege: Cotonou, Benin (enregistrement RCCM en cours dans le cadre du
                passage en societe).
              </li>
              <li>Representant legal: Kevin Adonon, fondateur.</li>
              <li>
                Contact:{" "}
                <a
                  href="mailto:hello@autonexus.bj"
                  className="text-foreground underline underline-offset-4 transition hover:text-brand"
                >
                  hello@autonexus.bj
                </a>{" "}
                / +229 95 60 60 58.
              </li>
            </ul>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">2. Hebergeur</h2>
            <p>
              Le MVP Auto Nexus BJ est heberge par Vercel Inc., 340 S Lemon Ave #4133,
              Walnut, CA 91789, Etats-Unis. Le tracking de performance est assure par
              Vercel Analytics et Logflare (modele anonymise).
            </p>
            <p>
              Les donnees media sont stockees sur Supabase (region eu-central), avec
              chiffrement au repos et controle d acces role-based.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              3. Directeur de publication
            </h2>
            <p>
              Le directeur de publication est Kevin Adonon en qualite de responsable
              produit. Pour toute demande relative au contenu, merci d utiliser le canal{" "}
              <a
                href="mailto:hello@autonexus.bj"
                className="text-foreground underline underline-offset-4 transition hover:text-brand"
              >
                hello@autonexus.bj
              </a>{" "}
              ou le formulaire demo dans la section Investisseurs.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              4. Propriete intellectuelle
            </h2>
            <p>
              L ensemble des contenus (textes, visuels, maquettes, logos) est protege par
              le droit d auteur. Toute reproduction ou diffusion sans autorisation
              prealable est interdite. Les marques tierces affichees appartiennent a leurs
              proprietaires respectifs.
            </p>
            <p>
              Les composants UI derivent de bibliotheques open source (Radix UI,
              TailwindCSS, shadcn/ui) sous licences MIT. Le code est heberge sur GitHub
              (depot prive) et deploye sur Vercel.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">
              5. Donnees personnelles
            </h2>
            <p>
              Les formulaires du MVP enregistrent les informations de contact dans
              Supabase afin de preparer les flux CRM. Les details sur la collecte et vos
              droits sont precises dans la politique de confidentialite.
            </p>
          </section>

          <section className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <h2 className="text-lg font-semibold text-foreground">6. Credits</h2>
            <p>
              Conception produit et UX: Growpeak Agence. Shooting et mockups : reseau de
              photographes partenaires a Cotonou. Illustrations supplementaires:
              Midjourney et Banque Getty beta (usage interne).
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
