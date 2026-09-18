import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import styles from './Cards.module.css'

/** Home stats: icon, big number, label. Has a hover state, as in Figma. */
export function StatCard({
  value,
  label,
  iconUrl,
  iconAlt,
}: {
  value: string
  label?: string | null
  iconUrl?: string | null
  iconAlt?: string
}) {
  return (
    <div className={styles.stat}>
      {iconUrl && (
        <Image src={iconUrl} alt={iconAlt ?? ''} width={56} height={56} className={styles.statIcon} />
      )}
      <div className={styles.statValue}>{value}</div>
      {label && <div className={styles.statLabel}>{label}</div>}
    </div>
  )
}

/** Solution card in the homepage carousel and the Layanan dan Produk grid. */
export function SolutionCard({
  title,
  text,
  href,
  linkLabel,
  iconUrl,
  iconAlt,
}: {
  title: string
  text?: string | null
  href: string
  linkLabel: string
  iconUrl?: string | null
  iconAlt?: string
}) {
  return (
    <article className={styles.solution}>
      {iconUrl && (
        <Image src={iconUrl} alt={iconAlt ?? ''} width={64} height={64} className={styles.solutionIcon} />
      )}
      <h3 className="t-h3">{title}</h3>
      {text && <p className={styles.solutionText}>{text}</p>}
      <div className={styles.solutionAction}>
        <Button href={href} variant="outline" size="md">
          {linkLabel}
        </Button>
      </div>
    </article>
  )
}

/** Partner testimonial: logo plus quote. */
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
        <Image src={logoUrl} alt={logoAlt ?? partnerName} width={120} height={50} className={styles.testimonialLogo} />
      ) : (
        <div className={styles.testimonialName}>{partnerName}</div>
      )}
      {quote && <blockquote className={styles.quote}>{quote}</blockquote>}
      <figcaption className={styles.testimonialCaption}>{partnerName}</figcaption>
    </figure>
  )
}

/** Article card used on the homepage and in the Newsroom. */
export function ArticleCard({
  title,
  excerpt,
  href,
  date,
  author,
  imageUrl,
  imageAlt,
  readMoreLabel,
}: {
  title: string
  excerpt?: string | null
  href: string
  date?: string | null
  author?: string | null
  imageUrl?: string | null
  imageAlt?: string
  readMoreLabel: string
}) {
  return (
    <article className={styles.article}>
      <Link href={href} className={styles.articleMedia}>
        {imageUrl ? (
          <Image src={imageUrl} alt={imageAlt ?? ''} width={768} height={512} className={styles.articleImage} />
        ) : (
          <div className={styles.articlePlaceholder} aria-hidden="true" />
        )}
      </Link>
      <div className={styles.articleBody}>
        {(author || date) && (
          <p className={styles.articleMeta}>
            {author && <span>{author}</span>}
            {author && date && <span aria-hidden="true"> · </span>}
            {date && <time>{date}</time>}
          </p>
        )}
        <h3 className="t-card-title">
          <Link href={href}>{title}</Link>
        </h3>
        {excerpt && <p className={styles.articleExcerpt}>{excerpt}</p>}
        <Link href={href} className={`t-link-caps ${styles.readMore}`}>
          {readMoreLabel}
        </Link>
      </div>
    </article>
  )
}
