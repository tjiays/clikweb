/*
 * The ceiling on an upload, in megabytes.
 *
 * Set against what the library actually holds: the largest file is 608kB and
 * the median is 299kB, so this is roughly eight times the biggest image
 * anyone has needed. It is not a target — it is there to catch a
 * print-resolution or uncompressed file being uploaded without being resized,
 * which is the mistake that actually happens. The earlier 20MB was thirty
 * times the largest file and would never have caught anything.
 *
 * nginx accepts 25M and Next's Server Action limit is 25mb, so this is the
 * limit an editor meets first, with a readable message.
 */
export const MAX_UPLOAD_MB = 5

import type { Field } from 'payload'
import { lockedForApprover } from './approval'

/**
 * URL slug. Localised by default so each language can have its own wording
 * (open item O6). Pass localized: false where the value is a proper noun that
 * reads the same in both languages, such as a media outlet's name.
 */
export const slugField = (from = 'title', localized = true, hiddenFromForm = true): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  localized,
  index: true,
  access: lockedForApprover,
  admin: {
    position: 'sidebar',
    /*
     * Hidden, not removed. It is still the address of the page, still
     * required, and still derived from the title on save — but nobody has to
     * type it, and shown on the form it invited edits that quietly break
     * every existing link to the page.
     */
    hidden: hiddenFromForm,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return slugify(String(value))
        const source = data?.[from]
        return source ? slugify(String(source)) : value
      },
    ],
  },
})

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

/*
 * Leave it at 0 and the list orders itself, newest first: everything shares
 * the same rank, so the tie is broken by creation date. Giving a row a lower
 * number pins it above that block, which is the only time anyone needs to
 * touch this.
 */
export const sortOrderField: Field = {
  name: 'sortOrder',
  type: 'number',
  label: 'Urutan',
  defaultValue: 0,
  access: lockedForApprover,
  admin: {
    position: 'sidebar',
    description:
      'Biarkan 0 — yang terbaru otomatis tampil paling atas. Isi angka lebih kecil hanya bila ingin menyematkan laporan ini di atas.',
  },
}

/** Search engine title and description, in both languages. */
export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  access: lockedForApprover,
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
  ],
}

/** An image from the media library, with alt text in both languages. */
export const imageField = (name: string, label?: string, required = false): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
  required,
  label,
  access: lockedForApprover,
})

export const richText = (name: string, label?: string, required = false): Field => ({
  name,
  type: 'richText',
  label,
  required,
  localized: true,
  access: lockedForApprover,
})

export const localisedText = (name: string, label?: string, required = false): Field => ({
  name,
  type: 'text',
  label,
  required,
  localized: true,
  access: lockedForApprover,
})

export const localisedTextarea = (name: string, label?: string, required = false): Field => ({
  name,
  type: 'textarea',
  label,
  required,
  localized: true,
  access: lockedForApprover,
})

/**
 * Marks content imported from the Figma design as sample rather than real,
 * so the team can find and replace it later (confirmed decision 8).
 */
/*
 * Hidden, not dropped. Nobody needs to see or set it, but the seed scripts
 * match on it to find the placeholder content they are allowed to overwrite
 * (scripts/seed-*.ts, src/migrations/seeds). Removing the column would take
 * away the only thing distinguishing seeded filler from real work — 21
 * records still carry the flag.
 */
export const isSampleField: Field = {
  name: 'isSample',
  type: 'checkbox',
  label: 'Sample content',
  defaultValue: false,
  access: lockedForApprover,
  admin: { position: 'sidebar', hidden: true },
}

/**
 * Guidance under an image field: what size to aim for, and the size ceiling.
 *
 * `displayWidth` is the widest the picture is ever drawn on the site, so an
 * upload narrower than it gets stretched and goes soft. The examples quote a
 * real file already in the library rather than an invented ideal.
 */
export const imageGuidance = (displayWidth: number, example: string) =>
  `Minimal ${displayWidth}px lebar; disarankan ${example}. Gambar yang lebih kecil akan tampak pecah. Maksimal ${MAX_UPLOAD_MB}MB (JPG, PNG atau WebP).`

/**
 * Fills a byline with the name of whoever is writing, so the field is one
 * less thing to type. It is a plain default, not a lock: an editor filing a
 * piece written by someone else just types over it.
 */
export const authorField = (label = 'Penulis', description?: string | null): Field => ({
  name: 'author',
  type: 'text',
  label,
  access: lockedForApprover,
  defaultValue: ({ user }: { user?: unknown }) =>
    (user as { name?: string } | null | undefined)?.name ?? '',
  admin: {
    position: 'sidebar',
    // null asks for no note at all: the field fills itself, so on a tidy
    // sidebar there is nothing left worth saying about it.
    ...(description === null ? {} : { description: description ?? 'Terisi otomatis dengan nama Anda. Ubah bila perlu.' }),
  },
})

/** Publish date, defaulting to now. */
export const publishDateField = (
  required: boolean,
  description: string | null,
  { withTime = true }: { withTime?: boolean } = {},
): Field => ({
  name: 'publishDate',
  type: 'date',
  label: 'Tanggal publikasi',
  required,
  access: lockedForApprover,
  defaultValue: () => new Date().toISOString(),
  admin: {
    position: 'sidebar',
    ...(description === null ? {} : { description }),
    // Articles keep the clock: two posts on one day are ordered by it.
    // Reports are ordered by rank, so the time is noise on the form.
    date: { pickerAppearance: withTime ? 'dayAndTime' : 'dayOnly' },
  },
})

/**
 * Refuses an image too small for the space it has to fill, or over the size
 * limit.
 *
 * The advice in the field description was only advice, and a picture narrower
 * than its slot does not fail loudly — it just goes soft, which nobody
 * notices until it is on the website. This checks the file that was actually
 * chosen, whether it was just uploaded or picked from the library.
 */
export const imageAtLeast =
  (minWidth: number | ((data: Record<string, unknown>) => number)) =>
  async (
    value: unknown,
    {
      req,
      data,
      previousValue,
    }: { req?: { payload?: any }; data?: Record<string, unknown>; previousValue?: unknown },
  ) => {
    if (!value || !req?.payload) return true

    const idOf = (v: unknown) => (typeof v === 'object' && v ? (v as { id?: unknown }).id : v)
    const id = idOf(value)
    if (!id) return true

    /*
     * Only a newly chosen picture is held to this. Several items were saved
     * before the rule existed — an 1134px article banner, a 740px report
     * cover — and refusing those would make the records unsavable, so their
     * authors could not fix anything else about them either. Leave the
     * picture alone and nothing happens; change it and it has to be good
     * enough.
     */
    if (previousValue !== undefined && String(idOf(previousValue) ?? '') === String(id)) {
      return true
    }

    let media: { width?: number; filesize?: number; filename?: string } | null = null
    try {
      media = await req.payload.findByID({
        collection: 'media',
        id: id as never,
        depth: 0,
        overrideAccess: true,
        req,
      })
    } catch {
      // A file that cannot be read is not this field's problem to report.
      return true
    }

    if (typeof media?.filesize === 'number' && media.filesize > MAX_UPLOAD_MB * 1024 * 1024) {
      return `Gambar ini ${(media.filesize / 1024 / 1024).toFixed(1)}MB, melebihi batas ${MAX_UPLOAD_MB}MB.`
    }

    const min = typeof minWidth === 'function' ? minWidth(data ?? {}) : minWidth
    if (typeof media?.width === 'number' && media.width < min) {
      return `Gambar ini hanya ${media.width}px lebar, minimal ${min}px. Yang lebih kecil akan tampak pecah. Pilih atau unggah gambar yang lebih besar.`
    }

    return true
  }
