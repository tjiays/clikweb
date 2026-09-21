import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { AdminViewServerProps } from 'payload'
import { ROLES, type Role } from '@/access/roles'
import './Dashboard.scss'

/**
 * Replaces Payload's default dashboard.
 *
 * Two things drove the design. The stock version lists every collection in
 * one flat column with a "+" that jumps to a create form, which is rarely
 * what an editor wants first. And an earlier version of this page used seven
 * accent colours across eight cards, which read as noise rather than
 * structure — so there is now one accent, and the colour carries meaning
 * (something waiting for you) instead of decorating.
 *
 * Cards show a live count, so the page says something about the state of the
 * site rather than just listing links.
 */

type Card = {
  label: string
  description: string
  slug: string
  /** Roles that may open it. Empty means Super Admin only. */
  roles: Role[]
  /** Counted and shown on the card. */
  countable?: boolean
  /** Items in review are surfaced as the thing needing attention. */
  reviewable?: boolean
}

const EDITORS: Record<string, Role[]> = {
  news: [ROLES.newsAdmin],
  hr: [ROLES.hrAdmin],
  marketing: [ROLES.marketingAdmin],
}

const CONTENT: Card[] = [
  { label: 'Artikel', description: 'Berita dan insight', slug: 'articles', roles: EDITORS.news, countable: true, reviewable: true },
  { label: 'Laporan', description: 'Laporan tahunan dan perkembangan usaha', slug: 'reports', roles: EDITORS.news, countable: true, reviewable: true },
  { label: 'Item Produk', description: 'Produk pada Business Solution', slug: 'product-items', roles: EDITORS.marketing, countable: true, reviewable: true },
  { label: 'Lowongan Pekerjaan', description: 'Posisi yang sedang dibuka', slug: 'job-openings', roles: EDITORS.hr, countable: true, reviewable: true },
]

const SETTINGS: Card[] = [
  { label: 'Data Masuk', description: 'Kiriman formulir Hubungi Kami', slug: 'contact-submissions', roles: [ROLES.salesAdmin], countable: true },
  { label: 'Media Library', description: 'Gambar untuk artikel dan laporan', slug: 'media', roles: [ROLES.newsAdmin, ROLES.hrAdmin, ROLES.marketingAdmin], countable: true },
  { label: 'Audit Trail', description: 'Riwayat perubahan konten', slug: 'audit-log', roles: [] },
  { label: 'Users', description: 'Pengguna CMS dan perannya', slug: 'users', roles: [] },
]

export default async function Dashboard({ user }: AdminViewServerProps) {
  const role = (user as { role?: Role } | undefined)?.role
  const isSuperAdmin = role === ROLES.superAdmin
  const isApprover = role === ROLES.approver

  const visible = (card: Card) => {
    if (isSuperAdmin) return true
    // The Approver reviews every module but owns no data of their own.
    if (isApprover) return card.slug !== 'users' && card.slug !== 'contact-submissions'
    return Boolean(role && card.roles.includes(role))
  }

  const content = CONTENT.filter(visible)
  const settings = SETTINGS.filter(visible)

  // Counts make the page informative rather than a list of links. A failure
  // here must not take the dashboard down, so each one falls back to null.
  const payload = await getPayload({ config })
  const counts: Record<string, number> = {}
  const inReview: Record<string, number> = {}

  for (const card of [...content, ...settings]) {
    if (card.countable) {
      try {
        const { totalDocs } = await payload.count({ collection: card.slug as never })
        counts[card.slug] = totalDocs
      } catch {
        /* leave it unset */
      }
    }
    if (card.reviewable) {
      try {
        const { totalDocs } = await payload.count({
          collection: card.slug as never,
          where: { approvalStatus: { equals: 'in_review' } } as never,
        })
        if (totalDocs > 0) inReview[card.slug] = totalDocs
      } catch {
        /* leave it unset */
      }
    }
  }

  const waiting = Object.values(inReview).reduce((a, b) => a + b, 0)

  const renderCard = (card: Card) => {
    const count = counts[card.slug]
    const review = inReview[card.slug]
    return (
      <Link
        key={card.slug}
        href={`/admin/collections/${card.slug}`}
        className={`clik-card ${review ? 'clik-card--waiting' : ''}`}
      >
        <span className="clik-card__top">
          <span className="clik-card__label">{card.label}</span>
          {typeof count === 'number' && <span className="clik-card__count">{count}</span>}
        </span>
        <span className="clik-card__description">{card.description}</span>
        {review ? (
          <span className="clik-card__badge">{review} menunggu review</span>
        ) : (
          <span className="clik-card__go" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </Link>
    )
  }

  return (
    <div className="clik-dashboard">
      <header className="clik-dashboard__head">
        <h1>Selamat datang{user?.name ? `, ${user.name}` : ''}</h1>
        <p>
          {waiting > 0
            ? `${waiting} item menunggu review.`
            : 'Tidak ada yang menunggu review.'}{' '}
          Teks dan gambar halaman lain diatur langsung di kode oleh tim teknis.
        </p>
      </header>

      {content.length === 0 && settings.length === 0 ? (
        <p className="clik-dashboard__empty">
          Belum ada modul yang bisa Anda akses. Hubungi Super Admin.
        </p>
      ) : (
        <>
          {content.length > 0 && (
            <section className="clik-dashboard__group">
              <h2 className="clik-dashboard__groupTitle">Konten</h2>
              <div className="clik-dashboard__grid">{content.map(renderCard)}</div>
            </section>
          )}
          {settings.length > 0 && (
            <section className="clik-dashboard__group">
              <h2 className="clik-dashboard__groupTitle">Pengaturan</h2>
              <div className="clik-dashboard__grid">{settings.map(renderCard)}</div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
