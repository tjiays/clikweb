import type { CollectionConfig } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import {
  imageField,
  localisedText,
  localisedTextarea,
  richText,
  seoFields,
  slugField,
} from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'

/**
 * Articles are the only Newsroom collection left in the CMS.
 *
 * Authors became a plain text byline, and the media outlets and their
 * coverage moved into src/content/newsroom.ts — they are a fixed list that
 * changes rarely, and each one was costing a menu item.
 */
export const Articles: CollectionConfig = contentCollection({
  slug: 'articles',
  labels: { singular: 'Artikel', plural: 'Artikel' },
  group: 'Newsroom',
  owners: MODULE_OWNERS.newsroom,
  defaultColumns: ['title', 'author', 'publishDate', 'isFeatured', 'approvalStatus'],
  fields: [
    localisedText('title', 'Judul', true),
    slugField(),
    localisedTextarea('excerpt', 'Ringkasan'),
    richText('body', 'Isi artikel', true),
    imageField('cover', 'Gambar sampul'),
    {
      // A name rather than a relationship: one less collection for a byline.
      name: 'author',
      type: 'text',
      label: 'Penulis',
      access: lockedForApprover,
    },
    {
      name: 'publishDate',
      type: 'date',
      required: true,
      access: lockedForApprover,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured News',
      access: lockedForApprover,
      admin: {
        position: 'sidebar',
        description: 'Shows in the Featured News list on the Newsroom page.',
      },
    },
    seoFields,
  ],
})
