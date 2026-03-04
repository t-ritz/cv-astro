import { defineConfig } from 'astro/config'
import { copyFileSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

function syncI18nFiles() {
  const src  = join(process.cwd(), 'data/i18n')
  const dest = join(process.cwd(), 'public/data')
  mkdirSync(dest, { recursive: true })
  readdirSync(src)
    .filter(f => f.endsWith('.json'))
    .forEach(f => {
      copyFileSync(join(src, f), join(dest, f))
      console.log(`[sync-i18n] ${f} → public/data/${f}`)
    })
}

export default defineConfig({
  site: 'https://thibaudritzenthaler.dev',
  output: 'static',

  integrations: [
    {
      name: 'sync-i18n',
      hooks: {
        // Copie au démarrage du serveur de dev
        'astro:server:start': syncI18nFiles,
        // Copie avant le build de production
        'astro:build:start':  syncI18nFiles,
      },
    },
  ],
})
