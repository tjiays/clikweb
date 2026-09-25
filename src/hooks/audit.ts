import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { APPROVAL_STATUSES } from '@/fields/approval'

const titleOf = (doc: Record<string, unknown>): string => {
  /*
   * Whatever names the record to a person reading the log. Reports and news
   * carry a title, jobs and products a name, a user their name, an enquiry
   * the sender's address, an upload its filename. Falling through to the id
   * is better than an empty column.
   */
  const candidate =
    doc?.title ?? doc?.titleId ?? doc?.name ?? doc?.nameId ?? doc?.email ?? doc?.filename ?? doc?.id
  if (candidate && typeof candidate === 'object') {
    // Localised fields arrive as { id: '...', en: '...' }
    const values = Object.values(candidate as Record<string, unknown>)
    return String(values.find(Boolean) ?? '')
  }
  return String(candidate ?? '')
}

/*
 * Never written to the log. Secrets for the obvious reason; the auth
 * bookkeeping and the timestamps because Payload rewrites them on its own and
 * they would report a change nobody made.
 */
const NEVER_LOG = new Set([
  'password',
  'hash',
  'salt',
  '_verificationToken',
  'resetPasswordToken',
  'resetPasswordExpiration',
  'loginAttempts',
  'lockUntil',
  'updatedAt',
  'createdAt',
  'sizes',
])

const same = (a: unknown, b: unknown) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return a === b
  }
}

/**
 * What actually changed, in words, without ever printing a value that might be
 * a secret. A status move is worth spelling out because it is the whole point
 * of the record; everything else is named but not quoted.
 *
 * Returns undefined when nothing worth logging changed — which is how a save
 * that only touched Payload's own bookkeeping stays out of the log.
 */
const describeChange = (
  doc: Record<string, unknown>,
  previousDoc: Record<string, unknown> | undefined,
): string | undefined => {
  if (!previousDoc || Object.keys(previousDoc).length === 0) return undefined

  const changed = Object.keys(doc).filter(
    (key) => !NEVER_LOG.has(key) && !same(doc[key], previousDoc[key]),
  )
  if (changed.length === 0) return undefined

  const isStatus = (key: string) => /status$/i.test(key)
  const moves = changed
    .filter(isStatus)
    .map((key) => `${key}: ${String(previousDoc[key] ?? '-')} -> ${String(doc[key] ?? '-')}`)
  const rest = changed.filter((key) => !isStatus(key))

  return [...moves, rest.length ? `changed: ${rest.join(', ')}` : '']
    .filter(Boolean)
    .join('; ')
}

/**
 * Records every create and update: approvals, rejections and submissions by
 * their own name, everything else as a plain create or update with a note of
 * which fields moved.
 */
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

    const summary = describeChange(doc, previousDoc)

    /*
     * A save that changed nothing a person did is not an activity. Payload
     * rewrites login counters and timestamps by itself, and logging those
     * would bury the real entries under one row per sign-in.
     */
    if (action === 'update' && !summary) return doc

    await req.payload.create({
      collection: 'audit-log',
      data: {
        action,
        collectionSlug: collection.slug,
        documentId: String(doc?.id ?? ''),
        documentTitle: titleOf(doc),
        user: req.user?.id,
        userEmail: req.user?.email,
        /*
         * A rejection's reason is the point of the entry, so it wins. An
         * anonymous create is the public contact form: worth saying, because
         * an empty user column otherwise looks like a bug.
         */
        detail:
          action === 'reject'
            ? String(doc?.rejectionReason ?? '')
            : operation === 'create' && !req.user
              ? 'Dikirim dari formulir publik'
              : summary,
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
