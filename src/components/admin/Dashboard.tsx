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

/** Seconds as a reader would say them: "8 dtk", "9 mnt 58 dtk". */
const duration = (sec: number) => {
  const s = Math.round(sec)
  if (s < 60) return `${s} dtk`
  const m = Math.floor(s / 60)
  const r = s % 60
  return r ? `${m} mnt ${r} dtk` : `${m} mnt`
}

/*
 * Each card leads with what the number means in plain words; the acronym is
 * kept small for anyone who wants to look it up. The target is the boundary
 * of "Baik" in rate(), stated so the badge beside it makes sense.
 * CLS is a ratio, not a duration, so it is the one metric without a unit.
 */
type VitalKey = 'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb'
const VITALS: { key: VitalKey; code: string; title: string; about: string; target: string; format: (v: number) => string }[] = [
  {
    key: 'lcp',
    code: 'LCP',
    title: 'Konten utama tampil',
    about: 'Lama sampai isi utama halaman terlihat.',
    target: 'Baik: maks. 2,5 dtk',
    format: ms,
  },
  {
    key: 'inp',
    code: 'INP',
    title: 'Respons saat diklik',
    about: 'Jeda antara klik atau ketuk dan halaman bereaksi.',
    target: 'Baik: maks. 200 ms',
    format: ms,
  },
  {
    key: 'cls',
    code: 'CLS',
    title: 'Stabilitas tampilan',
    about: 'Seberapa banyak isi halaman bergeser saat dimuat. Makin kecil makin baik.',
    target: 'Baik: maks. 0,1',
    format: (v) => v.toFixed(3),
  },
  {
    key: 'fcp',
    code: 'FCP',
    title: 'Tampilan pertama',
    about: 'Lama sampai sesuatu pertama kali muncul di layar.',
    target: 'Baik: maks. 1,8 dtk',
    format: ms,
  },
  {
    key: 'ttfb',
    code: 'TTFB',
    title: 'Respons server',
    about: 'Lama server mulai mengirim halaman ke browser.',
    target: 'Baik: maks. 800 ms',
    format: ms,
  },
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
        <div className="cdash__vitals">
          {VITALS.map(({ key, code, title, about, target, format }) => {
            const p75 = a.vitals?.[key]?.p75 ?? 0
            const r = rate(key, p75)
            return (
              <div key={key} className="cdash__vital">
                <div className="cdash__vitalTop">
                  <span className="cdash__vitalLabel">{title}</span>
                  <span className="cdash__vitalCode">{code}</span>
                </div>
                <div className="cdash__vitalMid">
                  <span className="cdash__vitalValue">{r === 'none' ? '—' : format(p75)}</span>
                  <span className={`cdash__badge cdash__badge--${r}`}>{RATING_LABEL[r]}</span>
                </div>
                <span className="cdash__vitalHint">{about}</span>
                <span className="cdash__vitalTarget">{target}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="cdash__panel">
        <h2 className="cdash__panelTitle">Halaman teratas</h2>
        {a.topPages.length ? (
          <>
            <div className="cdash__tableWrap">
              <table className="cdash__table">
                <thead>
                  <tr>
                    <th scope="col">Halaman</th>
                    <th scope="col" className="num">Tampilan</th>
                    <th scope="col" className="num">Pengunjung</th>
                    <th scope="col" className="num">Rata-rata waktu</th>
                    <th scope="col" className="num">Bounce</th>
                    <th scope="col" className="num">Waktu loading</th>
                  </tr>
                </thead>
                <tbody>
                  {a.topPages.map((p) => {
                    const r = rate('lcp', p.lcp)
                    return (
                      <tr key={p.path}>
                        <th scope="row" className="cdash__path" title={p.path}>{p.path}</th>
                        <td className="num">{nf.format(p.views)}</td>
                        <td className="num">{nf.format(p.visitors)}</td>
                        <td
                          className="num"
                          title={
                            p.avgSeconds == null
                              ? 'Selalu menjadi halaman terakhir kunjungan, jadi belum bisa diukur'
                              : `Dari ${nf.format(p.timedViews)} tampilan yang terukur`
                          }
                        >
                          {p.avgSeconds == null ? '—' : duration(p.avgSeconds)}
                        </td>
                        <td
                          className="num"
                          title={
                            p.entrances
                              ? `${nf.format(p.bounces)} dari ${nf.format(p.entrances)} kunjungan yang masuk lewat halaman ini`
                              : 'Belum ada kunjungan yang masuk lewat halaman ini'
                          }
                        >
                          {p.entrances ? `${Math.round((p.bounces / p.entrances) * 100)}%` : '—'}
                        </td>
                        <td className="num">
                          {p.lcp == null ? (
                            '—'
                          ) : (
                            <span className="cdash__load">
                              {ms(p.lcp)}
                              <span className={`cdash__badge cdash__badge--${r}`}>{RATING_LABEL[r]}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="cdash__foot">
              <strong>Rata-rata waktu</strong>: lama pengunjung di halaman sampai membuka halaman
              berikutnya; halaman terakhir sebuah kunjungan tidak bisa diukur.{' '}
              <strong>Bounce</strong>: kunjungan yang masuk lewat halaman ini lalu pergi tanpa
              membuka halaman lain. <strong>Waktu loading</strong>: sampai konten utama tampil
              (LCP, persentil ke-75).
            </p>
          </>
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

      {a.ok && !a.hasData ? (
        <p className="cdash__notice cdash__notice--calm">
          Belum ada data karena situs belum dikunjungi. Angka akan muncul sendiri
          begitu ada pengunjung.
        </p>
      ) : null}
    </div>
  )
}
