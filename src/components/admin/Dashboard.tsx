import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { ROLES, type Role } from '@/access/roles'
import { getDashboardData } from './dashboardData'
import { PublishedChart, CategoryChart } from './Charts'
import './Dashboard.scss'

/**
 * Replaces Payload's default dashboard with an overview: the figures that
 * describe the site, what is waiting for a decision, and what changed
 * recently — rather than a list of links.
 *
 * Laid out as stat tiles, then a chart panel beside a breakdown, then recent
 * activity, then the module shortcuts.
 */

type Card = { label: string; description: string; slug: string; roles: Role[] }

const EDITORS: Record<string, Role[]> = {
  news: [ROLES.newsAdmin],
  hr: [ROLES.hrAdmin],
  marketing: [ROLES.marketingAdmin],
}

const CONTENT: Card[] = [
  { label: 'Artikel', description: 'Berita dan insight', slug: 'articles', roles: EDITORS.news },
  { label: 'Laporan', description: 'Laporan tahunan dan perkembangan usaha', slug: 'reports', roles: EDITORS.news },
  { label: 'Item Produk', description: 'Produk pada Business Solution', slug: 'product-items', roles: EDITORS.marketing },
  { label: 'Lowongan Pekerjaan', description: 'Posisi yang sedang dibuka', slug: 'job-openings', roles: EDITORS.hr },
]

const SETTINGS: Card[] = [
  { label: 'Data Masuk', description: 'Kiriman formulir Hubungi Kami', slug: 'contact-submissions', roles: [ROLES.salesAdmin] },
  { label: 'Media Library', description: 'Gambar untuk artikel dan laporan', slug: 'media', roles: [ROLES.newsAdmin, ROLES.hrAdmin, ROLES.marketingAdmin] },
  { label: 'Audit Trail', description: 'Riwayat perubahan konten', slug: 'audit-log', roles: [] },
  { label: 'Users', description: 'Pengguna CMS dan perannya', slug: 'users', roles: [] },
]

/** The four figures worth putting at the top, in reading order. */
const TILES = [
  { slug: 'articles', label: 'Artikel', hint: 'dipublikasikan' },
  { slug: 'product-items', label: 'Item Produk', hint: 'di Business Solution' },
  { slug: 'job-openings', label: 'Lowongan', hint: 'terdaftar' },
  { slug: 'contact-submissions', label: 'Data Masuk', hint: 'dari formulir kontak' },
]

const formatWhen = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export default async function Dashboard({ user }: AdminViewServerProps) {
  const role = (user as { role?: Role } | undefined)?.role
  const isSuperAdmin = role === ROLES.superAdmin
  const isApprover = role === ROLES.approver

  const visible = (card: Card) => {
    if (isSuperAdmin) return true
    if (isApprover) return card.slug !== 'users' && card.slug !== 'contact-submissions'
    return Boolean(role && card.roles.includes(role))
  }

  const content = CONTENT.filter(visible)
  const settings = SETTINGS.filter(visible)
  const allowed = [...content, ...settings].map((c) => c.slug)

  const data = await getDashboardData(allowed)
  const waiting = Object.values(data.inReview).reduce((a, b) => a + b, 0)
  const tiles = TILES.filter((t) => allowed.includes(t.slug))

  const reviewLink = (slug: string) => `/admin/collections/${slug}?where[approvalStatus][equals]=in_review`

  return (
    <div className="clik-dash">
      <header className="clik-dash__head">
        <div>
          <h1>Selamat datang{user?.name ? `, ${user.name}` : ''}</h1>
          <p>Ringkasan konten CLIK hari ini.</p>
        </div>
        {waiting > 0 && (
          <Link href={reviewLink(Object.keys(data.inReview)[0])} className="clik-dash__alert">
            <span className="clik-dash__alertDot" aria-hidden="true" />
            {waiting} item menunggu review
          </Link>
        )}
      </header>

      {tiles.length > 0 && (
        <section className="clik-tiles">
          {tiles.map((tile) => (
            <Link key={tile.slug} href={`/admin/collections/${tile.slug}`} className="clik-tile">
              <span className="clik-tile__value">{data.counts[tile.slug] ?? 0}</span>
              <span className="clik-tile__label">{tile.label}</span>
              <span className="clik-tile__hint">{tile.hint}</span>
              {data.inReview[tile.slug] && (
                <span className="clik-tile__flag">{data.inReview[tile.slug]} menunggu</span>
              )}
            </Link>
          ))}
        </section>
      )}

      <section className="clik-split">
        {allowed.includes('articles') && (
          <article className="clik-panel clik-panel--wide">
            <header className="clik-panel__head">
              <h2>Artikel terbit</h2>
              <span className="clik-panel__sub">12 bulan terakhir</span>
            </header>
            <PublishedChart data={data.published} />
          </article>
        )}

        {allowed.includes('product-items') && data.byCategory.length > 0 && (
          <article className="clik-panel">
            <header className="clik-panel__head">
              <h2>Produk per kategori</h2>
              <span className="clik-panel__sub">{data.counts['product-items'] ?? 0} total</span>
            </header>
            <CategoryChart data={data.byCategory} />
          </article>
        )}
      </section>

      {data.activity.length > 0 && (
        <section className="clik-panel">
          <header className="clik-panel__head">
            <h2>Aktivitas terbaru</h2>
            <Link href="/admin/collections/audit-log" className="clik-panel__link">
              Lihat semua
            </Link>
          </header>
          <table className="clik-table">
            <thead>
              <tr>
                <th>Tindakan</th>
                <th>Item</th>
                <th>Oleh</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {data.activity.map((row, i) => (
                <tr key={i}>
                  <td><span className="clik-table__action">{row.action}</span></td>
                  <td className="clik-table__title">{row.title}</td>
                  <td>{row.user}</td>
                  <td className="clik-table__when">{formatWhen(row.at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {(content.length > 0 || settings.length > 0) && (
        <section className="clik-dash__links">
          <h2 className="clik-dash__linksTitle">Kelola</h2>
          <div className="clik-dash__linkGrid">
            {[...content, ...settings].map((card) => (
              <Link
                key={card.slug}
                href={`/admin/collections/${card.slug}`}
                className="clik-link"
              >
                <span className="clik-link__label">{card.label}</span>
                <span className="clik-link__description">{card.description}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {content.length === 0 && settings.length === 0 && (
        <p className="clik-dash__empty">
          Belum ada modul yang bisa Anda akses. Hubungi Super Admin.
        </p>
      )}
    </div>
  )
}
