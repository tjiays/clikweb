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
  preview: { id: '/newsroom', en: '/en/newsroom' },
  defaultColumns: ['title', 'author', 'publishDate', 'isFeatured', 'approvalStatus'],
  fields: [
    localisedText('title', 'Judul', true),
    slugField(),
    localisedTextarea('excerpt', 'Ringkasan'),
    richText('body', 'Isi artikel'),
    imageField('cover', 'Gambar sampul'),
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar banner (halaman detail)',
      access: lockedForApprover,
      admin: {
        description:
          'Optional. The wide 1300x372 image at the top of the article page. Leave empty to use the cover.',
      },
    },
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
      admin: {
        position: 'sidebar',
        description: 'Newest first on the Newsroom and Home. Same day: the later time comes first.',
        date: { pickerAppearance: 'dayAndTime' },
      },
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
    {
      name: 'featuredPositions',
      type: 'number',
      hasMany: true,
      min: 1,
      label: 'Posisi di Featured News',
      access: lockedForApprover,
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.isFeatured),
        description:
          'Place in the Featured News list (1 = top). An article may take more than one place. Empty: after the numbered ones, newest first.',
      },
    },
    {
      name: 'hideFromList',
      type: 'checkbox',
      label: 'Sembunyikan dari daftar',
      defaultValue: false,
      access: lockedForApprover,
      admin: {
        position: 'sidebar',
        description:
          'Keeps the article off the Newsroom cards, Home and "Anda mungkin juga tertarik dengan". Its page and its Featured News link still work.',
      },
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      maxRows: 3,
      label: 'Anda mungkin juga tertarik dengan',
      access: lockedForApprover,
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
      admin: {
        description: 'Up to 3 articles, in order. Empty: the newest articles.',
      },
    },
    seoFields,
  ],
})
