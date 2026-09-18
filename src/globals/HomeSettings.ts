import type { GlobalConfig } from 'payload'
import { moduleEditor, MODULE_OWNERS } from '@/access'
import { approvalFields } from '@/fields/approval'
import { autoTranslateField } from '@/fields/autoTranslate'
import { enforceApprovalRulesGlobal, syncPublishStateGlobal } from '@/hooks/approval'
import { localisedText, localisedTextarea } from '@/fields/common'

/** Section titles and intro copy on the homepage (Marketing Admin). */
export const HomeSettings: GlobalConfig = {
  slug: 'home-settings',
  label: 'Homepage',
  admin: { group: 'Konten Website' },
  access: { read: () => true, update: moduleEditor(...MODULE_OWNERS.marketing) },
  versions: { drafts: true, max: 25 },
  hooks: {
    beforeValidate: [enforceApprovalRulesGlobal as never],
    beforeChange: [syncPublishStateGlobal as never],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Tentang Kami snippet',
      fields: [
        localisedText('aboutTitle', 'Judul'),
        localisedTextarea('aboutText', 'Paragraf'),
      ],
    },
    localisedTextarea('trustBarText', 'Teks trust bar'),
    {
      type: 'collapsible',
      label: 'Section headings',
      fields: [
        localisedText('solutionsTitle', 'Judul bagian Solusi'),
        localisedTextarea('solutionsSubtitle', 'Sub-judul bagian Solusi'),
        localisedText('testimonialsTitle', 'Judul bagian Testimoni'),
        localisedTextarea('testimonialsSubtitle', 'Sub-judul bagian Testimoni'),
        localisedText('newsTitle', 'Judul bagian Berita'),
        localisedTextarea('newsSubtitle', 'Sub-judul bagian Berita'),
      ],
    },
    autoTranslateField,
    ...approvalFields,
  ],
}
