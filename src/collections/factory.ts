import type { CollectionConfig, Field } from 'payload'
import {
  moduleEditor,
  moduleEditorOrApprover,
  moduleReader,
  isSuperAdmin,
  isApprover,
  type Role,
} from '@/access'
import { approvalFields, publishedAtField } from '@/fields/approval'
import { enforceApprovalRules, syncPublishState } from '@/hooks/approval'
import { recordAudit, recordDeletion } from '@/hooks/audit'
import { autoTranslateField } from '@/fields/autoTranslate'
import { isSampleField } from '@/fields/common'

type Options = {
  slug: string
  labels: { singular: string; plural: string }
  group: string
  /** Editor roles that own this module. */
  owners: Role[]
  useAsTitle?: string
  defaultColumns?: string[]
  fields: Field[]
  /** Set false for reference data that does not need reviewing. */
  approval?: boolean
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
}: Options): CollectionConfig => ({
  slug,
  labels,
  admin: {
    group,
    useAsTitle,
    defaultColumns: defaultColumns ?? [useAsTitle, 'approvalStatus', 'updatedAt'],
  },
  access: {
    // The public website reads published documents; everyone else must sign in.
    read: ({ req: { user } }) => {
      if (!user) return { _status: { equals: 'published' } }
      if (isSuperAdmin(user) || isApprover(user)) return true
      return moduleReader(...owners)({ req: { user } } as never)
    },
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
    ? [...fields, isSampleField, autoTranslateField, ...approvalFields, publishedAtField]
    : [...fields, isSampleField],
  timestamps: true,
})
