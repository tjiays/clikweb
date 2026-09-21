import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

/**
 * Opens a draft in the live site so an editor can see it before approving.
 *
 * Payload sends the reader here with a short-lived token. We check the token
 * identifies a real user, turn Next's draft mode on, and redirect to the page.
 * Draft mode is what lets the page read the unpublished revision.
 *
 * Without the token check anyone could read unapproved content by guessing a
 * URL, which for a supervised company is a disclosure problem, not a bug.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const collection = searchParams.get('collection')
  const slug = searchParams.get('slug')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PAYLOAD_SECRET) {
    return new Response('Invalid preview request.', { status: 403 })
  }
  if (!path || !collection || !slug) {
    return new Response('Missing path, collection or slug.', { status: 400 })
  }
  if (!path.startsWith('/')) {
    return new Response('Only same-site paths can be previewed.', { status: 400 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('You must be signed in to preview.', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
