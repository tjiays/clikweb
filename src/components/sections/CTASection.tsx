import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import { imageAlt, imageUrl } from '@/lib/content'
import styles from './CTASection.module.css'

/**
 * The closing block used at the bottom of most pages: a cross-link card and a
 * "Siap…" banner. One reusable component, editable per page in the CMS, and
 * either half is optional (confirmed decision 7).
 */
export function CTASection({ block }: { block: any }) {
  if (!block) return null

  const cross = block.crossLink
  const banner = block.banner
  const hasCross = cross && (cross.title || cross.label)
  const hasBanner = banner && (banner.title || banner.buttonLabel)

  if (!hasCross && !hasBanner) return null

  return (
    <>
      {hasCross && (
        <Container>
          <Link href={cross.targetUrl || '#'} className={styles.cross}>
            {imageUrl(cross.image) && (
              <Image
                src={imageUrl(cross.image) as string}
                alt={imageAlt(cross.image)}
                width={480}
                height={320}
                className={styles.crossImage}
              />
            )}
            <span className={styles.crossBody}>
              {cross.label && <span className={styles.crossLabel}>{cross.label}</span>}
              {cross.title && <span className="t-h3">{cross.title}</span>}
            </span>
          </Link>
        </Container>
      )}

      {hasBanner && (
        <section className={styles.banner}>
          {imageUrl(banner.backgroundImage) && (
            <Image
              src={imageUrl(banner.backgroundImage) as string}
              alt=""
              fill
              sizes="100vw"
              className={styles.bannerImage}
            />
          )}
          <div className={styles.bannerOverlay} />
          <Container className={styles.bannerInner}>
            {banner.title && <h2 className="t-cta-title">{banner.title}</h2>}
            {banner.text && <p className={styles.bannerText}>{banner.text}</p>}
            {banner.buttonLabel && (
              <Button href={banner.buttonLink || '#'} size="lg">
                {banner.buttonLabel}
              </Button>
            )}
          </Container>
        </section>
      )}
    </>
  )
}
