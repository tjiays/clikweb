'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Container } from './Container'
import { LanguageSwitch } from './LanguageSwitch'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import styles from './Header.module.css'

type Props = {
  locale: Locale
  dict: Dictionary
  /**
   * "dark" overlays the homepage hero in white text; "light" is used on every
   * inner page. Left unset, it is derived from the route.
   */
  variant?: 'light' | 'dark'
}

export function Header({ locale, dict, variant }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Only the homepage uses the transparent header that sits over the hero.
  const isHome = pathname === '/' || pathname === '/en'
  const resolved = variant ?? (isHome ? 'dark' : 'light')

  // Close the mobile menu when navigating to another page
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent the page behind the mobile menu from scrolling
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Order and contents follow the Figma dropdowns (951:5644 and 953:5693).
  // The design does NOT repeat "Layanan dan Produk" inside its own dropdown —
  // the top-level item already links to that page.
  const productItems = [
    { label: dict.dropdown.creditScoring, href: href('creditScoring', locale) },
    { label: dict.dropdown.businessSolution, href: href('businessSolution', locale) },
  ]

  const aboutItems = [
    { label: dict.dropdown.aboutClik, href: href('about', locale) },
    { label: dict.dropdown.reports, href: href('reports', locale) },
    { label: dict.dropdown.privacyPolicy, href: href('privacyPolicy', locale) },
    { label: dict.dropdown.infoSecurityPolicy, href: href('infoSecurityPolicy', locale) },
  ]

  return (
    <header className={`${styles.header} ${styles[resolved]} ${menuOpen ? styles.menuOpen : ''}`}>
      <Container className={styles.inner}>
        <Link href={href('home', locale)} className={styles.logo} aria-label="CLIK">
          {/* White over the hero on the homepage, navy on inner pages. */}
          <Image
            src={resolved === 'dark' ? '/brand/logo-clik-white.png' : '/brand/logo-clik.png'}
            alt="CLIK — CRIF Lembaga Informasi Keuangan"
            width={354}
            height={118}
            priority
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.nav} aria-label={dict.nav.home}>
          <ul className={styles.navList}>
            <li>
              <Link href={href('home', locale)} className={styles.navLink}>
                {dict.nav.home}
              </Link>
            </li>

            <li className={styles.hasDropdown}>
              {/* Top-level item links to the overview page */}
              <Link href={href('products', locale)} className={styles.navLink}>
                {dict.nav.products}
                <Chevron />
              </Link>
              <Dropdown items={productItems} />
            </li>

            <li className={styles.hasDropdown}>
              {/*
                "Tentang Kami" has no destination of its own in the design —
                it only opens the dropdown, so it is a button, not a link.
              */}
              <button type="button" className={styles.navLink} aria-haspopup="true">
                {dict.nav.about}
                <Chevron />
              </button>
              <Dropdown items={aboutItems} />
            </li>

            <li>
              <Link href={href('newsroom', locale)} className={styles.navLink}>
                {dict.nav.newsroom}
              </Link>
            </li>
            <li>
              <Link href={href('contact', locale)} className={styles.navLink}>
                {dict.nav.contact}
              </Link>
            </li>
            <li>
              <Link href={href('careers', locale)} className={styles.navLink}>
                {dict.nav.careers}
              </Link>
            </li>
          </ul>

          <LanguageSwitch locale={locale} label={dict.common.languageSwitch} />
        </nav>

        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
        >
          <span className={styles.hamburgerBar} aria-hidden="true" />
          <span className={styles.hamburgerBar} aria-hidden="true" />
          <span className={styles.hamburgerBar} aria-hidden="true" />
        </button>
      </Container>
    </header>
  )
}

function Dropdown({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className={styles.dropdown}>
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={styles.dropdownLink}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Chevron() {
  return (
    <svg
      className={styles.chevron}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
