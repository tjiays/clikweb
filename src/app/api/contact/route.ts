import { getPayload } from 'payload'
import config from '@payload-config'
import { checkRateLimit, clientIp, normalisePhone } from '@/lib/rateLimit'
import {
  validateContactForm,
  CONSENT_VERSION,
  type ContactFormValues,
} from '@/lib/contactForm'
import { site } from '@/content/site'

/**
 * Receives a contact form submission (intent/04 §1).
 *
 *   1. Validate on the server as well as in the browser
 *   2. Check the rate limits
 *   3. Save the submission — this is the permanent record
 *   4. Email it to the sales address, with Reply-To set to the sender
 *   5. If the email fails, the submission is still saved and the error logged
 */
export async function POST(request: Request) {
  const payload = await getPayload({ config })

  let body: ContactFormValues & { locale?: string; pageUrl?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 })
  }

  // Server-side validation repeats the browser's checks, because the browser
  // can be bypassed.
  const errors = validateContactForm(body, (key) => key)
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 })
  }

  const ip = clientIp(request.headers)
  const limit = await checkRateLimit(payload, {
    email: body.email,
    phone: body.phone,
    ip,
  })

  if (!limit.allowed) {
    // Nothing is stored and nothing is sent when a limit is hit.
    return Response.json({ error: 'rate_limited', reason: limit.reason }, { status: 429 })
  }

  const submission = {
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    email: body.email.trim().toLowerCase(),
    phone: normalisePhone(body.phone),
    companyName: body.companyName.trim(),
    interestedIn: body.interestedIn,
    hearAboutUs: body.hearAboutUs || undefined,
    message: body.message.trim(),
    consent: true,
    marketingChannels: body.marketingChannels ?? [],
    marketingPreference: body.marketingPreference || undefined,
    locale: body.locale ?? 'id',
    pageUrl: body.pageUrl,
    ipAddress: ip ?? undefined,
    userAgent: request.headers.get('user-agent') ?? undefined,
    consentTextVersion: CONSENT_VERSION,
  }

  let created
  try {
    created = await payload.create({
      collection: 'contact-submissions',
      data: submission as never,
      overrideAccess: true,
    })
  } catch (error) {
    payload.logger.error({ err: error }, 'Could not save contact submission')
    return Response.json({ error: 'save_failed' }, { status: 500 })
  }

  // The submission is safe by this point. An email failure must not lose it.
  try {
    const recipient =
      process.env.CONTACT_FORM_RECIPIENT || site.salesEmail || 'sales@cbclik.com'

    await payload.sendEmail({
      to: recipient,
      replyTo: `${submission.firstName} ${submission.lastName} <${submission.email}>`,
      subject: `Hubungi Kami — ${submission.companyName} (${submission.interestedIn})`,
      text: [
        `Nama: ${submission.firstName} ${submission.lastName}`,
        `Email: ${submission.email}`,
        `Telepon: ${submission.phone}`,
        `Perusahaan: ${submission.companyName}`,
        `Interested in: ${submission.interestedIn}`,
        `How did you hear about us: ${submission.hearAboutUs ?? '-'}`,
        '',
        'Pesan:',
        submission.message,
        '',
        '---',
        `Bahasa: ${submission.locale}`,
        `Halaman: ${submission.pageUrl ?? '-'}`,
        `Marketing channels: ${(submission.marketingChannels ?? []).join(', ') || '-'}`,
        `Marketing preference: ${submission.marketingPreference ?? '-'}`,
        `Consent version: ${submission.consentTextVersion}`,
      ].join('\n'),
    })
  } catch (error) {
    payload.logger.error(
      { err: error, submissionId: (created as { id?: unknown })?.id },
      'Contact submission saved but the email could not be sent',
    )
  }

  return Response.json({ ok: true })
}
