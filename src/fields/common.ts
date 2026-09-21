import type { Field } from 'payload'
import { lockedForApprover } from './approval'

/**
 * URL slug. Localised by default so each language can have its own wording
 * (open item O6). Pass localized: false where the value is a proper noun that
 * reads the same in both languages, such as a media outlet's name.
 */
export const slugField = (from = 'title', localized = true): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  localized,
  index: true,
  access: lockedForApprover,
  admin: {
    position: 'sidebar',
    description: `Terisi otomatis dari ${from === 'title' ? 'judul' : from} saat disimpan. Ini bagian dari alamat halaman — ubah hanya bila perlu, karena mengubahnya memutus tautan lama.`,
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
export const isSampleField: Field = {
  name: 'isSample',
  type: 'checkbox',
  label: 'Sample content',
  defaultValue: false,
  access: lockedForApprover,
  admin: {
    position: 'sidebar',
    description: 'Seed content from the design. Replace before launch.',
  },
}

/**
 * Guidance under an image field: what size to aim for, and the 20MB ceiling.
 *
 * `displayWidth` is the widest the picture is ever drawn on the site, so an
 * upload narrower than it gets stretched and goes soft. The examples quote a
 * real file already in the library rather than an invented ideal.
 */
export const imageGuidance = (displayWidth: number, example: string) =>
  `Minimal ${displayWidth}px lebar; disarankan ${example}. Gambar yang lebih kecil akan tampak pecah. Maksimal 20MB (JPG, PNG atau WebP).`

/**
 * Fills a byline with the name of whoever is writing, so the field is one
 * less thing to type. It is a plain default, not a lock: an editor filing a
 * piece written by someone else just types over it.
 */
export const authorField = (label = 'Penulis', description?: string): Field => ({
  name: 'author',
  type: 'text',
  label,
  access: lockedForApprover,
  defaultValue: ({ user }: { user?: unknown }) =>
    (user as { name?: string } | null | undefined)?.name ?? '',
  admin: {
    position: 'sidebar',
    description: description ?? 'Terisi otomatis dengan nama Anda. Ubah bila perlu.',
  },
})

/** Publish date, defaulting to now. */
export const publishDateField = (required: boolean, description: string): Field => ({
  name: 'publishDate',
  type: 'date',
  label: 'Tanggal publikasi',
  required,
  access: lockedForApprover,
  defaultValue: () => new Date().toISOString(),
  admin: {
    position: 'sidebar',
    description,
    date: { pickerAppearance: 'dayAndTime' },
  },
})
