import type { CollectionConfig } from 'payload'
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
  labels: { singular: 'Laporan', plural: 'Daftar Laporan' },
  group: 'Laporan',
  owners: MODULE_OWNERS.laporan,
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
    localisedTextarea('excerpt', 'Ringkasan'),
    imageField('cover', 'Gambar sampul'),
    richText('body', 'Isi laporan', true),
    {
      name: 'publishDate',
      type: 'date',
      access: lockedForApprover,
      admin: { position: 'sidebar' },
    },
    sortOrderField,
  ],
})
