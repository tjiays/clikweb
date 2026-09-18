import type { Locale } from '@/i18n/config'

/** Dates in the reader's language, e.g. "18 September 2026". */
export function formatDate(value: unknown, locale: Locale): string | null {
  if (!value || typeof value !== 'string') return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
