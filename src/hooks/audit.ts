import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { APPROVAL_STATUSES } from '@/fields/approval'

const titleOf = (doc: Record<string, unknown>): string => {
  const candidate = doc?.title ?? doc?.name ?? doc?.id
  if (candidate && typeof candidate === 'object') {
    // Localised fields arrive as { id: '...', en: '...' }
    const values = Object.values(candidate as Record<string, unknown>)
    return String(values.find(Boolean) ?? '')
  }
  return String(candidate ?? '')
}

/** Records approvals, rejections, submissions and publishes. */
export const recordAudit: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  collection,
  operation,
}) => {
  try {
    const before = previousDoc?.approvalStatus
    const after = doc?.approvalStatus

    let action = operation === 'create' ? 'create' : 'update'
    if (before !== after) {
      if (after === APPROVAL_STATUSES.inReview) action = 'submit'
      else if (after === APPROVAL_STATUSES.approved) action = 'approve'
      else if (after === APPROVAL_STATUSES.rejected) action = 'reject'
    }

    await req.payload.create({
      collection: 'audit-log',
      data: {
        action,
        collectionSlug: collection.slug,
        documentId: String(doc?.id ?? ''),
        documentTitle: titleOf(doc),
        user: req.user?.id,
        userEmail: req.user?.email,
        detail:
          action === 'reject' ? String(doc?.rejectionReason ?? '') : undefined,
      },
      overrideAccess: true,
    })
  } catch (error) {
    // An audit failure must never block the editor's actual change.
    req.payload.logger.error({ err: error }, 'Failed to write audit log entry')
  }
  return doc
}

export const recordDeletion: CollectionAfterDeleteHook = async ({ doc, req, collection }) => {
  try {
    await req.payload.create({
      collection: 'audit-log',
      data: {
        action: 'delete',
        collectionSlug: collection.slug,
        documentId: String(doc?.id ?? ''),
        documentTitle: titleOf(doc),
        user: req.user?.id,
        userEmail: req.user?.email,
      },
      overrideAccess: true,
    })
  } catch (error) {
    req.payload.logger.error({ err: error }, 'Failed to write audit log entry')
  }
  return doc
}
