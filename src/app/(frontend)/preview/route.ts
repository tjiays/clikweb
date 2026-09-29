import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

/** The collections that have something to preview on the public site. */
const PREVIEWABLE = new Set(['articles', 'reports', 'job-openings', 'product-items'])

/**
 * Opens unapproved work on the live site so it can be checked before approval.
 *
 * Draft mode is what lets a page read the unpublished revision, so the one
 * question here is who may switch it on: a signed-in CMS user who is allowed
 * to read unapproved items in that collection. The Approver and Super Admin
 * can for every module; an editor only for their own. A Sales Admin cannot.
 *
 * There is deliberately no secret in the link. It used to carry
 * PAYLOAD_SECRET — the key that signs every login — which put that key in
 * every editor's page source, browser history and the server's access log.
 * The session is the proof of identity; a shared secret added nothing but
 * the leak.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const collection = searchParams.get('collection')

  if (!path || !collection) {
    return new Response('Missing path or collection.', { status: 400 })
  }
  if (!PREVIEWABLE.has(collection)) {
    return new Response('That collection has no preview.', { status: 400 })
  }
  // Same-site paths only. "//example.com" and "/\example.com" start with a
  // slash too, but a browser follows them to another site.
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return new Response('Only same-site paths can be previewed.', { status: 400 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('You must be signed in to preview.', { status: 403 })
  }

  // Ask the collection's own read rule, the one the API enforces, whether
  // this person may see unapproved items in it. It refuses by throwing.
  try {
    await payload.find({
      collection: collection as never,
      user,
      overrideAccess: false,
      draft: true,
      limit: 1,
      depth: 0,
    })
  } catch {
    return new Response('You cannot preview this module.', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
