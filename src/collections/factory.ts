import type { CollectionConfig, Field, StaticLabel, Where } from 'payload'
import {
  moduleEditor,
  moduleEditorOrApprover,
  moduleReader,
  isSuperAdmin,
  isApprover,
  type Role,
} from '@/access'
import { approvalFields, publishedAtField, languageStatusField } from '@/fields/approval'
import { enforceApprovalRules, syncPublishState } from '@/hooks/approval'
import { recordAudit, recordDeletion } from '@/hooks/audit'
import { publicWhere } from '@/lib/schedule'
import { previewFor, livePreviewFor } from '@/lib/preview'
import { autoTranslateField } from '@/fields/autoTranslate'
import { isSampleField } from '@/fields/common'

type Options = {
  slug: string
  /** A plain string, or one per admin language: { en, id }. */
  labels: { singular: StaticLabel; plural: StaticLabel }
  group: string
  /** Editor roles that own this module. */
  owners: Role[]
  useAsTitle?: string
  defaultColumns?: string[]
  fields: Field[]
  /** Set false for reference data that does not need reviewing. */
  approval?: boolean
  /** Set false where there is nothing for Auto-translate to work on. */
  autoTranslate?: boolean
  /** Set false where both languages are short enough to see at a glance. */
  languageStatus?: boolean
  /**
   * The public path this item lives under, per language. Given one, the
   * admin shows a Preview button that opens the draft on the live site.
   */
  preview?: { id: string; en: string }
  /** For items with no page of their own: preview opens this page instead. */
  previewPath?: { id: string; en: string }
}

/**
 * Builds a content collection with the approval workflow, revision history,
 * audit logging and role-based access already wired in, so each collection
 * only has to describe its own fields.
 */
export const contentCollection = ({
  slug,
  labels,
  group,
  owners,
  useAsTitle = 'title',
  defaultColumns,
  fields,
  approval = true,
  autoTranslate = true,
  languageStatus = true,
  preview,
  previewPath,
}: Options): CollectionConfig => ({
  slug,
  labels,
  admin: {
    group,
    useAsTitle,
    // The API tab is a developer's shortcut; nobody editing content needs it.
    hideAPIURL: true,
    /*
     * The Approver reads and decides; they do not write. These replace Save
     * draft and Publish with Setujui / Tolak for that role, and leave
     * Payload's own buttons in place for everyone else. Duplicate and Delete
     * already disappear on their own, since the Approver has neither create
     * nor delete permission.
     */
    ...(approval
      ? {
          components: {
            edit: {
              PublishButton: '@/components/admin/ReviewActions#default',
              SaveDraftButton: '@/components/admin/NoSaveDraft#default',
              // Renders nothing; it just watches for a save and returns to
              // the list, so a create ends somewhere that confirms it worked.
              beforeDocumentControls: [
                '@/components/admin/BackToListOnSave#default',
                '@/components/admin/MarkCollection#default',
              ],
            },
          },
        }
      : {}),
    defaultColumns: defaultColumns ?? [useAsTitle, 'approvalStatus', 'updatedAt'],
    ...(preview
      ? { preview: previewFor(preview), livePreview: livePreviewFor(preview) }
      : {}),
    ...(previewPath
      ? {
          preview: (_doc: unknown, { locale }: { locale?: string }) => {
            const lang = locale === 'en' ? 'en' : 'id'
            const params = new URLSearchParams({ path: previewPath[lang], collection: slug })
            return `/preview?${params.toString()}`
          },
        }
      : {}),
  },
  access: {
    /*
     * Anyone not signed in — a website visitor, or anyone calling /api or
     * GraphQL directly — gets exactly what the website shows: published, and
     * not held back by a future publish date. Checking only "published" here
     * once let an approved report dated next month be read through the API
     * while the website correctly hid it.
     */
    read: ({ req: { user } }) => {
      if (!user) return publicWhere(slug) as Where
      if (isSuperAdmin(user) || isApprover(user)) return true
      return moduleReader(...owners)({ req: { user } } as never)
    },
    /*
     * Old versions and unapproved drafts: the module's own team, the
     * Approver and Super Admin. Left unset, Payload lets any signed-in user
     * read every version, so an HR Admin could read news drafts.
     */
    readVersions: moduleReader(...owners),
    create: moduleEditor(...owners),
    update: moduleEditorOrApprover(...owners),
    delete: moduleEditor(...owners),
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  hooks: approval
    ? {
        beforeValidate: [enforceApprovalRules],
        beforeChange: [syncPublishState],
        afterChange: [recordAudit],
        afterDelete: [recordDeletion],
      }
    : {
        // Reference data (authors, outlets, categories, logos, policy pages)
        // has no review step, so saving it publishes it. Without this it would
        // stay a draft for ever and never appear on the website.
        beforeChange: [
          ({ data }) => {
            if (data) data._status = 'published'
            return data
          },
        ],
        afterChange: [recordAudit],
        afterDelete: [recordDeletion],
      },
  fields: approval
    ? [
        ...fields,
        isSampleField,
        ...(autoTranslate ? [autoTranslateField] : []),
        ...(languageStatus ? [languageStatusField] : []),
        ...approvalFields,
        publishedAtField,
      ]
    : [...fields, isSampleField],
  timestamps: true,
})
