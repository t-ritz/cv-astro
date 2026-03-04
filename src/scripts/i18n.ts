import type { SiteConfig } from '../types'

const LANGS = ['fr', 'en', 'de'] as const
type Lang = typeof LANGS[number]

const PUB_VISIBLE = 3

// ── Détection de la langue ──────────────────────────────
function getStoredLang(): Lang | null {
  try {
    const stored = localStorage.getItem('cv-lang')
    if (stored && LANGS.includes(stored as Lang)) return stored as Lang
  } catch {}
  return null
}

function getBrowserLang(): Lang {
  const raw = navigator.language.slice(0, 2).toLowerCase()
  return LANGS.includes(raw as Lang) ? (raw as Lang) : 'fr'
}

export function getLang(): Lang {
  return getStoredLang() ?? getBrowserLang()
}

// ── Chargement des données ──────────────────────────────
const cache = new Map<Lang, SiteConfig>()

export async function fetchConfig(lang: Lang): Promise<SiteConfig> {
  if (cache.has(lang)) return cache.get(lang)!
  try {
    const res = await fetch(`/data/${lang}.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: SiteConfig = await res.json()
    cache.set(lang, data)
    return data
  } catch {
    if (lang !== 'fr') return fetchConfig('fr')
    throw new Error('Failed to load fr.json fallback')
  }
}

// ── Helpers DOM ─────────────────────────────────────────
function setText(selector: string, text: string) {
  const el = document.querySelector(selector)
  if (el) el.textContent = text
}

// ── Bouton "voir plus" publications ─────────────────────
function bindPubToggle(labelMore: string, labelLess: string) {
  // Le bouton est toujours recréé via innerHTML avant cet appel
  // — pas besoin de cloneNode, aucun listener fantôme possible
  const btn = document.querySelector<HTMLButtonElement>('[data-pub-toggle]')
  if (!btn) return

  // Forcer les labels (innerHTML ne les connaît pas encore au moment du render)
  const label = btn.querySelector<HTMLElement>('.pub-more-label')
  const arrow = btn.querySelector<HTMLElement>('.pub-more-arrow')
  if (label) label.textContent = labelMore
  if (arrow) arrow.textContent = '▾'

  let open = false
  btn.addEventListener('click', () => {
    open = !open
    document.querySelectorAll<HTMLElement>('.pub-entry--hidden').forEach(el => {
      el.classList.toggle('pub-entry--visible', open)
    })
    if (label) label.textContent = open ? labelLess : labelMore
    if (arrow) arrow.textContent = open ? '▵' : '▾'
  })
}

// ── Rendu du CV ─────────────────────────────────────────
function renderCV(d: SiteConfig) {
  document.documentElement.lang = d.lang
  document.title = d.siteTitle

  // Hero
  setText('[data-i18n="eyebrow"]',           d.eyebrow)
  setText('[data-i18n="authorDescription"]',  d.authorDescription)
  setText('[data-i18n="labels.downloadCV"]',  d.labels.downloadCV)

  // Section labels
  Object.entries(d.sections).forEach(([key, sec]) => {
    const el = document.querySelector(`[data-section="${key}"]`)
    if (!el) return
    const span = el.querySelector('span')
    if (span) span.textContent = sec.eyebrow
    const textNodes = [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE)
    const last = textNodes.at(-1)
    if (last) last.textContent = sec.title
  })

  // Expertise marquee
  const track = document.querySelector<HTMLElement>('[data-expertise]')
  if (track) {
    track.innerHTML = [...d.expertise, ...d.expertise]
      .map(tech => `
        <div class="expertise-item">
          <span class="tech-name">${tech}</span>
          <span class="dot"></span>
        </div>`)
      .join('')
  }

  // Jobs
  const jobsEl = document.querySelector<HTMLElement>('[data-jobs]')
  if (jobsEl) {
    jobsEl.innerHTML = d.jobs.map((job, i) => `
      <div class="job" style="transition-delay:${i * 0.08}s">
        <div>
          <div class="job-period">${job.begin} · ${job.end}</div>
          <span class="job-contract">${job.contract}</span>
        </div>
        <div>
          <div class="job-title">
            <span class="job-title-inner">${job.occupation}</span>
          </div>
          <div class="job-company-line">
            ${job.companyLinks.map((l, j) => `${j > 0 ? ' · ' : ''}<a href="${l.url}" target="_blank" rel="noopener">${l.name}</a>`).join('')}
            · ${job.location}
          </div>
          <div class="job-desc">${job.description}</div>
          <div class="job-expand-hint">${d.labels.hoverToRead}</div>
        </div>
      </div>`).join('')
    jobsEl.querySelectorAll<HTMLElement>('.job').forEach(el => {
      el.addEventListener('click', () => el.classList.toggle('open'))
      scrollObserver.observe(el)
    })
  }

  // Education
  const eduEl = document.querySelector<HTMLElement>('[data-education]')
  if (eduEl) {
    eduEl.innerHTML = d.education.map((edu, i) => `
      <div class="edu-entry" style="transition-delay:${i * 0.07}s">
        <div class="edu-years">${edu.startYear} – ${edu.endYear}</div>
        <div>
          <div class="edu-degree">${edu.degree}</div>
          <div class="edu-field">${edu.field}</div>
          <a class="edu-school" href="${edu.url}" target="_blank" rel="noopener">${edu.school} ↗</a>
          ${edu.mention ? `<div class="edu-mention">${edu.mention}</div>` : ''}
        </div>
      </div>`).join('')
    eduEl.querySelectorAll('.edu-entry').forEach(el => scrollObserver.observe(el))
  }

  // Publications — liste + bouton
  const pubEl = document.querySelector<HTMLElement>('[data-publications]')
  if (pubEl) {
    pubEl.innerHTML = d.publications.map((pub, i) => `
      <div class="pub-entry${i >= PUB_VISIBLE ? ' pub-entry--hidden' : ''}" style="transition-delay:${i * 0.08}s">
        <div class="pub-date">${pub.date}</div>
        <div class="pub-title"><a href="${pub.url}" target="_blank" rel="noopener">${pub.title} ↗</a></div>
        <div class="pub-venue">${pub.venue}</div>
        <div class="pub-desc">${pub.description}</div>
      </div>`).join('')
    pubEl.querySelectorAll('.pub-entry').forEach(el => scrollObserver.observe(el))
  }

  // Bouton "voir plus" — mise à jour des labels + re-bind
  const wrapper = document.querySelector<HTMLElement>('[data-pub-more-wrapper]')
  if (wrapper && d.publications.length > PUB_VISIBLE) {
    // Recréer le bouton avec les bons labels traduits
    wrapper.innerHTML = `
      <button class="pub-more-btn" data-pub-toggle>
        <span class="pub-more-arrow">▾</span>
        <span class="pub-more-label">${d.labels.seeMore}</span>
      </button>`
    bindPubToggle(d.labels.seeMore, d.labels.seeLess)
  }

  // Languages
  const langEl = document.querySelector<HTMLElement>('[data-languages]')
  if (langEl) {
    langEl.innerHTML = d.languages.map(l => `
      <div class="lang-entry" data-flag="${l.flag}">
        <div class="lang-code">${l.code}</div>
        <div class="lang-name">${l.name}</div>
        <div class="lang-level">${l.level}</div>
      </div>`).join('')
  }
  // Activities
  const actEl = document.querySelector<HTMLElement>('[data-activities]')
  if (actEl) {
    actEl.innerHTML = d.activities.map(a => `
      <div class="act-entry">
        <div class="act-pos">${a.position}</div>
        <div>
          <div class="act-name"><a href="${a.url}" target="_blank" rel="noopener">${a.name} ↗</a></div>
          <div class="act-desc">${a.description}</div>
        </div>
      </div>`).join('')
  }

  // Hobbies
  const hobbyEl = document.querySelector<HTMLElement>('[data-hobbies]')
  if (hobbyEl) {
    hobbyEl.innerHTML = d.hobbies.map(h => `<span class="hobby">${h}</span>`).join('')
  }

  // Footer

}

// ── Scroll observer ─────────────────────────────────────
export const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible')
      scrollObserver.unobserve(e.target)
    }
  })
}, { threshold: 0.12 })

// ── Switcher ────────────────────────────────────────────
export async function applyLang(lang: Lang) {
  localStorage.setItem('cv-lang', lang)
  document.querySelectorAll<HTMLButtonElement>('.lang-btn')
    .forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang))
  const data = await fetchConfig(lang)
  renderCV(data)
}

// ── Init ────────────────────────────────────────────────
export function initI18n() {
  // Scroll observer sur éléments initiaux (rendu SSG FR)
  document.querySelectorAll('.job, .edu-entry, .pub-entry')
    .forEach(el => scrollObserver.observe(el))

  // Mobile tap jobs
  document.querySelectorAll<HTMLElement>('.job')
    .forEach(job => job.addEventListener('click', () => job.classList.toggle('open')))

  // Boutons switcher langue
  document.querySelectorAll<HTMLButtonElement>('.lang-btn')
    .forEach(btn => btn.addEventListener('click', () => applyLang(btn.dataset.lang as Lang)))

  // Toujours passer par applyLang — renderCV gère le rendu initial et les changements de langue
  applyLang(getLang())
}