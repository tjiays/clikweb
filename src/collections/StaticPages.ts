import type { CollectionConfig } from 'payload'
import { contentCollection } from './factory'
import { localisedText, richText } from '@/fields/common'

/**
 * Policy and how-to pages. Per open item O7 these are assumed to be Super
 * Admin only until the product owner says who else should edit them, so no
 * editor role owns this module and the approval workflow does not apply.
 */
export const StaticPages: CollectionConfig = contentCollection({
  slug: 'static-pages',
  labels: { singular: 'Halaman Statis', plural: 'Halaman Statis' },
  group: 'Konten Website',
  owners: [],
  approval: false,
  defaultColumns: ['key', 'title', 'lastUpdatedDate'],
  useAsTitle: 'key',
  fields: [
    {
      name: 'key',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Kebijakan Keamanan Informasi', value: 'information_security_policy' },
        { label: 'Kebijakan Privasi', value: 'privacy_policy' },
        { label: 'Cara mendapat laporan kredit', value: 'how_to_get_credit_report' },
        { label: 'Penyelesaian Pengaduan', value: 'complaint_resolution' },
      ],
    },
    localisedText('title', 'Judul halaman', true),
    richText('body', 'Isi halaman', true),
    {
      name: 'lastUpdatedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Shown as "Terakhir Diperbarui" on the Privacy page.',
      },
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Lampiran',
      admin: { description: 'For example the Formulir Permintaan Data.' },
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
        localisedText('label', 'Nama tautan'),
      ],
    },
  ],
})
