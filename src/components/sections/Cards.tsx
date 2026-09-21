import type { ComponentProps } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ShareButton } from '@/components/ui/ShareButton'
import styles from './Cards.module.css'

/**
 * Home stats card (Figma 266:465 / 473 / 482): 421x196 #F1FAFF, radius 20,
 * orange 50px icon, number 38/700 and label 23.75/400 in navy.
 * Hover / keyboard focus (266:467, 0.3s ease-out): 1px navy border and the
 * content is replaced by `description` (24/400, line 25, black, left).
 * Without a description there is no hover state.
 */
export function StatCard({
  value,
  label,
  description,
  iconUrl,
  iconAlt,
  iconWidth = 50,
  iconHeight = 50,
}: {
  value: string
  label?: string | null
  description?: string | null
  iconUrl?: string | null
  iconAlt?: string
  iconWidth?: number
  iconHeight?: number
}) {
  return (
    <div className={`${styles.stat} ${description ? styles.statFlip : ''}`} tabIndex={description ? 0 : undefined}>
      <div className={styles.statFront}>
        {iconUrl && (
          <Image
            src={iconUrl}
            alt={iconAlt ?? ''}
            width={iconWidth}
            height={iconHeight}
            className={styles.statIcon}
            style={{ width: iconWidth, height: iconHeight }}
          />
        )}
        <div className={styles.statValue}>{value}</div>
        {label && <div className={styles.statLabel}>{label}</div>}
      </div>
      {description && <p className={styles.statBack}>{description}</p>}
    </div>
  )
}

/**
 * Solution card.
 * - variant "home" (default): Home carousel, Figma Component 28 (1780:10846):
 *   346x341 #F1FAFF, radius 20, shadow 0 4 4 #000@25%, centred; ~110px icon,
 *   title 28/700 navy, text 16/400 line 21.8 black, primary button 191x46.
 * - variant "products": Layanan dan Produk carousel, Component 17 (1343:5924):
 *   360x500, 160px illustration, title 28/700, text 18/400 line 30 (260 wide).
 */
export function SolutionCard({
  title,
  text,
  href,
  linkLabel,
  iconUrl,
  iconAlt,
  variant = 'home',
}: {
  title: string
  text?: string | null
  href: string
  linkLabel: string
  iconUrl?: string | null
  iconAlt?: string
  variant?: 'home' | 'products'
}) {
  const iconSize = variant === 'products' ? 160 : 110
  return (
    <article className={`${styles.solution} ${variant === 'products' ? styles.solutionProducts : ''}`}>
      {iconUrl && (
        <Image
          src={iconUrl}
          alt={iconAlt ?? ''}
          width={iconSize * 2}
          height={iconSize * 2}
          className={styles.solutionIcon}
        />
      )}
      <h3 className={styles.solutionTitle}>{title}</h3>
      {text && <p className={styles.solutionText}>{text}</p>}
      <div className={styles.solutionAction}>
        <Button href={href} width={191}>
          {linkLabel}
        </Button>
      </div>
    </article>
  )
}

/**
 * Partner testimonial (Figma Component 4, 627:5394): 454x216 #F1FAFF with a
 * 1px black stroke, radius 20; partner logo top-left (25,21); quote
 * 15.625/600, line 21.3, black, centred. No name caption — the partner name
 * is only the logo's alt text (or shown as text when there is no logo).
 */
export function TestimonialCard({
  partnerName,
  quote,
  logoUrl,
  logoAlt,
}: {
  partnerName: string
  quote?: string | null
  logoUrl?: string | null
  logoAlt?: string
}) {
  return (
    <figure className={styles.testimonial}>
      {logoUrl ? (
        <Image src={logoUrl} alt={logoAlt ?? partnerName} width={340} height={78} className={styles.testimonialLogo} />
      ) : (
        <figcaption className={styles.testimonialName}>{partnerName}</figcaption>
      )}
      {quote && <blockquote className={styles.quote}>{quote}</blockquote>}
    </figure>
  )
}

type ArticleVariant = 'news' | 'report' | 'related' | 'home'

function ExternalLink(props: ComponentProps<'a'>) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />
}

/**
 * Article / report card.
 *
 * variant
 *   news     (default) Newsroom grid, Figma 1661:8960: 406x660, radius 10,
 *            shadow 0 4 4 #000@25%, image 406x232, author left + date right
 *            (16/400 black@50%), title 24/800 navy (3 lines), excerpt
 *            16/400 line 21.8 (4 lines), underlined READ MORE + 40px share
 *            circle pinned to the bottom.
 *   report   Laporan list (730:3688): as news, title 26/800 line 36.
 *   related  Detail Berita "Anda mungkin juga…" and Liputan Media (560:2970):
 *            406x565, title 26/800 line 35.5.
 *   home     Home "Berita Terbaru" (156:1076): 416x819, radius 15, shadow
 *            0 2 30 rgba(72,73,121,.21), image 416x260 radius 15, date only
 *            (14px #9A9A9A, right), title 30/800 line 40.9, excerpt 8 lines,
 *            footer row with a 1px rgba(0,0,0,.1) top border and a 45x44 share.
 *
 * The share button uses the Web Share API, falling back to copying the link.
 * Cards in a CSS grid row stretch to equal heights.
 */
export function ArticleCard({
  title,
  excerpt,
  href,
  date,
  author,
  imageUrl,
  imageAlt,
  readMoreLabel,
  shareLabel,
  variant = 'news',
  external = false,
  className,
}: {
  title: string
  excerpt?: string | null
  href: string
  date?: string | null
  author?: string | null
  imageUrl?: string | null
  imageAlt?: string
  readMoreLabel: string
  /** Accessible name for the share button ("Bagikan" / "Share"). */
  shareLabel?: string
  variant?: ArticleVariant
  /** The card points at another site (Liputan Media): open it in a new tab. */
  external?: boolean
  className?: string
}) {
  const showAuthor = variant !== 'home' && author
  const CardLink = external ? ExternalLink : Link
  return (
    <article className={[styles.article, styles[variant], className].filter(Boolean).join(' ')}>
      <CardLink href={href} className={styles.articleMedia} tabIndex={-1} aria-hidden="true">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? ''}
            width={832}
            height={520}
            sizes="(max-width: 768px) 100vw, 416px"
            className={styles.articleImage}
          />
        ) : (
          <div className={styles.articlePlaceholder} />
        )}
      </CardLink>
      <div className={styles.articleBody}>
        {(showAuthor || date) && (
          <p className={styles.articleMeta}>
            {showAuthor && <span className={styles.author}>{author}</span>}
            {date && <time className={styles.date}>{date}</time>}
          </p>
        )}
        <h3 className={styles.articleTitle}>
          <CardLink href={href}>{title}</CardLink>
        </h3>
        {excerpt && <p className={styles.articleExcerpt}>{excerpt}</p>}
        <div className={styles.articleFooter}>
          <CardLink href={href} className={`t-link-caps ${styles.readMore}`}>
            {readMoreLabel}
          </CardLink>
          <ShareButton url={href} title={title} label={shareLabel} size={variant === 'home' ? 45 : 40} />
        </div>
      </div>
    </article>
  )
}
