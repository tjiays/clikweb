import { APIError } from 'payload'
import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook } from 'payload'
import { APPROVAL_STATUSES } from '@/fields/approval'
import { isApprover, isSuperAdmin } from '@/access'

/**
 * Enforces the approval rules that the admin UI alone cannot guarantee,
 * because the REST and GraphQL APIs reach the same data.
 *
 *  - Super Admin may set any status, including approving as they save.
 *  - An editor's save always submits for review; they have no other option.
 *  - Only the Approver may approve or reject, and only from In Review.
 *  - Rejecting requires a reason.
 *  - An item In Review is locked: its editor cannot change it.
 */
export const enforceApprovalRules: CollectionBeforeValidateHook = async ({
  data,
  req,
  originalDoc,
  operation,
  collection,
}) => {
  const user = req.user
  if (!user || !data) return data

  const next = data.approvalStatus as string | undefined
  const previous = originalDoc?.approvalStatus as string | undefined

  if (isSuperAdmin(user)) {
    // Super Admin is trusted with any status, including approving in the
    // same save that creates the item. Without a choice they get the field
    // default, In Review, like everybody else.
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

  /*
   * Editors from here on. They no longer choose a status — the field is not
   * on their form — so saving is the act of submitting, and anything they
   * save goes to In Review.
   */
  const target = next ?? APPROVAL_STATUSES.inReview

  /*
   * An item in review is still off limits to everyone else, so the approver
   * is not reading a moving target. The exception is the person who
   * submitted it: without it, a single save would lock an editor out of
   * their own half-finished article until someone else acted on it.
   */
  if (previous === APPROVAL_STATUSES.inReview) {
    const submitter = originalDoc?.submittedBy
    const submitterId = typeof submitter === 'object' && submitter
      ? (submitter as { id?: unknown }).id
      : submitter
    if (String(submitterId ?? '') !== String(user.id)) {
      throw new APIError('This item is locked while it is in review.', 423)
    }
  }

  if (target !== APPROVAL_STATUSES.inReview) {
    throw new APIError(
      'Only the Approver can approve or reject. Submit it for review instead.',
      403,
    )
  }

  /*
   * Nothing untitled reaches the review queue, and "titled" means titled in
   * Indonesian.
   *
   * Two things conspired here. An item awaiting review is stored as a Payload
   * draft, and Payload skips required-field checks on drafts, so "title is
   * required" never ran. And a title is per-language: a report written while
   * the admin was switched to English got an English title and no Indonesian
   * one, so it reached the Approver as a blank row and opened blank too,
   * because the admin lists and reads the default language.
   *
   * Indonesian is the source language (intent/04), so that is the one that
   * has to be there. Writing English first is still fine — it just cannot be
   * submitted until the Indonesian side has a title.
   */
  if (target === APPROVAL_STATUSES.inReview) {
    const filled = (value: unknown) => String(value ?? '').trim().length > 0
    const locale = (req as { locale?: string }).locale
    let hasTitle = false

    if (!locale || locale === 'id') {
      hasTitle = filled(data.title ?? originalDoc?.title)
    } else if (originalDoc?.id && req.payload && collection?.slug) {
      // Writing another language: look up what Indonesian actually holds.
      const existing = await req.payload.findByID({
        collection: collection.slug as never,
        id: originalDoc.id as never,
        locale: 'id',
        depth: 0,
        overrideAccess: true,
        draft: true,
        req,
      })
      hasTitle = filled((existing as { title?: unknown })?.title)
    }

    if (!hasTitle) {
      throw new APIError(
        'Beri judul Bahasa Indonesia lebih dulu. Tanpa judul dalam bahasa utama, item ini tampil kosong di daftar dan tidak bisa ditinjau.',
        400,
      )
    }
  }

  data.approvalStatus = target

  if (target === APPROVAL_STATUSES.inReview && previous !== APPROVAL_STATUSES.inReview) {
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
