import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One-line product descriptions, transcribed from the Figma product cards
 * (1625:10967). These are the design's own words — not invented, which rule 1
 * of intent/00-README.md forbids for product facts.
 *
 * Only the Credit Scoring products appear in the design; the rest are left
 * empty rather than guessed.
 */
const DESCRIPTIONS: Record<string, { id: string; en: string }> = {
  'Full Report': {
    id: 'Lihat gambaran kredit secara menyeluruh sebelum mengambil keputusan.',
    en: 'See the full credit picture before making a decision.',
  },
  'Slim Report': {
    id: 'Dapatkan informasi kredit esensial dengan lebih sederhana.',
    en: 'Get the essential credit information, more simply.',
  },
  'Soft Pull Report': {
    id: 'Verifikasi nasabah dan nilai risikonya dalam satu pengecekan.',
    en: 'Verify a customer and assess their risk in a single check.',
  },
  'Compliance Report': {
    id: 'Dukung proses compliance dengan format laporan kredit yang familiar.',
    en: 'Support compliance work with a familiar credit report format.',
  },
  'Unified Report': {
    id: 'Satukan pihak terkait dan informasi bisnis dalam satu gambaran yang lebih jelas.',
    en: 'Bring related parties and business information into one clearer picture.',
  },
  'Aggregated Variable Calculation (AVC)': {
    id: 'Ubah data biro menjadi variabel siap pakai untuk pengambilan keputusan.',
    en: 'Turn bureau data into ready-to-use variables for decision making.',
  },
  'Fintech Bureau (FDC)': {
    id: 'Satukan data kredit fintech dalam satu gambaran yang lebih menyeluruh.',
    en: 'Bring fintech credit data into one more complete picture.',
  },
  'Generic CB Score (CBG)': {
    id: 'Ubah perilaku kredit menjadi gambaran risiko yang konsisten.',
    en: 'Turn credit behaviour into a consistent view of risk.',
  },
  'CLIK SKAI Score': {
    id: 'Penilaian risiko yang lebih tepat untuk kredit bernilai kecil dan berjangka pendek.',
    en: 'More accurate risk assessment for small, short-term credit.',
  },
  'CLIK Spectrum Score (CSS)': {
    id: 'Gabungkan sinyal biro dan telco untuk visibilitas risiko yang lebih luas.',
    en: 'Combine bureau and telco signals for wider risk visibility.',
  },
  'Fintech CB Score': {
    id: 'Credit risk intelligence yang dirancang untuk digital lending.',
    en: 'Credit risk intelligence designed for digital lending.',
  },
  'Score Factor': {
    id: 'Pahami faktor yang membentuk setiap credit score.',
    en: 'Understand the factors behind every credit score.',
  },
  'Application Score': {
    id: 'Nilai risiko calon nasabah sejak tahap pengajuan.',
    en: 'Assess applicant risk from the application stage.',
  },
}

const run = async () => {
  const payload = await getPayload({ config })
  let updated = 0
  for (const [name, text] of Object.entries(DESCRIPTIONS)) {
    const { docs } = await payload.find({
      collection: 'product-items',
      where: { name: { equals: name } } as never,
      limit: 1,
      locale: 'id',
    })
    const doc = docs[0] as { id: string | number } | undefined
    if (!doc) {
      payload.logger.warn(`No product named "${name}"`)
      continue
    }
    await payload.update({
      collection: 'product-items',
      id: doc.id,
      locale: 'id',
      data: { shortDescription: text.id } as never,
      overrideAccess: true,
    })
    await payload.update({
      collection: 'product-items',
      id: doc.id,
      locale: 'en',
      data: { shortDescription: text.en } as never,
      overrideAccess: true,
    })
    updated++
  }
  payload.logger.info(`Added descriptions to ${updated} products`)
  process.exit(0)
}
run().catch((e) => { console.error(e); process.exit(1) })
