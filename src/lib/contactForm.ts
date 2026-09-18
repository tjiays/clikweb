/**
 * Shape and validation for the contact form (intent/04 §1).
 * Shared by the browser and the server, so both check the same rules.
 */

export const INTERESTS = [
  'Business Information',
  'Business Analytics',
  'Business Solutions',
  'Market Research',
  'CRIF PLUS Membership Programme',
  'Credit Bureau',
  'General Enquiries',
] as const

export const HEARD_FROM = [
  'Conference/Exhibition',
  'Flyer/Leaflet',
  'Google Search',
  'Magazine',
  'Referral',
  'Social Media',
  'Webinar',
  'Other',
] as const

export const MARKETING_CHANNELS = ['SMS/WhatsApp', 'Telephone', 'Email', 'Newsletter'] as const

export type ContactFormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  interestedIn: string
  hearAboutUs: string
  message: string
  consent: boolean
  marketingChannels: string[]
  marketingPreference: string
}

export const EMPTY_FORM: ContactFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  interestedIn: '',
  hearAboutUs: '',
  message: '',
  consent: false,
  marketingChannels: [],
  marketingPreference: '',
}

export type FieldErrors = Partial<Record<keyof ContactFormValues, string>>

/** The consent text shown beside the checkbox, versioned so we know what was agreed to. */
export const CONSENT_VERSION = '2026-09-18'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^[+\d][\d\s().-]{6,}$/

/**
 * Validates a submission. Returns one message per invalid field, keyed by
 * field name, so the form can show each error beside its own input.
 */
export function validateContactForm(
  values: ContactFormValues,
  t: (key: string) => string,
): FieldErrors {
  const errors: FieldErrors = {}
  const required: (keyof ContactFormValues)[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'companyName',
    'interestedIn',
    'message',
  ]

  for (const field of required) {
    if (!String(values[field] ?? '').trim()) errors[field] = t('required')
  }

  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = t('invalidEmail')
  }
  if (!errors.phone && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = t('invalidPhone')
  }
  if (!values.consent) {
    errors.consent = t('consentRequired')
  }

  return errors
}
