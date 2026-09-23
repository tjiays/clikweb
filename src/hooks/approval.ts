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

/** Does a Lexical value actually contain anything? */
const richTextFilled = (value: unknown): boolean => {
  const children = (value as { root?: { children?: unknown[] } })?.root?.children
  if (!Array.isArray(children) || children.length === 0) return false
  // A single empty paragraph is what an untouched editor serialises to.
  return JSON.stringify(children).replace(/"text":""/g, '').includes('"text":"')
}

const textFilled = (value: unknown): boolean => String(value ?? '').trim().length > 0

/**
 * Nothing goes live half-translated.
 *
 * Checked when an item is approved rather than when it is submitted: saving
 * is what submits, so an editor cannot fill the second language before the
 * first save — demanding both at that point would make it impossible to
 * create anything at all. By approval time both have had their chance, and
 * approval is the step that actually puts the page in front of readers.
 *
 * Read with locale 'all', which returns { id, en } untouched. A normal read
 * would apply the configured fallback and hand back the Indonesian text for
 * a missing English field, so every check would pass.
 */
const assertBothLanguages = async ({
  req,
  collectionSlug,
  id,
}: {
  req: { payload?: any; locale?: string }
  collectionSlug: string
  id: unknown
}) => {
  if (!req.payload || !id) return

  const doc = await req.payload.findByID({
    collection: collectionSlug,
    id,
    locale: 'all',
    depth: 0,
    draft: true,
    overrideAccess: true,
    req,
  })

  const LANG = { id: 'Bahasa Indonesia', en: 'English' } as const
  const missing: string[] = []

  /*
   * Three shapes by now. News and reports pair a title; a product pairs a
   * name, because that is what a product has. Anything else still keeps one
   * localised field, which comes back as { id, en }.
   */
  const titleBase = doc && 'titleId' in doc ? 'title' : doc && 'nameId' in doc ? 'name' : null
  const paired = Boolean(titleBase)
  const pick = (base: string, code: string) =>
    paired
      ? doc[`${base}${code === 'en' ? 'En' : 'Id'}`]
      : (doc?.[base] as Record<string, unknown> | undefined)?.[code]

  /*
   * A body is only required in both languages if it exists in one. Four of
   * the articles are headline-and-link pieces with no body at all, and
   * insisting on one would have made them impossible to approve again — the
   * rule is about half-finished translation, not about mandating a body.
   */
  // A product's long text is its description; everything else calls it body.
  const bodyBase = doc && (paired ? 'descriptionId' in doc : 'description' in doc) ? 'description' : 'body'
  const hasBody = ['id', 'en'].some((code) => richTextFilled(pick(bodyBase, code)))

  for (const [code, name] of Object.entries(LANG)) {
    if (!textFilled(pick(titleBase ?? 'title', code))) missing.push(`judul ${name}`)
    if (hasBody && !richTextFilled(pick(bodyBase, code))) missing.push(`isi ${name}`)
  }

  if (missing.length) {
    throw new APIError(
      `Belum bisa disetujui — ${missing.join(', ')} masih kosong. ` +
        'Lengkapi kedua bahasa lebih dulu (gunakan tombol Auto-translate bila perlu).',
      400,
    )
  }
}

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
    // default, In Review, like everybody else. The one thing they are not
    // exempt from is publishing something only half translated.
    if (next === APPROVAL_STATUSES.approved && originalDoc?.id) {
      await assertBothLanguages({
        req: req as never,
        collectionSlug: String(collection?.slug ?? ''),
        id: originalDoc.id,
      })
    }
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
    if (next === APPROVAL_STATUSES.approved) {
      await assertBothLanguages({
        req: req as never,
        collectionSlug: String(collection?.slug ?? ''),
        id: originalDoc?.id,
      })
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

    // Reports hold both languages on the page, so the Indonesian title is
    // simply there in the request — no locale reading needed.
    if (data.titleId !== undefined || originalDoc?.titleId !== undefined) {
      hasTitle = filled(data.titleId ?? originalDoc?.titleId)
    } else if (data.nameId !== undefined || originalDoc?.nameId !== undefined) {
      hasTitle = filled(data.nameId ?? originalDoc?.nameId)
    } else if (!locale || locale === 'id') {
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
