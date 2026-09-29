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
  /*
   * One address, one page. Two articles with the same title used to get the
   * same slug; the page loads the first match, so the other could never be
   * reached (two "Gundul Gundul Pacul" reports did exactly that). The hook
   * below avoids a clash by adding -2, -3…; the database refuses one that
   * slips past it.
   */
  unique: !localized,
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
      async ({ value, data, originalDoc, collection, req }) => {
        const base = value
          ? slugify(String(value))
          : data?.[from]
            ? slugify(String(data[from]))
            : value
        if (!base || localized || !collection?.slug || !req?.payload) return base

        // First free address: base, base-2, base-3…, ignoring this item itself.
        const selfId = (originalDoc as { id?: unknown } | undefined)?.id
        for (let n = 1; n < 100; n++) {
          const candidate = n === 1 ? String(base) : `${base}-${n}`
          const taken = await req.payload.count({
            collection: collection.slug as never,
            where: {
              and: [
                { slug: { equals: candidate } },
                ...(selfId !== undefined ? [{ id: { not_equals: selfId } }] : []),
              ],
            } as never,
            overrideAccess: true,
            req,
          })
          if (taken.totalDocs === 0) return candidate
        }
        return base
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
      'Biarkan 0 untuk urutan otomatis, terbaru di atas. Angka lebih kecil menyematkan ke atas.',
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

/**
 * What a picture has to be, for one place it appears.
 *
 * `minWidth` is twice the width the slot is drawn at, because that is what a
 * retina screen asks for — a card rendered 416px wide wants an 832px file.
 * The ratio bounds are deliberately loose: they exist to catch a portrait
 * photo dropped into a landscape slot, not to argue about 1.7 against 1.8.
 *
 * The wording and the check are both built from this, so the field cannot
 * promise one thing and enforce another.
 */
export type ImageRule = {
  /** Twice the CSS width of the slot. */
  minWidth: number
  /** Acceptable width-to-height range. */
  ratio: { min: number; max: number }
  /** A real size that works, quoted to the editor. */
  recommended: string
  /** The ratio as editors would write it, per language. */
  label: { en: string; id: string }
  /** Orientation, named when a picture is the wrong shape. */
  shape: { en: string; id: string }
}

export const IMAGE_RULES = {
  /* Card: aspect-ratio 406/232 in Cards.module.css, drawn 416px wide. */
  /*
   * 1140x650 is a real export from the Figma set, and the largest of the six
   * card covers there. The six average 897x513 and every one of them is 1.75,
   * so the shape is settled; the size is the biggest the design has actually
   * produced rather than a number worked back from the slot.
   */
  articleCover: {
    minWidth: 832,
    ratio: { min: 1.2, max: 3 },
    recommended: '1140x650px',
    label: { en: '7:4', id: '7:4' },
    shape: { en: 'landscape', id: 'mendatar' },
  },
  /* Banner: aspect-ratio 1300/372 on the article page, drawn 1300px wide. */
  /*
   * The slot's own dimensions, straight off aspect-ratio 1300/372 in
   * ArticleDetailPage.module.css. The one banner in the Figma set is 1134x324
   * at the same 3.5, which is narrower than the space it fills, so the design
   * itself is the better target here.
   */
  articleBanner: {
    minWidth: 1300,
    ratio: { min: 2.8, max: 4.2 },
    recommended: '1300x372px',
    label: { en: '3.5:1', id: '3,5:1' },
    shape: { en: 'wide', id: 'memanjang' },
  },
  /* An annual report also fills the 1300px hero above its page. */
  reportCoverAnnual: {
    minWidth: 1300,
    ratio: { min: 1.2, max: 3 },
    recommended: '2000x1333px',
    label: { en: '3:2', id: '3:2' },
    shape: { en: 'landscape', id: 'mendatar' },
  },
  /* A business development report only ever appears on the card. */
  /* Card only. 1218x833 is the real business development cover; rounded. */
  reportCoverBusiness: {
    minWidth: 832,
    ratio: { min: 1.2, max: 3 },
    recommended: '1200x800px',
    label: { en: '3:2', id: '3:2' },
    shape: { en: 'landscape', id: 'mendatar' },
  },
  /* Product row image, drawn 640px wide. */
  productImage: {
    minWidth: 1280,
    ratio: { min: 1.2, max: 3 },
    recommended: '1280x720px',
    label: { en: '16:9', id: '16:9' },
    shape: { en: 'landscape', id: 'mendatar' },
  },
} satisfies Record<string, ImageRule>

/**
 * The note under an image field: the ratio, the size to aim for, the cap.
 *
 * Deliberately terse. The long version explained why a small picture looks
 * bad, which is a sentence nobody reads twice and which pushed the useful
 * numbers to the end of the line.
 */
export const imageGuidance = (rule: ImageRule) => ({
  en: `Ratio ${rule.label.en}; min ${rule.recommended}; max ${MAX_UPLOAD_MB}MB`,
  id: `Rasio ${rule.label.id}; min ${rule.recommended}; maks ${MAX_UPLOAD_MB}MB`,
})

/**
 * Refuses a picture that is too small, the wrong shape, or over the limit.
 *
 * Only a newly chosen file is checked. Several images were saved before these
 * rules existed — an 1134px banner that came from the Figma export, a 740px
 * cover — and refusing those would make the records unsavable, so their
 * authors could not fix anything else about them either. Leave the picture
 * alone and nothing happens; change it and it has to be right.
 */
export const imageRule =
  (rule: ImageRule | ((data: Record<string, unknown>) => ImageRule)) =>
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
    if (previousValue !== undefined && String(idOf(previousValue) ?? '') === String(id)) {
      return true
    }

    let media: { width?: number; height?: number; filesize?: number } | null = null
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

    const r = typeof rule === 'function' ? rule(data ?? {}) : rule

    if (typeof media?.filesize === 'number' && media.filesize > MAX_UPLOAD_MB * 1024 * 1024) {
      return `Ukuran ${(media.filesize / 1024 / 1024).toFixed(1)}MB, maksimal ${MAX_UPLOAD_MB}MB.`
    }

    const { width, height } = media ?? {}
    if (typeof width === 'number' && typeof height === 'number' && height > 0) {
      const ratio = width / height
      if (ratio < r.ratio.min || ratio > r.ratio.max) {
        return `Ukuran ${width}x${height}px tidak sesuai. Perlu rasio ${r.label.id} (${r.shape.id}), mis. ${r.recommended}.`
      }
    }

    if (typeof width === 'number' && width < r.minWidth) {
      return `Lebar ${width}px, minimal ${r.minWidth}px. Disarankan ${r.recommended}.`
    }

    return true
  }
