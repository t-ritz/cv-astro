# cv-astro

CV de Thibaud Ritzenthaler — construit avec [Astro](https://astro.build).

## Stack

- **Astro 4** — génération statique
- **CSS vanilla** — zéro framework UI
- **i18n** — FR / EN / DE via JSON, détection auto + switcher client-side
- **Zéro JS framework** — animations CSS + IntersectionObserver natif

## Structure

```
cv-astro/
├── data/
│   └── i18n/
│       ├── fr.json        ← données FR (source de vérité)
│       ├── en.json        ← données EN
│       └── de.json        ← données DE
├── public/
│   ├── images/
│   │   └── avatar.png     ← photo (à placer ici)
│   ├── styles/
│   │   └── global.css     ← tout le CSS
│   ├── scripts/
│   │   └── main.js        ← switcher i18n + scroll animations
│   └── cv_Thibaud_Ritzenthaler.pdf
├── src/
│   ├── layouts/
│   │   └── Base.astro
│   └── pages/
│       └── index.astro    ← page unique (SSG)
├── astro.config.mjs
└── package.json
```

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

## Ajouter / modifier du contenu

Tout le contenu est dans `data/i18n/*.json`.  
Modifier un fichier JSON suffit — aucune recompilation nécessaire en dev.

### Ajouter une expérience (exemple FR)

```json
// data/i18n/fr.json → "jobs"
{
  "company": "Nom de l'entreprise",
  "companyLinks": [{ "name": "Nom", "url": "https://..." }],
  "location": "Ville, FR",
  "begin": "Jan 2025",
  "end": "Actuellement",
  "contract": "CDI",
  "occupation": "Titre du poste",
  "description": "Description du poste..."
}
```

## i18n — comment ça marche

1. Au chargement, `main.js` détecte la langue via `localStorage` puis `navigator.language`
2. Il charge le JSON correspondant depuis `/data/{lang}.json`
3. Il réhydrate le DOM sans rechargement de page
4. La langue choisie est mémorisée dans `localStorage`

> **Note** : le HTML initial est rendu en FR côté serveur (SSG).  
> Si tu veux que Google indexe les 3 langues, envisage des routes `/en` et `/de` générées statiquement (voir Astro i18n routing).

## Déploiement

Compatible avec Netlify, Vercel, GitHub Pages, ou n'importe quel hébergement statique.

```bash
npm run build
# → dossier dist/ prêt à déployer
```

Pour cPanel (comme l'ancien `.cpanel.yml`) :

```yaml
# .cpanel.yml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/user/public_html/
    - /bin/cp -r dist/* $DEPLOYPATH
```
