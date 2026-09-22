import type { Field } from 'payload'
import { contentFieldAccess, decisionFieldAccess, isSuperAdmin } from '@/access'

export const APPROVAL_STATUSES = {
  inReview: 'in_review',
  approved: 'approved',
  rejected: 'rejected',
} as const

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[keyof typeof APPROVAL_STATUSES]

/**
 * The Submit -> Approve or Reject workflow.
 *
 * There is no Draft. Saving is what submits an item, so nothing ever sat in
 * Draft except by accident — and an item in Draft could not be approved,
 * because the Approver may only decide on something in review, so it was a
 * dead end as well as a dead state. Work in progress is simply an item in
 * review that nobody has decided on yet, and its author can keep editing it.
 *
 * Adapted from intent/03-cms.md.
 *
 * Every change by an HR, News or Marketing Admin passes through it. Super
 * Admin changes skip it and publish directly. Rejection requires a reason.
 */
const decides = (user: unknown) =>
  ['approver', 'super_admin'].includes(
    String((user as { role?: string } | null | undefined)?.role ?? ''),
  )

export const approvalFields: Field[] = [
  {
    // Which language still needs work, since only one is on screen at a time.
    name: 'languageStatus',
    type: 'ui',
    admin: {
      position: 'sidebar',
      components: {
        Field: '@/components/admin/LanguageStatus#default',
      },
    },
  },
  {
    // What an editor sees instead of the select: the same answer, no control.
    name: 'approvalStatusDisplay',
    type: 'ui',
    admin: {
      position: 'sidebar',
      condition: (_data, _siblingData, { user }) => !decides(user),
      components: {
        Field: '@/components/admin/ApprovalStatusBadge#default',
      },
    },
  },
  {
    name: 'approvalStatus',
    type: 'select',
    required: true,
    defaultValue: APPROVAL_STATUSES.inReview,
    options: [
      { label: 'In Review', value: APPROVAL_STATUSES.inReview },
      { label: 'Approved', value: APPROVAL_STATUSES.approved },
      { label: 'Rejected', value: APPROVAL_STATUSES.rejected },
    ],
    admin: {
      position: 'sidebar',
      /*
       * Only the people who decide see the control. An editor has no choice
       * to make — saving submits the item for review — so the box was three
       * options they could not pick and one they could. They still see where
       * an item stands in the list column, and a rejection reason still
       * appears on the form.
       *
       * The role is read off the user rather than through @/access because
       * this function is serialised to the browser.
       */
      condition: (_data, _siblingData, { user }) => decides(user),
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
