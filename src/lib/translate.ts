import Anthropic from '@anthropic-ai/sdk'

/**
 * Indonesian to English translation for CMS content.
 *
 * Indonesian is the source language. English is produced here and reviewed by
 * the team afterwards — the result is always saved as a draft, never published
 * directly (intent/04 §4).
 */

/** Agreed wording, so the same Indonesian term is always rendered the same way. */
const GLOSSARY: Record<string, string> = {
  'biro kredit': 'credit bureau',
  'lembaga keuangan': 'financial institution',
  'lembaga non-keuangan': 'non-financial institution',
  'laporan kredit': 'credit report',
  'skor kredit': 'credit score',
  'penyelesaian pengaduan': 'complaint resolution',
  'Layanan dan Produk': 'Products & Services',
  'Tentang Kami': 'About Us',
  Karir: 'Careers',
  'Hubungi Kami': 'Contact Us',
  'Laporan Tahunan': 'Annual Report',
  'Terdaftar & Diawasi oleh OJK': 'Registered & Supervised by OJK',
}

/** Names and product names that must survive translation untouched. */
const DO_NOT_TRANSLATE = [
  'CLIK',
  'CRIF',
  'OJK',
  'AFPI',
  'AFTECH',
  'APPI',
  'BIIA',
  'PT CRIF Lembaga Informasi Keuangan',
  'Full Report',
  'Slim Report',
  'Soft Pull Report',
  'Compliance Report',
  'Unified Report',
  'Scoremart',
  'CLIK SKAI Score',
  'CLIK Spectrum Score',
  'Fintech Bureau',
  'Generic CB Score',
  'Application Score',
  'Score Factor',
  'Portfolio Risk Insight',
  'Credit Policy',
  'Simple Decision',
  'Sandbox',
  'Dashboard',
]

const SYSTEM_PROMPT = `You translate website copy for CLIK (PT CRIF Lembaga Informasi Keuangan), an Indonesian credit bureau regulated by OJK.

Translate from Indonesian to English. The audience is international partners, regulators and media, so the register is professional and plain.

Use exactly this wording for these terms:
${Object.entries(GLOSSARY)
  .map(([id, en]) => `  "${id}" -> "${en}"`)
  .join('\n')}

Never translate these, reproduce them exactly:
${DO_NOT_TRANSLATE.map((t) => `  ${t}`).join('\n')}

Rules:
- Preserve meaning precisely. This is regulated financial content; do not embellish, soften or add claims.
- Keep the same paragraph and sentence structure.
- Leave numbers, dates, email addresses and URLs unchanged.
- If a value is already in English, return it unchanged.

You will be given a JSON object mapping field names to Indonesian text. Return a JSON object with exactly the same keys, where each value is the English translation. Return only the JSON object, with no commentary.`

export type TranslationInput = Record<string, string>

export class TranslationNotConfigured extends Error {
  constructor() {
    super(
      'ANTHROPIC_API_KEY is not set, so auto-translate is unavailable. Add it to .env and restart.',
    )
    this.name = 'TranslationNotConfigured'
  }
}

/**
 * Translates a set of named strings. Returns a map with the same keys.
 * Throws TranslationNotConfigured when no API key is present.
 */
export async function translateFields(fields: TranslationInput): Promise<TranslationInput> {
  const entries = Object.entries(fields).filter(([, value]) => value && value.trim())
  if (entries.length === 0) return {}

  if (!process.env.ANTHROPIC_API_KEY) throw new TranslationNotConfigured()

  const client = new Anthropic()
  const payload = Object.fromEntries(entries)

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: JSON.stringify(payload, null, 2) }],
  })

  if (response.stop_reason === 'refusal') {
    throw new Error('The translation request was declined. Review the content and try again.')
  }

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim()

  return parseTranslationResponse(text, Object.keys(payload))
}

/** Pulls the JSON object out of the reply and keeps only the keys we asked about. */
export function parseTranslationResponse(
  text: string,
  expectedKeys: string[],
): TranslationInput {
  // Tolerate a fenced code block around the JSON.
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error('The translation service returned something that was not valid JSON.')
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('The translation service returned an unexpected shape.')
  }

  const record = parsed as Record<string, unknown>
  const result: TranslationInput = {}
  for (const key of expectedKeys) {
    const value = record[key]
    if (typeof value === 'string') result[key] = value
  }
  return result
}
