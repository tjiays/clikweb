import type { CollectionConfig } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import { imageField, localisedText, localisedTextarea, richText } from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'

/**
 * Editable copy for the pages that are mostly prose rather than lists:
 * About Us, Layanan dan Produk, Business Solution and Credit Scoring.
 *
 * Each page holds an ordered set of named sections matching the page specs in
 * intent/02-website-pages.md, so Phase 3 reads sections by key.
 */
export const PageContent: CollectionConfig = contentCollection({
  slug: 'page-content',
  labels: { singular: 'Page Content', plural: 'Page Content' },
  group: 'Konten Website',
  owners: MODULE_OWNERS.marketing,
  useAsTitle: 'page',
  defaultColumns: ['page', 'approvalStatus', 'updatedAt'],
  fields: [
    {
      name: 'page',
      type: 'select',
      required: true,
      unique: true,
      access: lockedForApprover,
      options: [
        { label: 'Tentang CLIK (About Us)', value: 'about' },
        { label: 'Layanan dan Produk', value: 'products' },
        { label: 'Business Solution', value: 'business-solution' },
        { label: 'Credit Scoring', value: 'credit-scoring' },
      ],
    },
    localisedText('title', 'Judul halaman'),
    imageField('heroImage', 'Gambar utama'),
    localisedTextarea('lead', 'Kalimat pembuka'),
    {
      name: 'sections',
      type: 'array',
      label: 'Bagian halaman',
      access: lockedForApprover,
      admin: {
        description:
          'One entry per section on the page. The key is what the page template looks for.',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          admin: { description: 'For example visi, misi, tentang-crif, cara-kerja.' },
        },
        localisedText('title', 'Judul bagian'),
        localisedTextarea('lead', 'Kalimat pembuka'),
        richText('body', 'Isi'),
        imageField('image', 'Gambar'),
      ],
    },
    {
      name: 'videoUrl',
      type: 'text',
      access: lockedForApprover,
      admin: {
        description: 'About Us only — "Kenali CLIK Lebih Dekat" embed URL.',
      },
    },
  ],
})
