'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * A Dashboard entry at the top of the sidebar.
 *
 * Payload has no such link by default — you get back to the dashboard by
 * clicking the logo, which is not obvious. This sits above the collection
 * groups and highlights when you are on it.
 */
export default function NavDashboardLink() {
  const pathname = usePathname()
  const isActive = pathname === '/admin'

  return (
    <Link
      href="/admin"
      className={`clik-nav-dashboard${isActive ? ' clik-nav-dashboard--active' : ''}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6v-9h-6v9zm0-16v5h6V4h-6z"
          fill="currentColor"
        />
      </svg>
      Dashboard
    </Link>
  )
}
