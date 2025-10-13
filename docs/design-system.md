# Auto Nexus BJ – Guide Design Système (MVP)

Ce mini-guide recense les patterns clés utilisés sur le MVP statique. L’objectif est de partager un langage commun avant la connexion Supabase/Prisma.

## Palette & typographie

| Token                | Hex                    | Usage principal                             |
| -------------------- | ---------------------- | ------------------------------------------- |
| `--brand`            | `#1878C8`              | Boutons primaires, liens actifs, headers    |
| `--brand-foreground` | `#FFFFFF`              | Texte sur boutons brand                     |
| `--foreground`       | `#0E2C4A`              | Texte principal                             |
| `--muted`            | `#E4EBF2`              | Arrière-plans alternatifs, badges secondary |
| `--muted-foreground` | `#4B5C6F`              | Corps de texte secondaire, descriptions     |
| `--accent`           | `#16A34A`              | Etats succès / label financement            |
| `--destructive`      | `#DC2626`              | Etats alerte / destructive                  |
| `--focus-ring`       | `rgba(24,120,200,0.6)` | Outline `:focus-visible`, accessibilité     |

- **Sans-serif** : Geist (chargée dans `layout.tsx`, expose `--font-geist-sans`)
- **Mono** : Geist Mono (`--font-geist-mono`), pour métriques / code snippets.
- Radius : large 12px, medium 10px, small 8px (réutilisés via `@theme inline`).

## Boutons

Variantes définies dans `src/components/ui/button.tsx`. Principes :

| Variante    | Usage                      | Classes clés                                         |
| ----------- | -------------------------- | ---------------------------------------------------- |
| `default`   | CTA principal              | `bg-brand text-brand-foreground hover:bg-brand/90`   |
| `outline`   | CTA secondaires            | `border-border hover:bg-muted`                       |
| `ghost`     | Icon only / nav            | Transparence, utilisé pour menu mobile               |
| `secondary` | Etats highlight / overlays | `bg-brand/10 text-brand`, souvent combiné à un badge |

- Focus : rely on `:focus-visible` global (outline bleu).
- Désactivation : utilise `disabled:opacity-70` + `disabled:pointer-events-none`.

## Badges

Définis dans `src/components/ui/badge.tsx` :

- `default` – badges brand (état neuf, condition).
- `secondary` – tags muted (`bg-muted`, `text-muted-foreground`).
- `outline` – transitions sur hover, utilisé pour chips de filtre.
- `destructive` – alertes (peu utilisé dans le MVP).

## Cartes

`src/components/ui/card.tsx` expose Header/Content/Footer. Patrons :

- **Card « hero »** : gradient + image (vehicle card, hero dealer) – conserver `rounded-3xl` et overlay noir 55 %.
- **Sections dashboard** : `rounded-2xl border border-border/60` + `shadow-sm`.
- **Key figures** : `border-dashed` pour différencier les stats (voir `page.tsx`).

### Micro-interactions

| Composant         | Interaction                               |
| ----------------- | ----------------------------------------- |
| `VehicleCard`     | hover scale + overlay CTA ouvrir          |
| `AnimatedSection` | fade/translate sur scroll, `duration-500` |
| `CompareBar`      | slide-up (position fixed bottom)          |
| Hamburger mobile  | transitions `translate-x` + overlay blur  |

## Hooks & stubs démo

- `use-demo-notice` : affiche un `window.alert` pour `analytics`, `favorites`, `uploads` lorsque `STATIC_DEMO_MODE=true`.
- `use-signed-upload` : renvoie un message « fonctionnalité à venir » si Supabase inactif.

## Accessibilité

- Outline global (see `globals.css`).
- `aria-label` sur hamburger, menus, groupes nav.
- `AnimatedSection` conservé mais attention aux `prefers-reduced-motion` (prochaine itération).

---

Ce document évoluera avec la connexion aux données live (ajout de tokens dynamiques, composants formulaires avancés, etc.).
