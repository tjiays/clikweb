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

/**
 * Laporan — managed by News Admin (confirmed decision 15).
 *
 * Laid out like Articles: one writing tab holding the title, the summary and
 * the editor, with everything else behind the other tabs or in the sidebar.
 */
export const Reports: CollectionConfig = contentCollection({
  slug: 'reports',
  labels: { singular: 'Laporan', plural: 'Laporan' },
  group: 'Report',
  owners: MODULE_OWNERS.laporan,
  preview: { id: '/laporan', en: '/en/reports' },
  defaultColumns: ['title', 'type', 'year', 'approvalStatus'],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tulisan',
          description: 'Tulis laporan di sini. Gambar, tabel dan perataan ada di toolbar editor.',
          fields: [
            localisedText('title', 'Judul', true),
            {
              ...localisedTextarea('excerpt', 'Ringkasan'),
              admin: { description: 'Satu atau dua kalimat. Muncul di kartu laporan.' },
            } as Field,
            {
              ...richText('body', 'Isi laporan', true),
              admin: {
                description:
                  'Toolbar di atas editor: judul bagian, tebal/miring, daftar, tautan, perataan, gambar dan tabel.',
              },
            } as Field,
          ],
        },
        {
          /*
           * These rows predate the editor's own table button. The two reports
           * that use them still render from here, so the field stays; new
           * financial statements are better built in the editor, where the
           * text around them lives.
           */
          label: 'Tabel keuangan (cara lama)',
          description:
            'Dipakai oleh laporan yang sudah ada. Untuk laporan baru, buat tabel langsung di editor pada tab Tulisan.',
          fields: [
            {
              name: 'financialTables',
              type: 'array',
              label: 'Tabel keuangan',
              access: lockedForApprover,
              labels: { singular: 'Tabel', plural: 'Tabel' },
              fields: [
                {
                  ...localisedTextarea('intro', 'Teks di atas tabel (rata kiri)'),
                  admin: {
                    description:
                      'e.g. "Laporan Keuangan Posisi Keuangan 31 Desember 2025 (terlampir)".',
                  },
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
          ],
        },
        {
          label: 'Pengaturan',
          fields: [imageField('cover', 'Gambar sampul')],
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      label: 'Jenis laporan',
      required: true,
      defaultValue: 'annual_report',
      access: lockedForApprover,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Laporan Tahunan', value: 'annual_report' },
        { label: 'Laporan Perkembangan Usaha', value: 'business_development' },
      ],
    },
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
      admin: {
        position: 'sidebar',
        description: 'Shown on the report card, left of the date.',
      },
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
