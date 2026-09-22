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
  imageGuidance,
  authorField,
  publishDateField,
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
  useAsTitle: 'titleId',
  defaultColumns: ['titleId', 'type', 'publishDate', 'approvalStatus'],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tulisan',
          description:
            'Kedua bahasa ada di halaman ini. Judul dan isi wajib diisi keduanya — laporan tidak bisa disetujui bila salah satu kosong.',
          fields: [
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
                  admin: { width: '50%', description: 'Satu atau dua kalimat, tampil di kartu laporan.' },
                },
                {
                  name: 'excerptEn',
                  type: 'textarea',
                  label: 'Summary (English)',
                  access: lockedForApprover,
                  admin: { width: '50%', description: 'One or two sentences, shown on the report card.' },
                },
              ],
            },
            {
              name: 'bodyId',
              type: 'richText',
              label: 'Isi laporan (Bahasa Indonesia)',
              required: true,
              access: lockedForApprover,
              admin: {
                description:
                  'Toolbar di atas editor: judul bagian, daftar, tautan, perataan, gambar dan tabel.',
              },
            },
            {
              name: 'bodyEn',
              type: 'richText',
              label: 'Report body (English)',
              required: true,
              access: lockedForApprover,
              admin: {
                description: 'The same report in English. Use Auto-translate to draft it, then edit.',
              },
            },
          ],
        },
        {
          label: 'Pengaturan',
          fields: [
            {
              ...imageField('cover', 'Gambar sampul'),
              admin: {
                description: `Tampil di kartu laporan dan di atas halaman Laporan Tahunan. ${imageGuidance(1300, '2000x1333px seperti sampul Laporan Tahunan 2025')}`,
              },
            } as Field,
          ],
        },
      ],
    },
    {
      /*
       * Superseded by tables written in the editor
       * (migration 20260921_095500_report_tables_into_body). Kept, hidden,
       * so the rows are still there if that migration is ever rolled back:
       * ReportsPage falls back to them whenever a report's body has no table
       * of its own. Nothing writes to it any more.
       */
      name: 'financialTables',
      type: 'array',
      label: 'Tabel keuangan (lama)',
      access: lockedForApprover,
      admin: { hidden: true },
      fields: [
        localisedTextarea('intro', 'Teks di atas tabel'),
        localisedText('title', 'Judul tabel'),
        localisedText('caption', 'Keterangan'),
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
    slugField('titleId', false),
    // A name rather than a relationship, as on Newsroom articles.
    authorField('Penulis', null),
    // Date only: reports are ordered by rank, so the clock added nothing.
    publishDateField(false, null, { withTime: false }),
    sortOrderField,
  ],
})
