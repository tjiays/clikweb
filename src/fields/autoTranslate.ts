import type { Field } from 'payload'

/** Sidebar action that drafts the English version from the Indonesian one. */
export const autoTranslateField: Field = {
  name: 'autoTranslate',
  type: 'ui',
  admin: {
    position: 'sidebar',
    components: {
      Field: '@/components/admin/AutoTranslateButton#default',
    },
  },
}
