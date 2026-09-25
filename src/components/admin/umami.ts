import 'server-only'

/**
 * Reads the numbers out of Umami, which runs on this same server.
 *
 * Server to server, straight to the port, so the request never leaves the
 * machine and nobody in the CMS needs a second login. The API key lives in the
 * environment and is never sent to the browser.
 *
 * Nothing here throws. Analytics being down is not a reason for the CMS
 * landing page to be down, so every call returns a shape the view can render
 * and an `ok` flag saying whether to trust it.
 */

const BASE = (process.env.UMAMI_BASE_URL || 'http://127.0.0.1:3100/analytics').replace(/\/$/, '')
const KEY = process.env.UMAMI_API_KEY
const SITE = process.env.UMAMI_WEBSITE_ID || process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

export type Vital = { p50: number; p75: number; p95: number }
export type Rating = 'good' | 'fair' | 'poor' | 'none'

export type Analytics = {
  ok: boolean
  configured: boolean
  hasData: boolean
  days: number
  stats: { pageviews: number; visitors: number; visits: number; bounces: number; totaltime: number }
  previous: { pageviews: number; visitors: number }
  vitals: Record<'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb', Vital> | null
  vitalsCount: number
  topPages: { path: string; views: number; visitors: number }[]
  referrers: { referrer: string; views: number }[]
}

const EMPTY: Analytics = {
  ok: false,
  configured: Boolean(KEY && SITE),
  hasData: false,
  days: 7,
  stats: { pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0 },
  previous: { pageviews: 0, visitors: 0 },
  vitals: null,
  vitalsCount: 0,
  topPages: [],
  referrers: [],
}

const get = async (path: string): Promise<any | null> => {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Authorization: `Bearer ${KEY}` },
      // The dashboard is a live view; a stale cache would be worse than a
      // brief wait.
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Core Web Vitals are judged on the 75th percentile, not the average: the
 * threshold is "three quarters of visits were at least this good". The
 * boundaries are Google's published ones.
 */
const THRESHOLDS: Record<string, [number, number]> = {
  lcp: [2500, 4000],
  inp: [200, 500],
  cls: [0.1, 0.25],
  fcp: [1800, 3000],
  ttfb: [800, 1800],
}

export const rate = (metric: string, p75: number | null | undefined): Rating => {
  const t = THRESHOLDS[metric]
  if (!t || p75 == null || Number.isNaN(p75) || p75 <= 0) return 'none'
  if (p75 <= t[0]) return 'good'
  if (p75 <= t[1]) return 'fair'
  return 'poor'
}

export async function getAnalytics(days = 7): Promise<Analytics> {
  if (!KEY || !SITE) return { ...EMPTY, days }

  const endAt = Date.now()
  const startAt = endAt - days * 24 * 60 * 60 * 1000
  const range = `startAt=${startAt}&endAt=${endAt}`
  const fields = (f: string) => encodeURIComponent(JSON.stringify([f]))

  const [stats, perf, pages, refs] = await Promise.all([
    get(`/api/websites/${SITE}/stats?${range}`),
    get(`/api/websites/${SITE}/performance/stats?${range}`),
    get(`/api/websites/${SITE}/breakdown?${range}&fields=${fields('path')}`),
    get(`/api/websites/${SITE}/breakdown?${range}&fields=${fields('referrer')}`),
  ])

  if (!stats) return { ...EMPTY, days }

  const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0)

  const topPages = Array.isArray(pages)
    ? pages
        .map((p: any) => ({ path: String(p.path ?? ''), views: num(p.views), visitors: num(p.visitors) }))
        .filter((p) => p.path)
        .sort((a, b) => b.views - a.views)
        .slice(0, 8)
    : []

  const referrers = Array.isArray(refs)
    ? refs
        .map((r: any) => ({ referrer: String(r.referrer ?? '').trim(), views: num(r.views) }))
        // A blank referrer means the visitor typed the address or came from a
        // bookmark. That is worth showing, but it is not a source.
        .map((r) => ({ ...r, referrer: r.referrer || 'Langsung' }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 6)
    : []

  return {
    ok: true,
    configured: true,
    hasData: num(stats.pageviews) > 0,
    days,
    stats: {
      pageviews: num(stats.pageviews),
      visitors: num(stats.visitors),
      visits: num(stats.visits),
      bounces: num(stats.bounces),
      totaltime: num(stats.totaltime),
    },
    previous: {
      pageviews: num(stats.comparison?.pageviews),
      visitors: num(stats.comparison?.visitors),
    },
    vitals: perf
      ? {
          lcp: perf.lcp ?? { p50: 0, p75: 0, p95: 0 },
          inp: perf.inp ?? { p50: 0, p75: 0, p95: 0 },
          cls: perf.cls ?? { p50: 0, p75: 0, p95: 0 },
          fcp: perf.fcp ?? { p50: 0, p75: 0, p95: 0 },
          ttfb: perf.ttfb ?? { p50: 0, p75: 0, p95: 0 },
        }
      : null,
    vitalsCount: num(perf?.count),
    topPages,
    referrers,
  }
}
