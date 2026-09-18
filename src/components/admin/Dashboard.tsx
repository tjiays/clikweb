import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { ROLES, type Role } from '@/access/roles'
import './Dashboard.scss'

/**
 * Replaces Payload's default dashboard.
 *
 * The stock version lists every collection in one flat column, each with a
 * "+" button that jumps straight to a create form. Editors asked for
 * something they can scan: coloured cards grouped by module, where the whole
 * card opens that module's list.
 *
 * Only the modules a user's role can reach are shown, so an HR Admin does not
 * see cards they cannot open.
 */

type Card = {
  label: string
  description: string
  slug: string
  /** Which roles may see this card. Empty means Super Admin only. */
  roles: Role[]
  colour: string
}

type Group = { title: string; cards: Card[] }

const EDITORS: Record<string, Role[]> = {
  news: [ROLES.newsAdmin],
  hr: [ROLES.hrAdmin],
  marketing: [ROLES.marketingAdmin],
}

const GROUPS: Group[] = [
  {
    title: 'Newsroom',
    cards: [
      { label: 'Artikel', description: 'Berita dan insight', slug: 'articles', roles: EDITORS.news, colour: 'orange' },
      { label: 'Author', description: 'Penulis artikel', slug: 'authors', roles: EDITORS.news, colour: 'orange-soft' },
      { label: 'Partner Logo (Media)', description: 'Daftar media', slug: 'media-outlets', roles: EDITORS.news, colour: 'orange-soft' },
      { label: 'Liputan Media', description: 'Liputan dari media luar', slug: 'media-coverage', roles: EDITORS.news, colour: 'orange-soft' },
    ],
  },
  {
    title: 'Laporan',
    cards: [
      { label: 'Daftar Laporan', description: 'Laporan tahunan dan perkembangan usaha', slug: 'reports', roles: EDITORS.news, colour: 'navy' },
    ],
  },
  {
    title: 'Karir',
    cards: [
      { label: 'Lowongan Pekerjaan', description: 'Posisi yang sedang dibuka', slug: 'job-openings', roles: EDITORS.hr, colour: 'teal' },
      { label: 'Kategori Lowongan', description: 'Pengelompokan posisi', slug: 'job-categories', roles: EDITORS.hr, colour: 'teal-soft' },
    ],
  },
  {
    title: 'Produk & Layanan',
    cards: [
      { label: 'Kategori Produk', description: 'Lima kategori layanan', slug: 'product-categories', roles: EDITORS.marketing, colour: 'purple' },
      { label: 'Item Produk', description: 'Produk di dalam kategori', slug: 'product-items', roles: EDITORS.marketing, colour: 'purple-soft' },
    ],
  },
  {
    title: 'Konten Website',
    cards: [
      { label: 'Homepage Hero', description: 'Slide di bagian paling atas', slug: 'hero-slides', roles: EDITORS.marketing, colour: 'blue' },
      { label: 'Homepage Stats', description: 'Tiga kartu angka', slug: 'stats', roles: EDITORS.marketing, colour: 'blue-soft' },
      { label: 'Testimoni Mitra', description: 'Kutipan dari klien', slug: 'testimonials', roles: EDITORS.marketing, colour: 'blue-soft' },
      { label: 'Timeline Pencapaian', description: 'Milestone per tahun', slug: 'milestones', roles: EDITORS.marketing, colour: 'blue-soft' },
      { label: 'Partner Logo', description: 'Logo anggota dan regulator', slug: 'partner-logos', roles: EDITORS.marketing, colour: 'blue-soft' },
      { label: 'CTA Blocks', description: 'Blok penutup tiap halaman', slug: 'cta-blocks', roles: EDITORS.marketing, colour: 'blue-soft' },
      { label: 'Page Content', description: 'Naskah halaman utama', slug: 'page-content', roles: EDITORS.marketing, colour: 'blue-soft' },
      { label: 'Halaman Statis', description: 'Kebijakan dan cara', slug: 'static-pages', roles: [], colour: 'grey' },
    ],
  },
  {
    title: 'Pengaturan',
    cards: [
      { label: 'Data Masuk', description: 'Kiriman formulir Hubungi Kami', slug: 'contact-submissions', roles: [ROLES.salesAdmin], colour: 'green' },
      { label: 'Users & Roles', description: 'Pengguna CMS', slug: 'users', roles: [], colour: 'grey' },
      { label: 'Audit Log', description: 'Riwayat perubahan', slug: 'audit-log', roles: [], colour: 'grey' },
      { label: 'Media Library', description: 'Gambar dan berkas', slug: 'media', roles: [ROLES.newsAdmin, ROLES.hrAdmin, ROLES.marketingAdmin], colour: 'grey' },
    ],
  },
]

export default function Dashboard({ user }: AdminViewServerProps) {
  const role = (user as { role?: Role } | undefined)?.role
  const isSuperAdmin = role === ROLES.superAdmin
  const isApprover = role === ROLES.approver

  const visible = (card: Card) => {
    if (isSuperAdmin) return true
    // The Approver reviews every module, so they can open any content list.
    if (isApprover) return card.slug !== 'users' && card.slug !== 'contact-submissions'
    return Boolean(role && card.roles.includes(role))
  }

  const groups = GROUPS.map((group) => ({
    ...group,
    cards: group.cards.filter(visible),
  })).filter((group) => group.cards.length > 0)

  return (
    <div className="clik-dashboard">
      <header className="clik-dashboard__head">
        <h1>Selamat datang{user?.name ? `, ${user.name}` : ''}</h1>
        <p>Pilih bagian yang ingin Anda kelola.</p>
      </header>

      {groups.length === 0 ? (
        <p className="clik-dashboard__empty">
          Belum ada modul yang bisa Anda akses. Hubungi Super Admin.
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.title} className="clik-dashboard__group">
            <h2 className="clik-dashboard__groupTitle">{group.title}</h2>
            <div className="clik-dashboard__grid">
              {group.cards.map((card) => (
                // The whole card is the link — the default dashboard's "+"
                // jumped to a create form, which is rarely what an editor
                // wants first.
                <Link
                  key={card.slug}
                  href={`/admin/collections/${card.slug}`}
                  className={`clik-card clik-card--${card.colour}`}
                >
                  <span className="clik-card__label">{card.label}</span>
                  <span className="clik-card__description">{card.description}</span>
                  <span className="clik-card__go" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
