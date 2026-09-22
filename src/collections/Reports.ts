import type { CollectionConfig, Field } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import {
  imageField,
  localisedText,
  localisedTextarea,
  slugField,
  sortOrderField,
  imageGuidance,
  imageRule,
  IMAGE_RULES,
  authorField,
  publishDateField,
} from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'
import { bothLanguages } from '@/i18n/admin'

/**
 * Laporan — managed by News Admin (confirmed decision 15).
 *
 * Laid out like Articles: one writing tab holding the title, the summary and
 * the editor, with everything else behind the other tabs or in the sidebar.
 */
export const Reports: CollectionConfig = contentCollection({
  slug: 'reports',
  labels: { singular: bothLanguages('reports'), plural: bothLanguages('reports') },
  group: 'Report',
  owners: MODULE_OWNERS.laporan,
  preview: { id: '/laporan', en: '/en/reports' },
  useAsTitle: 'titleId',
  defaultColumns: ['titleId', 'type', 'publishDate', 'approvalStatus'],
  fields: [
    /*
     * One page, no tabs — the cover first, then the writing. It was split
     * across Tulisan and Pengaturan, which meant the picture lived on a tab
     * nobody opened while writing, and a report could be finished without
     * anyone noticing it had none.
     */
    {
      ...imageField('cover', 'Gambar sampul'),
      /*
       * Only the Annual Report draws a 1300px hero; a Business Development
       * report shows its cover on the 416px card and nothing wider, so it is
       * held to the card's requirement instead.
       */
      validate: imageRule((data) =>
        (data as { type?: string })?.type === 'business_development'
          ? IMAGE_RULES.reportCoverBusiness
          : IMAGE_RULES.reportCoverAnnual,
      ),
      admin: {
        description:
          imageGuidance(
            IMAGE_RULES.reportCoverAnnual,
            'Tampil di kartu laporan, dan sebagai gambar besar di atas halaman Laporan Tahunan.',
          ) +
          ` Untuk Laporan Perkembangan Usaha yang hanya tampil di kartu, minimal ${IMAGE_RULES.reportCoverBusiness.minWidth}px sudah cukup.`,
      },
    } as Field,
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
