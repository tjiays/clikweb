import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'node:path'
import fs from 'node:fs'

/**
 * Replaces the generated placeholder images with the real assets exported
 * from the Figma file (logos, photography and icons).
 *
 * Idempotent: an asset already in the media library is reused rather than
 * uploaded again, so this can be re-run safely.
 */

const DIR = path.resolve(process.cwd(), '.assets')

/** file name -> alt text, in both languages */
const ALT: Record<string, { id: string; en: string }> = {
  'logo-clik': { id: 'Logo CLIK', en: 'CLIK logo' },
  'logo-ojk': { id: 'Logo Otoritas Jasa Keuangan', en: 'Financial Services Authority logo' },
  'logo-aftech': { id: 'Logo Fintech Indonesia', en: 'Fintech Indonesia logo' },
  'logo-appi': { id: 'Logo APPI', en: 'APPI logo' },
  'logo-biia': { id: 'Logo BIIA', en: 'BIIA logo' },
  'logo-afpi': { id: 'Logo AFPI', en: 'AFPI logo' },
  'hero-1': { id: 'Pelaku bisnis berjalan di area perkantoran', en: 'Business people walking through an office district' },
  'hero-2': { id: 'Kota dengan jaringan data yang terhubung', en: 'A city overlaid with a connected data network' },
  'hero-3': { id: 'Lanskap kota pada malam hari', en: 'City skyline at night' },
  'cta-banner': { id: 'Seseorang menggunakan ponsel', en: 'A person using a mobile phone' },
  'about': { id: 'Tim CLIK', en: 'The CLIK team' },
  'products': { id: 'Layanan dan produk CLIK', en: 'CLIK products and services' },
  'article-1': { id: 'CLIK Propensity Score', en: 'CLIK Propensity Score' },
  'article-2': { id: 'Analitik portofolio CLIK', en: 'CLIK portfolio analytics' },
  'article-3': { id: 'Penilaian risiko kredit', en: 'Credit risk assessment' },
  'report': { id: 'Sampul laporan tahunan', en: 'Annual report cover' },
  'career-1': { id: 'Suasana kerja di CLIK', en: 'Working at CLIK' },
  'career-2': { id: 'Tim CLIK berkolaborasi', en: 'The CLIK team collaborating' },
  'career-3': { id: 'Kantor CLIK', en: 'The CLIK office' },
  'visi': { id: 'Ilustrasi visi perusahaan', en: 'Company vision illustration' },
  'misi': { id: 'Ilustrasi misi perusahaan', en: 'Company mission illustration' },
  'crif-network': { id: 'Jaringan global CRIF', en: 'The global CRIF network' },
  'about-office': { id: 'Gedung kantor CLIK', en: 'The CLIK office building' },
  'icon-stat-countries': { id: 'Ikon globe', en: 'Globe icon' },
  'icon-stat-institutions': { id: 'Ikon lembaga keuangan', en: 'Financial institution icon' },
  'icon-stat-consumers': { id: 'Ikon konsumen', en: 'Consumer icon' },
  'icon-credit-scoring': { id: 'Ikon Credit Scoring', en: 'Credit Scoring icon' },
  'icon-analytics': { id: 'Ikon Analytics', en: 'Analytics icon' },
  'icon-decisioning': { id: 'Ikon Decisioning', en: 'Decisioning icon' },
  'icon-business-intelligence': { id: 'Ikon Business Intelligence', en: 'Business Intelligence icon' },
  'icon-consulting': { id: 'Ikon Consulting', en: 'Consulting icon' },
  'icon-benefit-health': { id: 'Ikon asuransi kesehatan', en: 'Health insurance icon' },
  'icon-benefit-skill': { id: 'Ikon pengembangan skill', en: 'Skill development icon' },
  'icon-benefit-career': { id: 'Ikon jenjang karir', en: 'Career progression icon' },
  'icon-benefit-hours': { id: 'Ikon jam kerja fleksibel', en: 'Flexible hours icon' },
  'icon-social-whatsapp': { id: 'WhatsApp', en: 'WhatsApp' },
  'icon-social-instagram': { id: 'Instagram', en: 'Instagram' },
  'icon-social-linkedin': { id: 'LinkedIn', en: 'LinkedIn' },
}

const run = async () => {
  const payload = await getPayload({ config })
  const log = (m: string) => payload.logger.info(m)

  if (!fs.existsSync(DIR)) throw new Error(`No .assets directory at ${DIR}`)

  // --- Upload, reusing anything already there ---
  const existing = await payload.find({ collection: 'media', limit: 500, locale: 'id' })
  const byName: Record<string, string | number> = {}
  for (const doc of existing.docs as { id: string | number; filename?: string }[]) {
    if (doc.filename) byName[doc.filename] = doc.id
  }

  const media: Record<string, string | number> = {}
  for (const file of fs.readdirSync(DIR).sort()) {
    const key = file.replace(/\.[^.]+$/, '')
    const alt = ALT[key] ?? { id: key, en: key }

    // A placeholder generated earlier may carry the same file name. Replacing
    // the file on the existing record is what actually swaps the image;
    // reusing the record without a new file would leave the placeholder in
    // place and only look as though it worked.
    if (byName[file]) {
      await payload.update({
        collection: 'media',
        id: byName[file],
        locale: 'id',
        data: { alt: alt.id, isSample: false } as never,
        filePath: path.join(DIR, file),
        overrideAccess: true,
      })
      await payload.update({
        collection: 'media',
        id: byName[file],
        locale: 'en',
        data: { alt: alt.en } as never,
        overrideAccess: true,
      })
      media[key] = byName[file]
      continue
    }
    const created = await payload.create({
      collection: 'media',
      locale: 'id',
      data: { alt: alt.id, isSample: false } as never,
      filePath: path.join(DIR, file),
      overrideAccess: true,
    })
    const doc = created as { id: string | number }
    await payload.update({
      collection: 'media',
      id: doc.id,
      locale: 'en',
      data: { alt: alt.en } as never,
      overrideAccess: true,
    })
    media[key] = doc.id
  }
  log(`Media library: ${Object.keys(media).length} real assets available`)

  /** Points one document's field at a real asset. */
  const setImage = async (
    collection: string,
    where: Record<string, unknown>,
    field: string,
    assetKey: string,
  ) => {
    if (!media[assetKey]) return false
    const { docs } = await payload.find({
      collection: collection as never,
      where: where as never,
      limit: 1,
      locale: 'id',
    })
    const doc = docs[0] as { id: string | number } | undefined
    if (!doc) return false
    await payload.update({
      collection: collection as never,
      id: doc.id,
      locale: 'id',
      data: { [field]: media[assetKey] } as never,
      overrideAccess: true,
    })
    return true
  }

  // --- Hero slides ---
  let n = 0
  const heroes = await payload.find({ collection: 'hero-slides', limit: 10, sort: 'sortOrder', locale: 'id' })
  for (const [index, slide] of (heroes.docs as { id: string | number }[]).entries()) {
    const key = `hero-${index + 1}`
    if (!media[key]) continue
    await payload.update({
      collection: 'hero-slides',
      id: slide.id,
      locale: 'id',
      data: { image: media[key] } as never,
      overrideAccess: true,
    })
    n++
  }
  log(`Hero slides updated: ${n}`)

  // --- Partner logos ---
  const logoFor: Record<string, string> = {
    AFPI: 'logo-afpi',
    BIIA: 'logo-biia',
    'Fintech Indonesia (AFTECH)': 'logo-aftech',
    APPI: 'logo-appi',
    OJK: 'logo-ojk',
  }
  n = 0
  for (const [name, key] of Object.entries(logoFor)) {
    if (await setImage('partner-logos', { name: { equals: name } }, 'logo', key)) n++
  }
  log(`Partner logos updated: ${n}`)

  // --- Stat icons ---
  const statIcon = ['icon-stat-countries', 'icon-stat-institutions', 'icon-stat-consumers']
  const stats = await payload.find({ collection: 'stats', limit: 10, sort: 'sortOrder', locale: 'id' })
  n = 0
  for (const [index, stat] of (stats.docs as { id: string | number }[]).entries()) {
    const key = statIcon[index]
    if (!key || !media[key]) continue
    await payload.update({
      collection: 'stats',
      id: stat.id,
      locale: 'id',
      data: { icon: media[key] } as never,
      overrideAccess: true,
    })
    n++
  }
  log(`Stat icons updated: ${n}`)

  // --- Product category icons and images ---
  n = 0
  for (const slug of [
    'credit-scoring',
    'analytics',
    'decisioning',
    'business-intelligence',
    'consulting',
  ]) {
    if (await setImage('product-categories', { slug: { equals: slug } }, 'icon', `icon-${slug}`)) n++
    await setImage('product-categories', { slug: { equals: slug } }, 'image', 'products')
  }
  log(`Product category icons updated: ${n}`)

  // --- Page hero images ---
  const pageImage: Record<string, string> = {
    about: 'about-office',
    products: 'products',
    'business-solution': 'products',
    'credit-scoring': 'article-3',
  }
  n = 0
  for (const [page, key] of Object.entries(pageImage)) {
    if (await setImage('page-content', { page: { equals: page } }, 'heroImage', key)) n++
  }
  log(`Page hero images updated: ${n}`)

  // --- Section images inside page content ---
  const sectionImage: Record<string, Record<string, string>> = {
    about: { visi: 'visi', misi: 'misi', 'tentang-crif': 'crif-network' },
    products: { 'apa-itu-skor-kredit': 'article-3' },
    'credit-scoring': { 'apa-itu': 'article-2' },
  }
  n = 0
  for (const [page, sections] of Object.entries(sectionImage)) {
    const { docs } = await payload.find({
      collection: 'page-content',
      where: { page: { equals: page } } as never,
      limit: 1,
      locale: 'id',
      depth: 0,
    })
    const doc = docs[0] as { id: string | number; sections?: Record<string, unknown>[] } | undefined
    if (!doc?.sections) continue
    const updated = doc.sections.map((row) => {
      const key = String((row as { key?: unknown }).key ?? '')
      const asset = sections[key]
      return asset && media[asset] ? { ...row, image: media[asset] } : row
    })
    await payload.update({
      collection: 'page-content',
      id: doc.id,
      locale: 'id',
      data: { sections: updated } as never,
      overrideAccess: true,
    })
    n++
  }
  log(`Page section images updated: ${n}`)

  // --- CTA banners ---
  const ctas = await payload.find({ collection: 'cta-blocks', limit: 20, locale: 'id' })
  n = 0
  for (const cta of ctas.docs as { id: string | number; banner?: Record<string, unknown>; crossLink?: Record<string, unknown> }[]) {
    const data: Record<string, unknown> = {}
    if (cta.banner) data.banner = { ...cta.banner, backgroundImage: media['cta-banner'] }
    if (cta.crossLink && (cta.crossLink as { title?: unknown }).title) {
      data.crossLink = { ...cta.crossLink, image: media['products'] }
    }
    if (Object.keys(data).length === 0) continue
    await payload.update({
      collection: 'cta-blocks',
      id: cta.id,
      locale: 'id',
      data: data as never,
      overrideAccess: true,
    })
    n++
  }
  log(`CTA blocks updated: ${n}`)

  // --- Article covers ---
  const articles = await payload.find({ collection: 'articles', limit: 50, sort: '-publishDate', locale: 'id' })
  const covers = ['article-1', 'article-2', 'article-3']
  n = 0
  for (const [index, article] of (articles.docs as { id: string | number }[]).entries()) {
    await payload.update({
      collection: 'articles',
      id: article.id,
      locale: 'id',
      data: { cover: media[covers[index % covers.length]] } as never,
      overrideAccess: true,
    })
    n++
  }
  log(`Article covers updated: ${n}`)

  // --- Report covers (annual reports only; the business one has none) ---
  const reports = await payload.find({
    collection: 'reports',
    where: { type: { equals: 'annual_report' } } as never,
    limit: 20,
    locale: 'id',
  })
  n = 0
  for (const report of reports.docs as { id: string | number }[]) {
    await payload.update({
      collection: 'reports',
      id: report.id,
      locale: 'id',
      data: { cover: media['report'] } as never,
      overrideAccess: true,
    })
    n++
  }
  log(`Report covers updated: ${n}`)

  // --- Media outlet logos stay as placeholders: the real outlet logos are
  //     not in the Figma file and must not be invented. ---

  // --- Career page: hero carousel and benefit icons ---
  const career = (await payload.findGlobal({
    slug: 'career-page',
    locale: 'id',
    depth: 0,
  })) as unknown as Record<string, unknown>
  const benefitIcons = [
    'icon-benefit-health',
    'icon-benefit-skill',
    'icon-benefit-career',
    'icon-benefit-hours',
  ]
  const benefits = (career.benefits as { id?: string }[] | undefined) ?? []
  await payload.updateGlobal({
    slug: 'career-page',
    locale: 'id',
    data: {
      heroImages: ['career-1', 'career-2', 'career-3']
        .filter((k) => media[k])
        .map((k) => ({ image: media[k] })),
      benefits: benefits.map((row, index) => ({
        ...row,
        icon: media[benefitIcons[index]] ?? undefined,
      })),
    } as never,
    overrideAccess: true,
  })
  log('Career page images updated')

  log('Real assets imported.')
  process.exit(0)
}

run().catch((error) => {
  const detail = (error as { data?: { errors?: unknown[] } })?.data?.errors
  if (detail) console.error('Validation errors:', JSON.stringify(detail, null, 2))
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
