import type { Endpoint, PayloadRequest } from 'payload'
import { isSuperAdmin } from '@/access'

/**
 * Hands a Super Admin the activation link for an account that has not been
 * verified yet.
 *
 * Staging catches all outgoing mail, so nobody actually receives the email —
 * and even once it is delivered for real, a link gets lost or a mailbox
 * bounces. Rather than have someone tick the verified flag by hand, which
 * defeats the point of asking for verification at all, this hands over the
 * same link the email carries so the person can still prove the address.
 *
 * The token is a hidden field, so it is read deliberately and only for
 * someone who could already reset the account anyway.
 */
export const verificationLinkEndpoint: Endpoint = {
  path: '/verification-link/:id',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    if (!isSuperAdmin(req.user)) {
      return Response.json({ error: 'Hanya Super Admin.' }, { status: 403 })
    }

    const id = req.routeParams?.id
    if (!id) return Response.json({ error: 'Missing id.' }, { status: 400 })

    const user = (await req.payload.findByID({
      collection: 'users',
      id: id as string,
      overrideAccess: true,
      showHiddenFields: true,
      req,
    })) as { _verified?: boolean; _verificationToken?: string; email?: string } | null

    if (!user) return Response.json({ error: 'Not found.' }, { status: 404 })
    if (user._verified) return Response.json({ verified: true })
    if (!user._verificationToken) {
      return Response.json({ verified: false, link: null, reason: 'no_token' })
    }

    // Built from this request, so the link points at whichever address the
    // admin is being used on rather than one named in an environment file.
    const host = req.headers?.get('x-forwarded-host') || req.headers?.get('host')
    const proto = req.headers?.get('x-forwarded-proto') || 'http'
    const origin = host
      ? `${proto}://${host}`
      : (process.env.SITE_URL || '').replace(/\/$/, '')

    return Response.json({
      verified: false,
      email: user.email,
      link: `${origin}/admin/verify/${user._verificationToken}`,
    })
  },
}
