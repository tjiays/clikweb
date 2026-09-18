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
    description: `Used in the page address. Derived from ${from} if left blank.`,
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

export const sortOrderField: Field = {
  name: 'sortOrder',
  type: 'number',
  defaultValue: 0,
  access: lockedForApprover,
  admin: {
    position: 'sidebar',
    description: 'Lower numbers appear first.',
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
