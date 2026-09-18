import type { Field } from 'payload'
import { contentFieldAccess, decisionFieldAccess, isSuperAdmin } from '@/access'

export const APPROVAL_STATUSES = {
  draft: 'draft',
  inReview: 'in_review',
  approved: 'approved',
  rejected: 'rejected',
} as const

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[keyof typeof APPROVAL_STATUSES]

/**
 * The Draft -> Submit -> Approve or Reject workflow from intent/03-cms.md.
 *
 * Every change by an HR, News or Marketing Admin passes through it. Super
 * Admin changes skip it and publish directly. Rejection requires a reason.
 */
export const approvalFields: Field[] = [
  {
    name: 'approvalStatus',
    type: 'select',
    required: true,
    defaultValue: APPROVAL_STATUSES.draft,
    options: [
      { label: 'Draft', value: APPROVAL_STATUSES.draft },
      { label: 'In Review', value: APPROVAL_STATUSES.inReview },
      { label: 'Approved', value: APPROVAL_STATUSES.approved },
      { label: 'Rejected', value: APPROVAL_STATUSES.rejected },
    ],
    admin: {
      position: 'sidebar',
      description:
        'Editors submit for review. Only the Approver approves or rejects.',
    },
    index: true,
  },
  {
    name: 'rejectionReason',
    type: 'textarea',
    access: { update: decisionFieldAccess },
    admin: {
      position: 'sidebar',
      description: 'Required when rejecting. The editor sees this.',
      condition: (data) => data?.approvalStatus === APPROVAL_STATUSES.rejected,
    },
  },
  {
    name: 'submittedBy',
    type: 'relationship',
    relationTo: 'users',
    access: { update: () => false },
    admin: { position: 'sidebar', readOnly: true },
  },
  {
    name: 'submittedAt',
    type: 'date',
    access: { update: () => false },
    admin: { position: 'sidebar', readOnly: true },
  },
  {
    name: 'reviewedBy',
    type: 'relationship',
    relationTo: 'users',
    access: { update: () => false },
    admin: { position: 'sidebar', readOnly: true },
  },
  {
    name: 'reviewedAt',
    type: 'date',
    access: { update: () => false },
    admin: { position: 'sidebar', readOnly: true },
  },
]

/** Applied to editable content fields so the Approver cannot rewrite them. */
export const lockedForApprover = { update: contentFieldAccess }

export const publishedAtField: Field = {
  name: 'publishedAt',
  type: 'date',
  admin: { position: 'sidebar', readOnly: true },
}

export const isSuperAdminUser = isSuperAdmin
