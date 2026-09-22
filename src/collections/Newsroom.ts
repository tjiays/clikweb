import type { CollectionConfig, Field } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import {
  imageField,
  richText,
  slugField,
  imageGuidance,
  imageAtLeast,
  authorField,
  publishDateField,
} from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'

/**
 * Articles are the only Newsroom collection left in the CMS.
 *
 * Authors became a plain text byline, and the media outlets and their
 * coverage moved into src/content/newsroom.ts — they are a fixed list that
 * changes rarely, and each one was costing a menu item.
 *
 * The form is two tabs. "Tulisan" is only the title, the summary and the
 * editor, so writing an article is one surface rather than a column of
 * unrelated boxes; everything an article needs but nobody writes into —
 * images, related links, SEO — sits in "Pengaturan", and the short
 * publishing switches stay in the sidebar.
 */
export const Articles: CollectionConfig = contentCollection({
  slug: 'articles',
  labels: { singular: 'News', plural: 'News' },
  group: 'Newsroom',
  owners: MODULE_OWNERS.newsroom,
  preview: { id: '/newsroom', en: '/en/newsroom' },
  useAsTitle: 'titleId',
  defaultColumns: ['titleId', 'author', 'publishDate', 'isFeatured', 'approvalStatus'],
  fields: [
    /*
     * One page, both languages, as on Laporan. The pictures lead — they were
     * on a Pengaturan tab nobody opened while writing — then the writing,
     * then the things you set once and forget.
     */
    {
      ...imageField('cover', 'Gambar sampul'),
      validate: imageAtLeast(800),
      admin: {
        description: `Tampil di kartu artikel. ${imageGuidance(800, '1200x800px')}`,
      },
    } as Field,
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar banner (halaman detail)',
      access: lockedForApprover,
      validate: imageAtLeast(1300),
      admin: {
        description: `Opsional. Gambar lebar di atas halaman artikel (1300x372). Kosongkan untuk memakai Gambar sampul. ${imageGuidance(1300, '2600x744px')}`,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'titleId',
          type: 'text',
          label: 'Judul (Bahasa Indonesia)',
          required: true,
          access: lockedForApprover,
          admin: { width: '50%' },
        },
        {
          name: 'titleEn',
          type: 'text',
          label: 'Title (English)',
          required: true,
          access: lockedForApprover,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'excerptId',
          type: 'textarea',
          label: 'Ringkasan (Bahasa Indonesia)',
          access: lockedForApprover,
          admin: { width: '50%', description: 'Muncul di kartu artikel, bukan di halaman artikel.' },
        },
        {
          name: 'excerptEn',
          type: 'textarea',
          label: 'Summary (English)',
          access: lockedForApprover,
          admin: { width: '50%', description: 'Shown on the article card, not on the article page.' },
        },
      ],
    },
    {
      name: 'bodyId',
      type: 'richText',
      label: 'Isi artikel (Bahasa Indonesia)',
      access: lockedForApprover,
      admin: {
        description:
          'Toolbar di atas editor: judul bagian, daftar, tautan, perataan, gambar dan tabel.',
      },
    },
    {
      name: 'bodyEn',
      type: 'richText',
      label: 'Article body (English)',
      access: lockedForApprover,
      admin: {
        description: 'The same article in English. Use Auto-translate to draft it, then edit.',
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
    {
      type: 'row',
      fields: [
        {
          name: 'seoTitleId',
          type: 'text',
          label: 'SEO judul (Bahasa Indonesia)',
          access: lockedForApprover,
          admin: { width: '50%' },
        },
        {
          name: 'seoTitleEn',
          type: 'text',
          label: 'SEO title (English)',
          access: lockedForApprover,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'seoDescriptionId',
          type: 'textarea',
          label: 'SEO deskripsi (Bahasa Indonesia)',
          access: lockedForApprover,
          admin: { width: '50%' },
        },
        {
          name: 'seoDescriptionEn',
          type: 'textarea',
          label: 'SEO description (English)',
          access: lockedForApprover,
          admin: { width: '50%' },
        },
      ],
    },
    // A name rather than a relationship: one less collection for a byline.
    authorField(),
    slugField('titleId', false),
    publishDateField(
      true,
      'Terisi otomatis dengan waktu sekarang. Menentukan urutan: yang terbaru tampil lebih dulu.',
    ),
    /*
     * Featured News and the two list controls are no longer decisions anyone
     * makes. Every article shows in both lists, newest first, so there is
     * nothing to tick — and a new piece lands at the top of each without
     * anyone remembering to promote it.
     *
     * The fields stay, hidden, rather than being dropped: they hold the
     * hand-ordering from the Figma build, and that is the only record of it
     * if this is ever reversed.
     */
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured News',
      access: lockedForApprover,
      admin: { position: 'sidebar', hidden: true },
    },
    {
      name: 'featuredPositions',
      type: 'number',
      hasMany: true,
      min: 1,
      label: 'Posisi di Featured News',
      access: lockedForApprover,
      admin: { position: 'sidebar', hidden: true },
    },
    {
      name: 'hideFromList',
      type: 'checkbox',
      label: 'Sembunyikan dari daftar',
      defaultValue: false,
      access: lockedForApprover,
      admin: { position: 'sidebar', hidden: true },
    },
  ],
})
