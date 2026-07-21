# marketing-astro — seed du site marketing standard

Seed minimal (pas un framework) pour la couche `apps/marketing` de la forme
standard produit (cf. cockpit `CLAUDE.md` § Forme standard). Extrait de la
migration siteOS (2026-07-20, premier cobaye). **Ne versionne que les
invariants cross-produits** ; les sections, la copy et les composants
produit sont écrits par l'agent à chaque instanciation (coût IA ~0).

Stack : Astro 5 statique · Tailwind 4 (`@tailwindcss/vite`) · **0 JS shippé**
(pas de React ; toute interactivité = liens/CSS, les îlots seulement si un
vrai besoin apparaît) · astro-icon + `@iconify-json/lucide` · fonts via
`@fontsource-variable/*` · Cloudflare Workers static assets.

## Modules optionnels (à activer par produit)

- **Îlots React** (`@astrojs/react`) — quand le produit a de vrais outils
  interactifs. Pattern : coquille `.astro` 0 JS + composant client monté en
  `<X client:visible />`. À défricher avec templatefox (16 outils déjà
  island-shaped).
- **Docs = Starlight** (`@astrojs/starlight`, décidé 2026-07-21) — surface doc
  dans le même `apps/marketing`, `.mdx` en `src/content/docs/`. Standard
  portfolio (remplace Nextra). À défricher avec templatefox (1er cas), puis
  figer ici comme module réutilisable.

## Instancier

1. Copier ce dossier vers `<produit>/apps/marketing`, renommer
   `.gitignore.template` → `.gitignore`, déplacer
   `.github-workflow/deploy-marketing.yml` → `.github/workflows/` du repo.
2. Remplacer les placeholders partout :
   - `__DOMAIN__` → domaine apex (ex. `templatefox.com`)
   - `__WORKER_NAME__` → nom du worker Cloudflare (ex. `templatefox-marketing`)
3. `src/styles/global.css` : remplacer les tokens `@theme` (couleurs, font)
   par la charte du produit. Les utilities (`gradient-accent`, `ring-soft`,
   `grid-bg`…) sont des patterns réutilisables, adapter ou supprimer.
4. Écrire les pages dans `src/pages/*.astro` (le `Layout.astro` gère
   canonical/OG/twitter/robots par page — prop `path` sans trailing slash)
   et les composants produit dans `src/components/`.
5. `astro.config.ts` : ajuster `ROUTE_META` (changefreq/priority par route).
6. `npm install` puis `npm run generate:sitemap-dates` après le premier
   commit (lastmod git → `generated/sitemap-dates.json`, committé).

## Invariants encodés (ne pas casser)

- **`build.format: 'file'` + `trailingSlash: 'never'`** → URLs sans slash
  final (`/about`, pas `/about/`), pas de redirect 308 parasite sur
  Cloudflare assets.
- `worker.js` : canonical host (www + http → https apex) ; garder le
  redirect `/sitemap.xml` → `/sitemap-index.xml` seulement si le produit a
  un historique next-sitemap.
- Sitemap : `@astrojs/sitemap` + `serialize()` (lastmod git, loc racine
  sans slash) ; `robots.txt` statique pointe `sitemap-index.xml`.
- SEO gate : `npm run seo:check` (`@site-os/check`, dogfooding siteOS) en
  CI **et** dans le deploy workflow — build cassé si erreurs SEO.
- CI : Node ≥ 22 (wrangler 4.38+ l'exige).

## Secrets GitHub à poser (une fois par repo)

| Secret | Source |
|---|---|
| `CLOUDFLARE_API_TOKEN` | CF dashboard → API Tokens → template "Edit Cloudflare Workers" |
| `CLOUDFLARE_ACCOUNT_ID` | CF dashboard → Workers & Pages → sidebar |

Aucun secret de build : les URLs app sont des defaults en dur dans les
composants (`import.meta.env.PUBLIC_APP_URL ?? "https://app.__DOMAIN__"`).

## Checklist de parité (si migration d'un site existant)

Avant : capturer la baseline live (curl status + redirects de chaque route,
sitemap, robots, canonical/OG). Après deploy : rejouer la même boucle —
attendu identique. Référence complète : plan de migration siteOS
(`siteOS`, commit `92e5e20`).

## Référence vivante

L'implémentation de référence est `siteOS/apps/marketing` (premier
instancié). En cas de doute sur un choix, lire le code là-bas. Après la
2e instanciation (templatefox), formaliser une skill si le pattern se
répète à l'identique.
