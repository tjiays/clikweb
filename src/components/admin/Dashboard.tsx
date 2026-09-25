import type { AdminViewServerProps } from 'payload'
import { getAnalytics, rate, type Rating } from './umami'
import './Dashboard.scss'

/**
 * The CMS landing page: how the website is doing, for visitors and for speed.
 *
 * Drawn here rather than framing Umami's own screen, so it wears the CLIK
 * palette and type like the rest of the admin, and so nobody needs a second
 * account to read it. The figures come from Umami over the loopback address.
 */

const RANGE_DAYS = 7

const nf = new Intl.NumberFormat('id-ID')

const ms = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${Math.round(v)}ms`)

/** CLS is a ratio, not a duration, so it is the one metric without a unit. */
const VITALS: { key: 'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb'; label: string; hint: string; format: (v: number) => string }[] = [
  { key: 'lcp', label: 'LCP', hint: 'Konten utama muncul', format: ms },
  { key: 'inp', label: 'INP', hint: 'Respons saat diklik', format: ms },
  { key: 'cls', label: 'CLS', hint: 'Pergeseran tata letak', format: (v) => v.toFixed(3) },
  { key: 'fcp', label: 'FCP', hint: 'Tampilan pertama', format: ms },
  { key: 'ttfb', label: 'TTFB', hint: 'Respons server', format: ms },
]

const RATING_LABEL: Record<Rating, string> = {
  good: 'Baik',
  fair: 'Perlu perbaikan',
  poor: 'Buruk',
  none: 'Belum ada data',
}

const trend = (now: number, before: number) => {
  if (!before) return null
  const pct = Math.round(((now - before) / before) * 100)
  if (pct === 0) return null
  return { pct: Math.abs(pct), up: pct > 0 }
}

export default async function Dashboard(_props: AdminViewServerProps) {
  const a = await getAnalytics(RANGE_DAYS)

  const bounceRate = a.stats.visits ? Math.round((a.stats.bounces / a.stats.visits) * 100) : 0
  const avgVisit = a.stats.visits ? Math.round(a.stats.totaltime / a.stats.visits) : 0
  const maxViews = a.topPages[0]?.views ?? 0

  const tiles = [
    { label: 'Pengunjung', value: nf.format(a.stats.visitors), t: trend(a.stats.visitors, a.previous.visitors) },
    { label: 'Tampilan halaman', value: nf.format(a.stats.pageviews), t: trend(a.stats.pageviews, a.previous.pageviews) },
    { label: 'Bounce rate', value: `${bounceRate}%`, t: null },
    { label: 'Rata-rata kunjungan', value: avgVisit ? ms(avgVisit * 1000) : '—', t: null },
  ]

  return (
    <div className="cdash">
      <header className="cdash__head">
        <h1 className="cdash__title">Analitik Website</h1>
        <p className="cdash__sub">{RANGE_DAYS} hari terakhir · cbclik.com</p>
      </header>

      {!a.configured ? (
        <p className="cdash__notice">
          Analitik belum dikonfigurasi. Setel <code>UMAMI_API_KEY</code> dan{' '}
          <code>UMAMI_WEBSITE_ID</code> lalu mulai ulang aplikasi.
        </p>
      ) : !a.ok ? (
        <p className="cdash__notice">
          Tidak bisa menghubungi layanan analitik. Website tetap berjalan normal; hanya
          angka di halaman ini yang belum bisa ditampilkan.
        </p>
      ) : null}

      <section className="cdash__tiles">
        {tiles.map((t) => (
          <div key={t.label} className="cdash__tile">
            <span className="cdash__tileValue">{t.value}</span>
            <span className="cdash__tileLabel">{t.label}</span>
            {t.t ? (
              <span className={`cdash__trend cdash__trend--${t.t.up ? 'up' : 'down'}`}>
                {t.t.up ? '▲' : '▼'} {t.t.pct}%
              </span>
            ) : null}
          </div>
        ))}
      </section>

      <section className="cdash__panel">
        <h2 className="cdash__panelTitle">Kecepatan halaman</h2>
        <p className="cdash__panelNote">
          Diukur dari browser pengunjung sungguhan, pada persentil ke-75.
          {a.vitalsCount ? ` ${nf.format(a.vitalsCount)} pengukuran.` : ''}
        </p>
        <div className="cdash__vitals">
          {VITALS.map(({ key, label, hint, format }) => {
            const p75 = a.vitals?.[key]?.p75 ?? 0
            const r = rate(key, p75)
            return (
              <div key={key} className="cdash__vital">
                <div className="cdash__vitalTop">
                  <span className="cdash__vitalLabel">{label}</span>
                  <span className={`cdash__badge cdash__badge--${r}`}>{RATING_LABEL[r]}</span>
                </div>
                <span className="cdash__vitalValue">{r === 'none' ? '—' : format(p75)}</span>
                <span className="cdash__vitalHint">{hint}</span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="cdash__split">
        <section className="cdash__panel">
          <h2 className="cdash__panelTitle">Halaman teratas</h2>
          {a.topPages.length ? (
            <ul className="cdash__list">
              {a.topPages.map((p) => (
                <li key={p.path} className="cdash__row">
                  <span className="cdash__rowLabel" title={p.path}>{p.path}</span>
                  <span className="cdash__bar" aria-hidden="true">
                    <span
                      className="cdash__barFill"
                      style={{ width: `${maxViews ? Math.max(4, (p.views / maxViews) * 100) : 0}%` }}
                    />
                  </span>
                  <span className="cdash__rowValue">{nf.format(p.views)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cdash__empty">Belum ada kunjungan tercatat.</p>
          )}
        </section>

        <section className="cdash__panel">
          <h2 className="cdash__panelTitle">Sumber kunjungan</h2>
          {a.referrers.length ? (
            <ul className="cdash__list">
              {a.referrers.map((r) => (
                <li key={r.referrer} className="cdash__row">
                  <span className="cdash__rowLabel">{r.referrer}</span>
                  <span className="cdash__rowValue">{nf.format(r.views)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cdash__empty">Belum ada sumber tercatat.</p>
          )}
        </section>
      </div>

      {a.ok && !a.hasData ? (
        <p className="cdash__notice cdash__notice--calm">
          Belum ada data karena situs belum dikunjungi. Angka akan muncul sendiri
          begitu ada pengunjung.
        </p>
      ) : null}
    </div>
  )
}
