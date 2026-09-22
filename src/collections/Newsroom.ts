import type { CollectionConfig, Field } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import {
  imageField,
  localisedText,
  localisedTextarea,
  richText,
  seoFields,
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
  labels: { singular: 'Artikel', plural: 'Artikel' },
  group: 'Newsroom',
  owners: MODULE_OWNERS.newsroom,
  preview: { id: '/newsroom', en: '/en/newsroom' },
  defaultColumns: ['title', 'author', 'publishDate', 'isFeatured', 'approvalStatus'],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tulisan',
          description: 'Tulis artikel di sini. Gambar, tabel dan perataan ada di toolbar editor.',
          fields: [
            localisedText('title', 'Judul', true),
            {
              ...localisedTextarea('excerpt', 'Ringkasan'),
              admin: {
                description:
                  'Satu atau dua kalimat. Muncul di kartu artikel, bukan di halaman artikel.',
              },
            } as Field,
            {
              ...richText('body', 'Isi artikel'),
              admin: {
                description:
                  'Toolbar di atas editor: judul bagian, tebal/miring, daftar, tautan, perataan, gambar dan tabel.',
              },
            } as Field,
          ],
        },
        {
          label: 'Pengaturan',
          description: 'Gambar, artikel terkait dan SEO.',
          fields: [
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
        },
      ],
    },
    // A name rather than a relationship: one less collection for a byline.
    authorField(),
    slugField(),
    publishDateField(
      true,
      'Terisi otomatis dengan waktu sekarang. Menentukan urutan: yang terbaru tampil lebih dulu.',
    ),
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
  ],
})
