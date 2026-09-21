import type { CollectionConfig, Field } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import {
  imageField,
  localisedText,
  localisedTextarea,
  richText,
  slugField,
  sortOrderField,
} from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'

/** Laporan — managed by News Admin (confirmed decision 15). */
export const Reports: CollectionConfig = contentCollection({
  slug: 'reports',
  labels: { singular: 'Laporan', plural: 'Laporan' },
  group: 'Report',
  owners: MODULE_OWNERS.laporan,
  preview: { id: '/laporan', en: '/en/reports' },
  defaultColumns: ['title', 'type', 'year', 'approvalStatus'],
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'annual_report',
      access: lockedForApprover,
      options: [
        { label: 'Laporan Tahunan', value: 'annual_report' },
        { label: 'Laporan Perkembangan Usaha', value: 'business_development' },
      ],
    },
    localisedText('title', 'Judul', true),
    slugField(),
    {
      name: 'year',
      type: 'number',
      required: true,
      access: lockedForApprover,
      admin: { position: 'sidebar' },
    },
    {
      // A name rather than a relationship, as on Newsroom articles.
      name: 'author',
      type: 'text',
      label: 'Penulis',
      access: lockedForApprover,
      admin: { description: 'Shown on the report card, left of the date.' },
    },
    localisedTextarea('excerpt', 'Ringkasan'),
    imageField('cover', 'Gambar sampul'),
    richText('body', 'Isi laporan', true),
    {
      /*
       * Financial statements under the body (Figma 709:3673: "Posisi
       * Keuangan" and "Laporan Laba Rugi"). Kept as rows rather than rich
       * text so figures stay aligned and editors cannot break the table.
       */
      name: 'financialTables',
      type: 'array',
      label: 'Tabel keuangan',
      access: lockedForApprover,
      labels: { singular: 'Tabel', plural: 'Tabel' },
      fields: [
        {
          ...localisedTextarea('intro', 'Teks di atas tabel (rata kiri)'),
          admin: { description: 'e.g. "Laporan Keuangan Posisi Keuangan 31 Desember 2025 (terlampir)".' },
        } as Field,
        {
          ...localisedText('title', 'Judul tabel (tengah, tebal)'),
          admin: { description: 'e.g. "LAPORAN LABA RUGI". Leave empty for none.' },
        } as Field,
        localisedText('caption', 'Keterangan di bawah judul (tengah)'),
        {
          name: 'rows',
          type: 'array',
          label: 'Baris',
          access: lockedForApprover,
          fields: [
            localisedText('label', 'Pos', true),
            { name: 'value', type: 'text', label: 'Nilai (Rp)', access: lockedForApprover },
            {
              name: 'emphasis',
              type: 'select',
              label: 'Tebal',
              defaultValue: 'none',
              access: lockedForApprover,
              options: [
                { label: 'Tidak', value: 'none' },
                { label: 'Pos saja', value: 'label' },
                { label: 'Pos dan nilai', value: 'row' },
              ],
            },
            {
              name: 'gapBefore',
              type: 'checkbox',
              label: 'Beri jarak sebelum baris ini',
              defaultValue: false,
              access: lockedForApprover,
            },
          ],
        },
      ],
    },
    {
      name: 'publishDate',
      type: 'date',
      access: lockedForApprover,
      admin: { position: 'sidebar' },
    },
    sortOrderField,
  ],
})
