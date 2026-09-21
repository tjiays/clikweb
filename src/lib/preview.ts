import type { CollectionConfig } from 'payload'

/**
 * Builds the preview URL for a collection.
 *
 * `base` is the public path the item lives under, per language. The slug is
 * localised on articles and reports, so the right one is picked for whichever
 * locale the editor is looking at.
 */
export const previewFor =
  (base: { id: string; en: string }): NonNullable<CollectionConfig['admin']>['preview'] =>
  (doc, { locale }) => {
    const slug = typeof doc?.slug === 'string' ? doc.slug : ''
    if (!slug) return null
    const lang = locale === 'en' ? 'en' : 'id'
    const path = `${base[lang]}/${slug}`
    const params = new URLSearchParams({
      path,
      collection: String(doc?._collection ?? ''),
      slug,
      previewSecret: process.env.PAYLOAD_SECRET || '',
    })
    return `/preview?${params.toString()}`
  }
