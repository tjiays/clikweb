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

/**
 * Newsroom dates as Figma writes them on both languages: "June 25, 2026"
 * (305:1082, 556:2721, 827:5603, 156:1075). Read in Jakarta time, so a date
 * never slips a day on a server in another zone.
 */
export function formatNewsDate(value: unknown): string | null {
  if (!value || typeof value !== 'string') return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}
