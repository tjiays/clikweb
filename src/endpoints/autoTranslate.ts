import type { Endpoint, PayloadRequest } from 'payload'
import { translateFields, TranslationNotConfigured } from '@/lib/translate'

/** Fields that are never translated, even though they hold strings. */
const SKIP_KEYS = new Set([
  'id',
  'slug',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'submittedAt',
  'reviewedAt',
  '_status',
  'approvalStatus',
  'rejectionReason',
  'applyEmail',
  'buttonLink',
  'targetUrl',
  'externalUrl',
  'websiteUrl',
  'videoUrl',
  'url',
  'key',
  'page',
  'productStatus',
  'type',
  'group',
])

const isBlank = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '')

/** Collects every translatable string inside a field value, keyed by its path. */
function collect(value: unknown, path: string, out: Record<string, string>): void {
  if (typeof value === 'string') {
    if (value.trim()) out[path] = value
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${path}.${index}`, out))
    return
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    // Lexical rich text stores its words on text nodes.
    for (const [key, child] of Object.entries(record)) {
      if (SKIP_KEYS.has(key)) continue
      collect(child, `${path}.${key}`, out)
    }
  }
}

/** Rebuilds a field value with the translated strings put back in place. */
function apply(value: unknown, path: string, map: Record<string, string>): unknown {
  if (typeof value === 'string') {
    return map[path] ?? value
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => apply(item, `${path}.${index}`, map))
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const next: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(record)) {
      next[key] = SKIP_KEYS.has(key) ? child : apply(child, `${path}.${key}`, map)
    }
    return next
  }
  return value
}

/**
 * Fills empty English fields from the Indonesian ones.
 *
 * The result is written to the English locale as a draft, so it goes through
 * the same review as any other change. Fields that already have English text
 * are left alone.
 */
export const autoTranslateEndpoint: Endpoint = {
  path: '/auto-translate',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: 'You must be signed in.' }, { status: 401 })
    }

    let body: { collection?: string; id?: string; global?: string }
    try {
      body = (await req.json?.()) ?? {}
    } catch {
      return Response.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const { collection, id, global } = body
    if (!global && (!collection || !id)) {
      return Response.json(
        { error: 'Provide either a collection and id, or a global.' },
        { status: 400 },
      )
    }

    try {
      const source = global
        ? await req.payload.findGlobal({ slug: global as never, locale: 'id', depth: 0 })
        : await req.payload.findByID({
            collection: collection as never,
            id: id as string,
            locale: 'id',
            depth: 0,
          })

      const existing = global
        ? await req.payload.findGlobal({
            slug: global as never,
            locale: 'en',
            fallbackLocale: 'none' as never,
            depth: 0,
          })
        : await req.payload.findByID({
            collection: collection as never,
            id: id as string,
            locale: 'en',
            fallbackLocale: 'none' as never,
            depth: 0,
          })

      // Only fields with no English value yet.
      const pending: Record<string, string> = {}
      const fieldsToWrite: string[] = []
      for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
        if (SKIP_KEYS.has(key)) continue
        if (!isBlank((existing as Record<string, unknown>)?.[key])) continue
        const before = Object.keys(pending).length
        collect(value, key, pending)
        if (Object.keys(pending).length > before) fieldsToWrite.push(key)
      }

      if (Object.keys(pending).length === 0) {
        return Response.json({
          translated: 0,
          message: 'Every field already has English text. Nothing to translate.',
        })
      }

      const translated = await translateFields(pending)

      const data: Record<string, unknown> = {}
      for (const key of fieldsToWrite) {
        data[key] = apply((source as Record<string, unknown>)[key], key, translated)
      }

      if (global) {
        await req.payload.updateGlobal({
          slug: global as never,
          locale: 'en',
          draft: true,
          data: data as never,
          overrideAccess: false,
          user: req.user,
        })
      } else {
        await req.payload.update({
          collection: collection as never,
          id: id as string,
          locale: 'en',
          draft: true,
          data: data as never,
          overrideAccess: false,
          user: req.user,
        })
      }

      return Response.json({
        translated: Object.keys(translated).length,
        fields: fieldsToWrite,
        message:
          'English draft saved. Review the wording, then submit it for approval as usual.',
      })
    } catch (error) {
      if (error instanceof TranslationNotConfigured) {
        return Response.json({ error: error.message }, { status: 503 })
      }
      req.payload.logger.error({ err: error }, 'Auto-translate failed')
      return Response.json(
        { error: error instanceof Error ? error.message : 'Translation failed.' },
        { status: 500 },
      )
    }
  },
}
