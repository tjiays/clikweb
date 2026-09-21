'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Container } from './Container'
import { LanguageSwitch } from './LanguageSwitch'
import { Caret } from '@/components/ui/icons'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import styles from './Header.module.css'

type Props = {
  locale: Locale
  dict: Dictionary
  /**
   * "dark" overlays the homepage hero (Figma 989:4062: 90px band of black at
   * 25%, white text); "light" is used on every inner page (1002:4221: white,
   * drop shadow 0 4 4 #000@25%). Left unset, it is derived from the route.
   */
  variant?: 'light' | 'dark'
}

export function Header({ locale, dict, variant }: Props) {
  const pathname = usePathname()
  // The mobile menu remembers which page it was opened on, so navigating to
  // another page closes it without an effect.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null)
  const menuOpen = menuOpenOn !== null && menuOpenOn === pathname

  // Only the homepage uses the translucent header that sits over the hero.
  const isHome = pathname === '/' || pathname === '/en'
  const resolved = variant ?? (isHome ? 'dark' : 'light')

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
          {/* White over the hero on the homepage, full colour on inner pages. */}
          <Image
            src={resolved === 'dark' ? '/images/shared/logo-clik-white.png' : '/images/shared/logo-clik.png'}
            alt="CLIK — CRIF Lembaga Informasi Keuangan"
            width={354}
            height={118}
            priority
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.nav} aria-label={dict.nav.home}>
          <ul className={styles.navList}>
            <li className={styles.itemHome}>
              <Link href={href('home', locale)} className={styles.navLink}>
                <span className={styles.label}>{dict.nav.home}</span>
              </Link>
            </li>

            <li className={`${styles.hasDropdown} ${styles.itemProducts}`}>
              {/* Top-level item links to the overview page */}
              <Link href={href('products', locale)} className={styles.navLink}>
                <span className={styles.label}>
                  {dict.nav.products}
                  <Caret className={styles.caret} />
                </span>
              </Link>
              <Dropdown items={productItems} className={styles.dropdownProducts} />
            </li>

            <li className={`${styles.hasDropdown} ${styles.itemAbout}`}>
              {/*
                "Tentang Kami" has no destination of its own in the design —
                it only opens the dropdown, so it is a button, not a link.
              */}
              <button type="button" className={styles.navLink} aria-haspopup="true">
                <span className={styles.label}>
                  {dict.nav.about}
                  <Caret className={styles.caret} />
                </span>
              </button>
              <Dropdown items={aboutItems} className={styles.dropdownAbout} />
            </li>

            <li className={styles.itemNewsroom}>
              <Link href={href('newsroom', locale)} className={styles.navLink}>
                <span className={styles.label}>{dict.nav.newsroom}</span>
              </Link>
            </li>
            <li className={styles.itemContact}>
              <Link href={href('contact', locale)} className={styles.navLink}>
                <span className={styles.label}>{dict.nav.contact}</span>
              </Link>
            </li>
            <li className={styles.itemCareers}>
              <Link href={href('careers', locale)} className={styles.navLink}>
                <span className={styles.label}>{dict.nav.careers}</span>
              </Link>
            </li>
          </ul>

          <div className={styles.lang}>
            <LanguageSwitch locale={locale} label={dict.common.languageSwitch} />
          </div>
        </nav>

        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
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

function Dropdown({
  items,
  className,
}: {
  items: { label: string; href: string }[]
  className?: string
}) {
  return (
    <ul className={`${styles.dropdown} ${className ?? ''}`}>
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={styles.dropdownLink}>
            <span className={styles.dropdownText}>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
