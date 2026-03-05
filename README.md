# cv-astro

CV of **Thibaud Ritzenthaler** — Demographer & Developer, Paris.

Built with [Astro 5](https://astro.build), vanilla CSS, no UI framework.

→ [ritzenthaler.eu](https://ritzenthaler.eu)

---

## Stack

| | |
|---|---|
| **Astro 5** | Static site generation (SSG), zero JS by default |
| **Vanilla CSS** | Custom design system, no Tailwind or Bootstrap |
| **TypeScript** | i18n script and shared types |
| **Homemade i18n** | FR / EN / DE, auto-detection + client-side switcher |

---

## Structure

```
cv-astro/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← automatic GitHub Pages deployment
├── data/
│   └── i18n/
│       ├── fr.json             ← FR source of truth
│       ├── en.json             ← EN translation
│       └── de.json             ← DE translation
├── public/
│   ├── data/                   ← JSON files copied automatically at build
│   ├── images/
│   │   └── avatar.png          ← profile picture
│   ├── styles/
│   │   └── global.css          ← all CSS
│   └── cv_Thibaud_Ritzenthaler.pdf
└── src/
    ├── components/
    │   ├── Activities.astro
    │   ├── Education.astro
    │   ├── Experience.astro
    │   ├── Expertise.astro     ← marquee ticker
    │   ├── Footer.astro
    │   ├── Hero.astro
    │   ├── Hobbies.astro       ← random fairy-light animation
    │   ├── Languages.astro     ← flag cards
    │   ├── LangSwitcher.astro
    │   ├── Publications.astro  ← progressive display (show more)
    │   └── SectionLabel.astro
    ├── layouts/
    │   └── Base.astro          ← HTML, SEO metadata, og:*, schema.org
    ├── pages/
    │   └── index.astro         ← all components assembled
    ├── scripts/
    │   └── i18n.ts             ← language detection, fetch, renderCV()
    └── types.ts                ← shared TypeScript interfaces
```

---

## Getting started

```bash
npm install
npm run dev      # → http://localhost:4321
npm run build    # → dist/ folder
npm run preview  # preview the build
```

---

## Editing content

All content lives in `data/i18n/*.json` — single source of truth.  
An Astro hook automatically copies these files to `public/data/` on dev start and at build time.

> ⚠️ Never edit `public/data/` directly — these files are overwritten on every build.

### Example — adding a job entry

```json
// data/i18n/fr.json → "jobs"
{
  "company": "Company name",
  "companyLinks": [{ "name": "Name", "url": "https://..." }],
  "location": "City, FR",
  "begin": "Jan 2025",
  "end": "Present",
  "contract": "Permanent",
  "occupation": "Job title",
  "description": "Description..."
}
```

Apply the same change in `en.json` and `de.json` for translations.

---

## i18n

The HTML is rendered in **FR at build time** (SSG). On the client, `i18n.ts`:

1. Detects the language via `localStorage` then `navigator.language`
2. Fetches `/data/{lang}.json`
3. Re-hydrates the entire DOM without a page reload
4. Stores the choice in `localStorage`

> Google only indexes the FR version. For full multilingual indexing, static routes `/en` and `/de` would be needed — see [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/).

---

## Deployment

### GitHub Pages (automatic)

Every push to `main` triggers the `.github/workflows/deploy.yml` workflow, which builds and deploys automatically.

Enable in **Settings → Pages → Source: GitHub Actions**.

### Other static hosts

Compatible with Netlify, Vercel, Cloudflare Pages, or any static server.

```bash
npm run build
# → upload the dist/ folder
```

### cPanel

```yaml
# .cpanel.yml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/user/public_html/
    - /bin/cp -r dist/* $DEPLOYPATH
```