import Image from 'next/image'
import Link from 'next/link'
import { Marquee } from '@/components/sections/Marquee'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { detailHref, mediaOutletHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import type { Logo, MediaOutlet } from '@/content/newsroom'

import styles from './NewsroomSidebar.module.css'

/**
 * The Newsroom left column (Figma 305:1082, 1783:10734): "Featured News" as a
 * plain bulleted list of links, then "Daftar Media" as 192x56 outlet buttons.
 * No card around either block — both sit straight on the page background.
 */
export function NewsroomSidebar({
  locale,
  featured,
  outlets,
  featuredLabel,
  outletsLabel,
}: {
  locale: Locale
  featured: { id: string | number; slug: string; title: string }[]
  outlets: MediaOutlet[]
  featuredLabel: string
  outletsLabel: string
}) {
  return (
    <aside className={styles.sidebar}>
      {featured.length > 0 && (
        <section className={styles.featuredBlock}>
          <SectionTitle size="md" weight={700} ruleGap={5} className={styles.heading}>
            {featuredLabel}
          </SectionTitle>
          <ul className={styles.featured}>
            {featured.map((article) => (
              <li key={article.id}>
                <Link href={detailHref('newsroom', article.slug, locale)}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {outlets.length > 0 && (
        <section className={styles.outletsBlock}>
          <SectionTitle size="md" weight={700} ruleGap={7} className={styles.heading}>
            {outletsLabel}
          </SectionTitle>
          <ul className={styles.outlets}>
            {outlets.map((outlet) => (
              <li key={outlet.slug}>
                <Link href={mediaOutletHref(outlet.slug, locale)} className={styles.outlet}>
                  <LogoImage logo={outlet.logo} alt={outlet.name} className={styles.outletLogo} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  )
}

function LogoImage({ logo, alt, className }: { logo: Logo; alt: string; className?: string }) {
  return (
    <Image
      src={logo.src}
      alt={alt}
      width={logo.width}
      height={logo.height}
      unoptimized
      className={className}
      style={{ width: logo.width, height: logo.height }}
    />
  )
}

/**
 * The logo marquee across the top of the Newsroom — Figma "Component 6"
 * (685:3744): full width at x=5 (1430 wide), 32px logos in #697077, 23px
 * apart, scrolling right-to-left one 1454px set every 10 s, linear, endless.
 * Stops for prefers-reduced-motion (handled by <Marquee>).
 */
export function MediaLogoStrip({
  logos,
  label,
  seconds,
  gap,
}: {
  logos: Logo[]
  label: string
  seconds: number
  gap: number
}) {
  if (logos.length === 0) return null
  return (
    <Marquee duration={seconds} gap={gap} direction="left" label={label} className={styles.strip}>
      {logos.map((logo, i) => (
        <LogoImage key={`${logo.src}-${i}`} logo={logo} alt={logo.name} className={styles.stripLogo} />
      ))}
    </Marquee>
  )
}
