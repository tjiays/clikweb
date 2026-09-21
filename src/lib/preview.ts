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

/**
 * Live Preview: the public page shown in an iframe beside the editing form,
 * so an editor sees the article exactly as the website will render it.
 *
 * The URL is deliberately relative. Staging is reachable on more than one
 * address (LAN and Tailscale), and an absolute URL built from an environment
 * variable would point the iframe at whichever host was configured rather
 * than the one the editor is actually using — which is also a different
 * origin, so the draft-mode cookie would not be sent and the preview would
 * show the published version instead of the draft.
 */
export const livePreviewFor = (base: { id: string; en: string }) => ({
  url: ({ data, locale }: { data: Record<string, unknown>; locale?: { code?: string } }) => {
    const slug = typeof data?.slug === 'string' ? data.slug : ''
    // A document with no slug yet has no page to show.
    if (!slug) return null
    const lang = locale?.code === 'en' ? 'en' : 'id'
    const params = new URLSearchParams({
      path: `${base[lang]}/${slug}`,
      collection: String(data?._collection ?? ''),
      slug,
      previewSecret: process.env.PAYLOAD_SECRET || '',
    })
    return `/preview?${params.toString()}`
  },
  breakpoints: [
    { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
    { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
    { name: 'mobile', label: 'Ponsel', width: 390, height: 844 },
  ],
})
