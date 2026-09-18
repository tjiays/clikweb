import { APIError } from 'payload'
import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook } from 'payload'
import { APPROVAL_STATUSES } from '@/fields/approval'
import { isApprover, isSuperAdmin } from '@/access'

/**
 * Enforces the approval rules that the admin UI alone cannot guarantee,
 * because the REST and GraphQL APIs reach the same data.
 *
 *  - Super Admin publishes directly.
 *  - Editors may only move an item to Draft or In Review.
 *  - Only the Approver may approve or reject, and only from In Review.
 *  - Rejecting requires a reason.
 *  - An item In Review is locked: its editor cannot change it.
 */
export const enforceApprovalRules: CollectionBeforeValidateHook = async ({
  data,
  req,
  originalDoc,
  operation,
}) => {
  const user = req.user
  if (!user || !data) return data

  const next = data.approvalStatus as string | undefined
  const previous = originalDoc?.approvalStatus as string | undefined

  if (isSuperAdmin(user)) {
    // Super Admin skips the workflow entirely.
    if (operation === 'create' && !next) data.approvalStatus = APPROVAL_STATUSES.approved
    return data
  }

  if (isApprover(user)) {
    const allowed: string[] = [APPROVAL_STATUSES.approved, APPROVAL_STATUSES.rejected]
    if (!next || !allowed.includes(next)) {
      throw new APIError('The Approver can only approve or reject an item.', 403)
    }
    if (previous !== APPROVAL_STATUSES.inReview) {
      throw new APIError(
        'Only an item that has been submitted for review can be decided on.',
        400,
      )
    }
    if (next === APPROVAL_STATUSES.rejected && !String(data.rejectionReason || '').trim()) {
      throw new APIError('A rejection must include a reason.', 400)
    }
    data.reviewedBy = user.id
    data.reviewedAt = new Date().toISOString()
    return data
  }

  // Editors from here on.
  if (previous === APPROVAL_STATUSES.inReview) {
    throw new APIError('This item is locked while it is in review.', 423)
  }

  const editorAllowed: string[] = [APPROVAL_STATUSES.draft, APPROVAL_STATUSES.inReview]
  if (next && !editorAllowed.includes(next)) {
    throw new APIError(
      'Only the Approver can approve or reject. Submit it for review instead.',
      403,
    )
  }

  if (next === APPROVAL_STATUSES.inReview && previous !== APPROVAL_STATUSES.inReview) {
    data.submittedBy = user.id
    data.submittedAt = new Date().toISOString()
    data.rejectionReason = null
  }

  return data
}

/** Keeps Payload's own draft/published state in step with the approval state. */
export const syncPublishState: CollectionBeforeChangeHook = async ({ data }) => {
  if (!data) return data
  if (data.approvalStatus === APPROVAL_STATUSES.approved) {
    data._status = 'published'
    if (!data.publishedAt) data.publishedAt = new Date().toISOString()
  } else {
    data._status = 'draft'
  }
  return data
}

/** The same rules, for globals, whose hook signatures differ slightly. */
export const enforceApprovalRulesGlobal = async ({
  data,
  req,
  originalDoc,
}: {
  data: Record<string, unknown>
  req: { user?: { id: string | number; role?: string } | null }
  originalDoc?: Record<string, unknown>
}) => {
  return enforceApprovalRules({
    data,
    req,
    originalDoc,
    operation: 'update',
  } as never)
}

export const syncPublishStateGlobal = async ({ data }: { data: Record<string, unknown> }) => {
  if (!data) return data
  if (data.approvalStatus === APPROVAL_STATUSES.approved) {
    data._status = 'published'
  } else {
    data._status = 'draft'
  }
  return data
}
