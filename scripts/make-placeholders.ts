import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Generates branded placeholder images so the seeded site looks like the
 * design before real photography arrives. Every one is flagged as sample in
 * the CMS and is meant to be replaced.
 */

const OUT = path.resolve(process.cwd(), '.placeholders')

const NAVY = '#003A79'
const ORANGE = '#FF7D00'

const svg = (width: number, height: number, label: string, dark: boolean) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${dark ? NAVY : '#F1FAFF'}"/>
      <stop offset="100%" stop-color="${dark ? '#00254D' : '#DBE4F0'}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <rect x="0" y="${height - 6}" width="${width}" height="6" fill="${ORANGE}"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif" font-size="${Math.max(16, Math.round(width / 26))}"
        font-weight="800" fill="${dark ? '#FFFFFF' : NAVY}" opacity="0.85">${label}</text>
</svg>`

type Spec = { file: string; w: number; h: number; label: string; dark: boolean }

const specs: Spec[] = [
  { file: 'hero-1.png', w: 1440, h: 860, label: 'Hero 1', dark: true },
  { file: 'hero-2.png', w: 1440, h: 860, label: 'Hero 2', dark: true },
  { file: 'hero-3.png', w: 1440, h: 860, label: 'Hero 3', dark: true },
  { file: 'about.png', w: 1200, h: 700, label: 'Tentang CLIK', dark: false },
  { file: 'visi.png', w: 800, h: 600, label: 'Visi', dark: false },
  { file: 'misi.png', w: 800, h: 600, label: 'Misi', dark: false },
  { file: 'products.png', w: 1200, h: 700, label: 'Layanan dan Produk', dark: false },
  { file: 'business-solution.png', w: 1200, h: 700, label: 'Business Solution', dark: false },
  { file: 'credit-scoring.png', w: 1200, h: 700, label: 'Credit Scoring', dark: false },
  { file: 'cta-banner.png', w: 1440, h: 480, label: 'CTA', dark: true },
  { file: 'article.png', w: 1200, h: 700, label: 'Berita', dark: false },
  { file: 'icon-credit-scoring.png', w: 160, h: 160, label: 'CS', dark: false },
  { file: 'icon-analytics.png', w: 160, h: 160, label: 'AN', dark: false },
  { file: 'icon-decisioning.png', w: 160, h: 160, label: 'DC', dark: false },
  { file: 'icon-business-intelligence.png', w: 160, h: 160, label: 'BI', dark: false },
  { file: 'icon-consulting.png', w: 160, h: 160, label: 'CO', dark: false },
  { file: 'logo-afpi.png', w: 240, h: 100, label: 'AFPI', dark: false },
  { file: 'logo-biia.png', w: 240, h: 100, label: 'BIIA', dark: false },
  { file: 'logo-aftech.png', w: 240, h: 100, label: 'AFTECH', dark: false },
  { file: 'logo-appi.png', w: 240, h: 100, label: 'APPI', dark: false },
  { file: 'logo-ojk.png', w: 240, h: 100, label: 'OJK', dark: false },
]

const run = async () => {
  await fs.mkdir(OUT, { recursive: true })
  for (const spec of specs) {
    const buffer = Buffer.from(svg(spec.w, spec.h, spec.label, spec.dark))
    await sharp(buffer).png().toFile(path.join(OUT, spec.file))
  }
  console.log(`Generated ${specs.length} placeholder images in ${OUT}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
