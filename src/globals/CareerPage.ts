import type { GlobalConfig } from 'payload'
import { moduleEditor, MODULE_OWNERS } from '@/access'
import { approvalFields } from '@/fields/approval'
import { autoTranslateField } from '@/fields/autoTranslate'
import { enforceApprovalRulesGlobal, syncPublishStateGlobal } from '@/hooks/approval'
import { imageField, localisedText, localisedTextarea } from '@/fields/common'

/** Everything on the Karir page except the job list (HR Admin). */
export const CareerPage: GlobalConfig = {
  slug: 'career-page',
  label: 'Konten Halaman Karir',
  admin: { group: 'Karir' },
  access: { read: () => true, update: moduleEditor(...MODULE_OWNERS.karir) },
  versions: { drafts: true, max: 25 },
  hooks: {
    beforeValidate: [enforceApprovalRulesGlobal as never],
    beforeChange: [syncPublishStateGlobal as never],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Hero & Banner',
      fields: [
        localisedText('heroTitle', 'Judul'),
        localisedTextarea('heroSubtitle', 'Sub-judul'),
        {
          name: 'heroImages',
          type: 'array',
          label: 'Gambar carousel',
          fields: [imageField('image', 'Gambar', true)],
        },
      ],
    },
    {
      name: 'values',
      type: 'array',
      label: 'Nilai-Nilai Kami',
      fields: [
        localisedText('title', 'Judul', true),
        localisedText('subtitle', 'Sub-judul'),
        localisedTextarea('description', 'Deskripsi'),
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Benefits',
      fields: [imageField('icon', 'Ikon'), localisedText('title', 'Judul', true)],
    },
    {
      name: 'recruitmentSteps',
      type: 'array',
      label: 'Proses Rekrutmen',
      fields: [
        localisedText('title', 'Judul', true),
        localisedTextarea('description', 'Deskripsi'),
      ],
    },
    localisedTextarea('cvNote', 'Catatan kirim CV'),
    autoTranslateField,
    ...approvalFields,
  ],
}
