# _ops/starterkit — les seeds du portfolio

Ce dossier contient **deux seeds de nature très différente**. Ne pas les
confondre.

## `marketing-astro/` — le seed vivant ✅

Le seed de la couche `apps/marketing` de la forme standard produit. Il a servi
aux 5 migrations Astro du portfolio et au scaffold de deviensdev. **C'est lui
qu'on instancie pour tout nouveau site.**

👉 **Tout est dans [`marketing-astro/README.md`](marketing-astro/README.md)** :
stack, invariants versionnés, modules optionnels (îlots React, docs Starlight),
procédure d'instanciation. Ne rien dupliquer ici.

## Le reste — le vieux seed SaaS ⚠️ périmé

`frontend/` + `backend/` + `supabase/` + `integrations/` + `generated/` : le
starter kit Next.js/FastAPI d'origine (février 2026). Il est **hors standard sur
deux points** et ne doit pas servir de base à un produit sans être remis à jour :

- **Structure** : `frontend/` et `backend/` à la racine, alors que la forme
  standard est `apps/app` + `apps/marketing` (+ `apps/worker` si Worker
  Cloudflare).
- **Stack data** : tout y est Supabase (base, auth, storage), alors que les
  produits récents sont sur **Neon + Better Auth** (photocv, parsedocu, siteOS).
  Seul templatefox est encore sur Supabase.

Ce qui reste bon à reprendre tel quel : la génération OpenAPI/Postman
(`scripts/generate.py`, appelé depuis `backend/`), les templates
`integrations/` (Zapier, n8n, Make), les hooks husky/commitlint.

Contenu détaillé de ce vieux seed (structure, schéma teams, commandes) :
`CLAUDE.md.avant-degraissage.md`.

Conventions portfolio : `~/Code/cockpit/_ops/conventions.md`.
