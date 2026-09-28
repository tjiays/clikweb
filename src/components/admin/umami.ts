import 'server-only'
import { Pool } from 'pg'

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
const DB_URL = process.env.UMAMI_DATABASE_URL

/** One row of the "Halaman teratas" table. Null means "not measurable yet". */
export type PageRow = {
  path: string
  views: number
  visitors: number
  /** Average seconds before the visitor opened another page. */
  avgSeconds: number | null
  /** How many of the views that average is built from. */
  timedViews: number
  /** Visits that started on this page. */
  entrances: number
  /** Of those, visits that left without opening a second page. */
  bounces: number
  /** Largest Contentful Paint at the 75th percentile, in milliseconds. */
  lcp: number | null
}

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
  topPages: PageRow[]
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

/*
 * Time on page cannot come from Umami's API. Its per-page "totaltime" is the
 * gap between the first and last view of the same page inside one visit, so a
 * page opened once reads zero seconds — and every page is opened once far more
 * often than twice. Its per-page "bounces" are likewise "viewed once in this
 * visit", not "left the site from here".
 *
 * So both are worked out here, with the usual definitions:
 *
 *   time on page  the gap until the visitor opened their next page. The last
 *                 page of a visit has no next page and is left out rather than
 *                 counted as zero; a gap is capped at 30 minutes so one tab left
 *                 open over lunch cannot swamp the average.
 *   bounce        a visit that started on this page and opened nothing else.
 *
 * Read straight from Umami's database through a role that may SELECT the
 * event table and nothing else, in a read-only transaction. Only the columns
 * every Umami version has carried are used.
 */
let pool: Pool | null = null
const db = () => {
  if (!DB_URL) return null
  pool ??= new Pool({ connectionString: DB_URL, max: 2, idleTimeoutMillis: 30_000 })
  return pool
}

const PAGE_SQL = `
  with pv as (
    select visit_id, session_id, url_path, created_at,
           lead(created_at) over (partition by visit_id order by created_at) as next_at,
           row_number()     over (partition by visit_id order by created_at) as n,
           count(*)         over (partition by visit_id)                    as visit_pages
    from website_event
    where website_id = $1 and event_type = 1 and created_at between $2 and $3
  )
  select url_path as path,
         count(*)::int                                            as views,
         count(distinct session_id)::int                          as visitors,
         avg(least(extract(epoch from next_at - created_at), 1800))
           filter (where next_at is not null)::float               as avg_seconds,
         (count(*) filter (where next_at is not null))::int       as timed_views,
         (count(*) filter (where n = 1))::int                     as entrances,
         (count(*) filter (where n = 1 and visit_pages = 1))::int as bounces
  from pv
  group by url_path
  order by views desc, path
  limit 10`

async function readPages(start: Date, end: Date): Promise<PageRow[] | null> {
  const conn = db()
  if (!conn || !SITE) return null
  try {
    const { rows } = await conn.query(PAGE_SQL, [SITE, start, end])
    return rows.map((r: any) => ({
      path: String(r.path ?? ''),
      views: Number(r.views) || 0,
      visitors: Number(r.visitors) || 0,
      avgSeconds: r.avg_seconds == null ? null : Number(r.avg_seconds),
      timedViews: Number(r.timed_views) || 0,
      entrances: Number(r.entrances) || 0,
      bounces: Number(r.bounces) || 0,
      lcp: null,
    }))
  } catch {
    return null
  }
}

export async function getAnalytics(days = 7): Promise<Analytics> {
  if (!KEY || !SITE) return { ...EMPTY, days }

  const endAt = Date.now()
  const startAt = endAt - days * 24 * 60 * 60 * 1000
  const range = `startAt=${startAt}&endAt=${endAt}`
  const fields = (f: string) => encodeURIComponent(JSON.stringify([f]))

  const [stats, perf, pages, refs, pageRows, pageLcp] = await Promise.all([
    get(`/api/websites/${SITE}/stats?${range}`),
    get(`/api/websites/${SITE}/performance/stats?${range}`),
    get(`/api/websites/${SITE}/breakdown?${range}&fields=${fields('path')}`),
    get(`/api/websites/${SITE}/breakdown?${range}&fields=${fields('referrer')}`),
    readPages(new Date(startAt), new Date(endAt)),
    get(`/api/websites/${SITE}/performance/metrics?${range}&type=path&metric=lcp&limit=500`),
  ])

  if (!stats) return { ...EMPTY, days }

  const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0)

  // Without the database reader the table still shows views and visitors from
  // the API; the columns it cannot fill honestly are left empty, not guessed.
  const baseRows: PageRow[] =
    pageRows ??
    (Array.isArray(pages)
      ? pages
          .map((p: any) => ({
            path: String(p.path ?? ''),
            views: num(p.views),
            visitors: num(p.visitors),
            avgSeconds: null,
            timedViews: 0,
            entrances: 0,
            bounces: 0,
            lcp: null,
          }))
          .filter((p) => p.path)
          .sort((a, b) => b.views - a.views)
          .slice(0, 10)
      : [])

  const lcpByPath = new Map<string, number>()
  if (Array.isArray(pageLcp)) {
    for (const m of pageLcp) {
      const v = m?.p75
      if (m?.name && typeof v === 'number' && v > 0) lcpByPath.set(String(m.name), v)
    }
  }
  const topPages = baseRows.map((r) => ({ ...r, lcp: lcpByPath.get(r.path) ?? null }))

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
