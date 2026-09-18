import 'server-only'
import type { Payload } from 'payload'

/**
 * Rate limits for the contact form (intent/04 §1).
 *
 *   3 submissions per 24 hours, per email address OR phone number
 *   5 submissions per hour, per IP address
 *
 * Counted server-side against the submissions already stored, so a visitor
 * cannot get around them by clearing their browser. There is no CAPTCHA, per
 * confirmed decision 18.
 */

export const LIMITS = {
  perContact: { count: 3, windowHours: 24 },
  perNetwork: { count: 5, windowHours: 1 },
} as const

export type RateLimitResult = { allowed: true } | { allowed: false; reason: 'contact' | 'network' }

const since = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

/**
 * Normalises an Indonesian phone number so the same number written different
 * ways counts once: 0812…, +62812… and 62812… all become +62812….
 */
export function normalisePhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('62')) return `+${digits}`
  if (digits.startsWith('0')) return `+62${digits.slice(1)}`
  return digits
}

export async function checkRateLimit(
  payload: Payload,
  { email, phone, ip }: { email: string; phone: string; ip: string | null },
): Promise<RateLimitResult> {
  const normalisedEmail = email.trim().toLowerCase()
  const normalisedPhone = normalisePhone(phone)

  const contactCount = await payload.count({
    collection: 'contact-submissions',
    where: {
      createdAt: { greater_than: since(LIMITS.perContact.windowHours) },
      or: [
        { email: { equals: normalisedEmail } },
        { phone: { equals: normalisedPhone } },
      ],
    } as never,
    overrideAccess: true,
  })

  if (contactCount.totalDocs >= LIMITS.perContact.count) {
    return { allowed: false, reason: 'contact' }
  }

  if (ip) {
    const networkCount = await payload.count({
      collection: 'contact-submissions',
      where: {
        createdAt: { greater_than: since(LIMITS.perNetwork.windowHours) },
        ipAddress: { equals: ip },
      } as never,
      overrideAccess: true,
    })
    if (networkCount.totalDocs >= LIMITS.perNetwork.count) {
      return { allowed: false, reason: 'network' }
    }
  }

  return { allowed: true }
}

/** The visitor's address, taken from the proxy headers nginx sets. */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null
  return headers.get('x-real-ip')
}
