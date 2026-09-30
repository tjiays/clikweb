/*
 * Scheduling: when an approved item becomes visible to the public.
 *
 * Approval is what makes something live; the publish date used to be only a
 * label and a sort key, so an approved article dated next Monday appeared at
 * once — and, sorting newest first, pinned itself above everything until the
 * real date caught up. It now holds the item back until its day begins.
 *
 * The boundary is midnight in Jakarta, so an item dated Monday appears in
 * the first minute of Monday there, whatever time of day was typed. WIB is
 * a fixed +7 with no daylight saving, which is what makes this arithmetic
 * safe to do by hand.
 *
 * This file has no imports on purpose. The website's queries and the
 * collections' access rules both use it, and the collections cannot import
 * anything that loads the Payload config without creating a cycle. One copy
 * of the rule means the website and the API can never disagree about what is
 * public — which is how an embargoed report once stayed off the website but
 * was readable by anyone through /api/reports.
 */
export const SCHEDULED_BY_DATE = new Set(['articles', 'reports'])

export const startOfTomorrowInJakarta = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const at = (type: string) => parts.find((p) => p.type === type)?.value ?? '01'
  const midnightToday = new Date(`${at('year')}-${at('month')}-${at('day')}T00:00:00+07:00`)
  midnightToday.setUTCDate(midnightToday.getUTCDate() + 1)
  return midnightToday.toISOString()
}

/**
 * The public conditions for a collection: published, and — where the
 * collection is dated — not still in the future.
 *
 * Job openings carry no publish date at all, so they are left out: asking
 * for a field they do not have would have hidden every job. An item with no
 * date is not scheduled, so it stays visible.
 */
export const publicWhere = (collection: string, extra: Record<string, unknown> = {}) => {
  const published = { _status: { equals: 'published' }, ...extra }
  if (!SCHEDULED_BY_DATE.has(collection)) return published
  return {
    and: [
      published,
      {
        or: [
          { publishDate: { less_than: startOfTomorrowInJakarta() } },
          { publishDate: { exists: false } },
        ],
      },
    ],
  }
}
