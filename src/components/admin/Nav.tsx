'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
import type { ReactNode } from 'react'
import './Nav.scss'

/**
 * Replaces Payload's sidebar entirely.
 *
 * Owning the markup rather than restyling Payload's means the icons are real
 * SVG elements that inherit the link's colour, and the Dashboard entry is the
 * same kind of element as every other item rather than something positioned
 * to resemble one.
 *
 * Items are filtered by the signed-in user's role, matching the access rules
 * in src/access — otherwise someone would be shown links to collections they
 * cannot open.
 */

type Role =
  | 'super_admin'
  | 'hr_admin'
  | 'news_admin'
  | 'marketing_admin'
  | 'sales_admin'
  | 'approver'

/** Who may reach each collection. Mirrors src/access/index.ts. */
const OWNERS: Record<string, Role[]> = {
  articles: ['news_admin'],
  media: ['news_admin', 'hr_admin', 'marketing_admin'],
  reports: ['news_admin'],
  'product-items': ['marketing_admin'],
  'job-openings': ['hr_admin'],
  'contact-submissions': ['sales_admin'],
  'audit-log': [],
  users: [],
}

type Item = { slug: string; label: string; icon: ReactNode }

const I = (d: string, filled = false) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? undefined : 'currentColor'}
    strokeWidth={filled ? undefined : 1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
)

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: 'Dashboard',
    items: [
      {
        slug: '',
        label: 'Dashboard',
        icon: I('M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6v-9h-6v9zm0-16v5h6V4h-6z', true),
      },
    ],
  },
  {
    title: 'Newsroom',
    items: [
      { slug: 'articles', label: 'Artikel', icon: I('M4 4h11a2 2 0 012 2v12a2 2 0 002 2H6a2 2 0 01-2-2V4zm3 4h7M7 11h7M7 14h4') },
      { slug: 'media', label: 'Media Library', icon: I('M3 5h18v14H3V5zm0 11l5-5 4 4 3-3 6 6M9 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z') },
    ],
  },
  {
    title: 'Report',
    items: [{ slug: 'reports', label: 'Laporan', icon: I('M5 20V10m5 10V4m5 16v-7m5 7V7') }],
  },
  {
    title: 'Product',
    items: [{ slug: 'product-items', label: 'Item Produk', icon: I('M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 18V12M4 7.5l8 4.5 8-4.5') }],
  },
  {
    title: 'Karir',
    items: [{ slug: 'job-openings', label: 'Lowongan Pekerjaan', icon: I('M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9zm6 0V6a2 2 0 012-2h2a2 2 0 012 2v3') }],
  },
  {
    title: 'Data',
    items: [
      { slug: 'contact-submissions', label: 'Data Masuk', icon: I('M3 6h18v12H3V6zm0 0l9 7 9-7') },
      { slug: 'audit-log', label: 'Audit Trail', icon: I('M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z') },
    ],
  },
  {
    title: 'Pengaturan',
    items: [
      { slug: 'users', label: 'Users', icon: I('M16 19v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 9a3 3 0 100-6 3 3 0 000 6zM21 19v-2a4 4 0 00-3-3.9') },
    ],
  },
]

export default function Nav() {
  const pathname = usePathname() ?? ''
  const { user } = useAuth()
  const role = (user as { role?: Role } | null | undefined)?.role

  const canSee = (slug: string) => {
    if (!slug) return true // the dashboard is always reachable
    if (role === 'super_admin') return true
    // The Approver reviews every module but owns no settings of their own.
    if (role === 'approver') return slug !== 'users' && slug !== 'contact-submissions'
    return Boolean(role && (OWNERS[slug] ?? []).includes(role))
  }

  const href = (slug: string) => (slug ? `/admin/collections/${slug}` : '/admin')
  const isActive = (slug: string) =>
    slug ? pathname.startsWith(`/admin/collections/${slug}`) : pathname === '/admin'

  const renderItem = (item: Item) => (
    <Link
      key={item.slug || 'dashboard'}
      href={href(item.slug)}
      className={`cnav__item${isActive(item.slug) ? ' cnav__item--active' : ''}`}
      aria-current={isActive(item.slug) ? 'page' : undefined}
    >
      <span className="cnav__icon">{item.icon}</span>
      <span className="cnav__label">{item.label}</span>
    </Link>
  )

  return (
    <nav className="cnav" aria-label="Menu utama">
      <Link href="/admin" className="cnav__brand">
        <img src="/images/shared/logo-clik-white.png" alt="CLIK" />
      </Link>

      {GROUPS.map((group) => {
        const items = group.items.filter((item) => canSee(item.slug))
        if (items.length === 0) return null
        return (
          <div className="cnav__group" key={group.title}>
            <p className="cnav__groupTitle">{group.title}</p>
            {items.map(renderItem)}
          </div>
        )
      })}

      <div className="cnav__foot">
        <Link href="/admin/account" className="cnav__item cnav__item--small">
          <span className="cnav__icon">
            {I('M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z')}
          </span>
          <span className="cnav__label">Akun</span>
        </Link>
        <Link href="/admin/logout" className="cnav__item cnav__item--small">
          <span className="cnav__icon">
            {I('M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9')}
          </span>
          <span className="cnav__label">Keluar</span>
        </Link>
      </div>
    </nav>
  )
}
