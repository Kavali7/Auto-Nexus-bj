import Link from "next/link";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 py-12 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Page introuvable</h1>
      <p className="max-w-md text-base text-muted-foreground">La page que vous cherchez n existe plus ou a peut-etre change de place. Utilisez le bouton ci-dessous pour revenir a l accueil.</p>
      <Link href="/" className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow hover:bg-brand/90">Retour a l accueil</Link>
    </div>
  );
}